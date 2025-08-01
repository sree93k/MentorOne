import { useState, useEffect } from "react";
import {
  useParams,
  useSearchParams,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { toast } from "react-hot-toast";
import appealService, {
  AppealSubmissionData,
  ExistingAppeal,
} from "@/services/appealService";

type AppealState =
  | "loading"
  | "no_appeal"
  | "pending"
  | "approved"
  | "rejected_can_reappeal"
  | "rejected_final"
  | "submitting";

interface BlockData {
  reason: string;
  category: string;
  adminEmail: string;
  timestamp: string;
  canAppeal: boolean;
  severity?: "high" | "medium" | "low";
}

export const useAppealManagement = () => {
  const { appealId } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  // Get context data
  const emailFromUrl = searchParams.get("email");
  const blockData = location.state?.blockData as BlockData | undefined;

  // Appeal state
  const [appealState, setAppealState] = useState<AppealState>("loading");
  const [currentAppeal, setCurrentAppeal] = useState<ExistingAppeal | null>(
    null
  );
  const [refreshing, setRefreshing] = useState(false);

  // Form state
  const [formData, setFormData] = useState<AppealSubmissionData>({
    email: "",
    firstName: "",
    lastName: "",
    appealMessage: "",
    category: "wrongful_block",
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Initialize component
  useEffect(() => {
    initializeAppealPage();
  }, [appealId, emailFromUrl]);

  // Initialize form data
  useEffect(() => {
    const userInfo = appealService.getUserInfoFromStorage(
      emailFromUrl || undefined
    );
    setFormData((prev) => ({
      ...prev,
      ...userInfo,
      appealMessage: "",
    }));
  }, [emailFromUrl]);
  // ✅ AUTO-REFRESH: Clear "just submitted" state after 10 seconds
  useEffect(() => {
    if (location.state?.appealJustSubmitted) {
      const timer = setTimeout(() => {
        // Clear the "just submitted" state by updating location state
        navigate(location.pathname + location.search, {
          replace: true,
          state: {
            ...location.state,
            appealJustSubmitted: false,
          },
        });
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [
    location.state?.appealJustSubmitted,
    navigate,
    location.pathname,
    location.search,
  ]);
  /**
   * 🔧 Main initialization logic
   */
  const initializeAppealPage = async () => {
    try {
      setAppealState("loading");

      if (appealId) {
        // Load specific appeal from URL
        await loadSpecificAppeal(appealId);
      } else {
        // Check for existing appeals
        await checkExistingAppeals();
      }
    } catch (error) {
      console.error("❌ AppealManagement: Initialization error", error);
      setAppealState("no_appeal");
    }
  };

  /**
   * 🆕 Load specific appeal by ID
   */
  const loadSpecificAppeal = async (id: string) => {
    try {
      console.log("🔍 AppealManagement: Loading specific appeal", {
        appealId: id,
      });

      const result = await appealService.getAppealStatus(id);

      if (result.success && result.data) {
        setCurrentAppeal(result.data);
        determineAppealState(result.data);
        console.log("✅ AppealManagement: Specific appeal loaded", result.data);
      } else {
        console.log("❌ AppealManagement: Specific appeal not found");
        toast.error("Appeal not found or access denied");
        await checkExistingAppeals(); // Fallback
      }
    } catch (error) {
      console.error(
        "❌ AppealManagement: Error loading specific appeal",
        error
      );
      await checkExistingAppeals(); // Fallback
    }
  };

  /**
   * 🔧 Check for existing appeals by email
   */
  const checkExistingAppeals = async () => {
    try {
      const userEmail =
        emailFromUrl || appealService.getUserInfoFromStorage().email;

      if (userEmail) {
        console.log(
          "🔍 AppealManagement: Checking existing appeals for",
          userEmail
        );

        const result = await appealService.getLatestAppealByEmail(userEmail);

        if (result.success && result.data) {
          setCurrentAppeal(result.data);
          determineAppealState(result.data);
          console.log(
            "✅ AppealManagement: Found existing appeal",
            result.data
          );
        } else {
          console.log("ℹ️ AppealManagement: No existing appeal found");
          setAppealState("no_appeal");
        }
      } else {
        setAppealState("no_appeal");
      }
    } catch (error) {
      console.error(
        "❌ AppealManagement: Error checking existing appeals",
        error
      );
      setAppealState("no_appeal");
    }
  };

  /**
   * 🔧 Determine appeal state based on appeal data
   */
  const determineAppealState = (appeal: ExistingAppeal) => {
    switch (appeal.status) {
      case "pending":
      case "under_review":
        setAppealState("pending");
        break;

      case "approved":
        setAppealState("approved");
        break;

      case "rejected":
        if (appeal.canReappeal && appeal.appealCount < 2) {
          setAppealState("rejected_can_reappeal");
        } else {
          setAppealState("rejected_final");
        }
        break;

      default:
        setAppealState("no_appeal");
    }
  };

  /**
   * 🔧 Handle form input changes
   */
  const handleInputChange = (
    field: keyof AppealSubmissionData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors.length > 0) {
      setErrors([]);
    }
  };

  /**
   * 🔧 Submit appeal
   */
  const handleSubmitAppeal = async () => {
    try {
      setAppealState("submitting");
      setErrors([]);

      const validation = appealService.validateAppealData(formData);

      if (!validation.isValid) {
        setErrors(validation.errors);
        setAppealState(currentAppeal ? "rejected_can_reappeal" : "no_appeal");
        return;
      }

      const result = await appealService.submitAppeal(formData);

      if (result.success) {
        // Update current appeal data
        const newAppealData: ExistingAppeal = {
          _id: result.data?.appealId || "",
          status: "pending",
          appealCount: (currentAppeal?.appealCount || 0) + 1,
          canReappeal: true,
          submittedAt: new Date().toISOString(),
          category: formData.category || "wrongful_block",
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        };

        setCurrentAppeal(newAppealData);
        setAppealState("pending");
        setShowForm(false);
        const statusUrl = `/appeal/status/${
          result.data?.appealId
        }?email=${encodeURIComponent(formData.email)}`;
        console.log("🔗 Navigating to appeal status URL:", statusUrl);

        navigate(statusUrl, {
          replace: true, // ✅ Replace current URL in history
          state: {
            blockData,
            appealJustSubmitted: true, // ✅ Flag to show success message
          },
        });
        toast.success(
          newAppealData.appealCount === 1
            ? "Appeal submitted successfully!"
            : "Re-appeal submitted successfully!"
        );
      } else {
        setErrors([result.message]);
        setAppealState(currentAppeal ? "rejected_can_reappeal" : "no_appeal");
      }
    } catch (error: any) {
      console.error("❌ AppealManagement: Error submitting appeal", error);
      setErrors(["An unexpected error occurred. Please try again."]);
      setAppealState(currentAppeal ? "rejected_can_reappeal" : "no_appeal");
    }
  };

  /**
   * 🆕 Manual refresh functionality
   */
  const handleRefreshStatus = async () => {
    setRefreshing(true);

    if (appealId) {
      await loadSpecificAppeal(appealId);
    } else {
      await checkExistingAppeals();
    }

    setRefreshing(false);
    toast.success("Status refreshed");
  };

  const handleStartReappeal = () => {
    if (currentAppeal?.canReappeal && currentAppeal.appealCount < 2) {
      console.log("🔍 Starting re-appeal, clearing form data");
      console.log(
        "🔍 Current appeal message before clear:",
        formData.appealMessage
      );
      console.log(
        "🔍 Admin response (should NOT be in textarea):",
        currentAppeal?.adminResponse
      );

      // ✅ CLEAR the appeal message when starting re-appeal
      setFormData((prev) => ({
        ...prev,
        appealMessage: "", // ✅ Always start with empty message
      }));
      setErrors([]);
      setShowForm(true);

      console.log("✅ Form cleared for re-appeal");
    } else {
      toast.error(
        "You have reached the maximum number of appeals. Please contact support directly."
      );
    }
  };

  const handleStartAppeal = () => {
    // ✅ CLEAR the appeal message when starting first appeal
    setFormData((prev) => ({
      ...prev,
      appealMessage: "", // ✅ Always start with empty message
    }));
    setErrors([]);
    setShowForm(true);
  };

  /**
   * 🔧 Cancel form
   */
  const handleCancelForm = () => {
    setShowForm(false);
    setErrors([]);
  };
  const resetFormMessage = () => {
    setFormData((prev) => ({
      ...prev,
      appealMessage: "", // ✅ Clear only the message, keep user info
    }));
    setErrors([]);
  };
  return {
    // State
    appealState,
    currentAppeal,
    refreshing,
    blockData,

    // Form state
    formData,
    errors,
    showForm,
    appealJustSubmitted: location.state?.appealJustSubmitted || false,
    // Actions
    handleInputChange,
    handleSubmitAppeal,
    handleRefreshStatus,
    handleStartReappeal,
    handleStartAppeal,
    handleCancelForm,
    resetFormMessage,
    // Computed values
    isLoading: appealState === "loading",
    isSubmitting: appealState === "submitting",
    canSubmitForm: formData.appealMessage.length >= 10,
  };
};
