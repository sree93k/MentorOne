import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import AboutStep from "./WelcomeComponents/AboutStep";
import ProfileStep from "./WelcomeComponents/ProfileStep";
import ExperienceStep from "./WelcomeComponents/ExperienceStep";
import SuccessStep from "./WelcomeComponents/SuccessStep";
import ProgressIndicator from "./WelcomeComponents/ProgressIndicator";

type UserType = "school" | "college" | "fresher" | "professional";

export interface WelcomeFormData {
  userType: UserType;
  schoolName?: string;
  class?: string;
  course?: string;
  specializedIn?: string;
  collegeName?: string;
  startDate?: string;
  endDate?: string;
  experience?: string;
  jobRole?: string;
  company?: string;
  currentlyWorking?: boolean;
  city: string;
  imageFile?: File;
  imageUrl?: string;
  careerGoals?: string;
  interestedNewcareer?: string[];
  goals?: string[];
  skills?: string[];
  bio?: string;
  linkedinUrl?: string;
  youtubeLink?: string;
  portfolio?: string;
  selfIntro?: string;
  featuredArticle?: string;
  mentorMotivation?: string;
  achievements?: string;
}
// Define the FormData interface to match the structure of the form data
interface FormData {
  userType: string;
  schoolName: string;
  class: string;
  course: string;
  specializedIn: string;
  collegeName: string;
  startDate: string;
  endDate: string;
  experience: string;
  jobRole: string;
  company: string;
  currentlyWorking: boolean;
  city: string;
  careerGoals: string;
  interestedNewcareer: string[];
  goals: string[];
  skills: string[];
  bio: string;
  linkedinUrl: string;
  youtubeLink: string;
  portfolio: string;
  selfIntro: string;
  featuredArticle: string;
  mentorMotivation: string;
  achievements: string;
}
interface WelcomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: WelcomeFormData) => Promise<boolean>;
  approvalStatus: string | null;
  approvalReason: string | null;
}

function WelcomeModal({
  open,
  onOpenChange,
  onSubmit,
  approvalStatus,
  approvalReason,
}: WelcomeModalProps) {
  const [step, setStep] = useState<
    "about" | "profile" | "experience" | "success"
  >("about");
  const [formData, setFormData] = useState<WelcomeFormData>({
    userType: "college",
    city: "",
    interestedNewcareer: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mentorActivated, user } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    if (open && user) {
      setFormData({
        userType: user.userType || "college",
        schoolName: user.schoolName || "",
        class: user.class || "",
        course: user.course || "",
        specializedIn: user.specializedIn || "",
        collegeName: user.collegeName || "",
        startDate: user.startDate || "",
        endDate: user.endDate || "",
        experience: user.experience || "",
        jobRole: user.jobRole || "",
        company: user.company || "",
        currentlyWorking: user.currentlyWorking || false,
        city: user.city || "",
        careerGoals: user.careerGoals || "",
        interestedNewcareer: user.interestedNewcareer || [],
        goals: user.goals || [],
        skills: user.skills || [],
        bio: user.bio || "",
        linkedinUrl: user.linkedinUrl || "",
        youtubeLink: user.youtubeLink || "",
        portfolio: user.portfolio || "",
        selfIntro: user.selfIntro || "",
        featuredArticle: user.featuredArticle || "",
        mentorMotivation: user.mentorMotivation || "",
        achievements: user.achievements || "",
      });
      setStep("about");
      // if (isApproved === "Rejected") {
      //   setStep("about");
      // } else if (activated === true && mentorActivated === false) {
      //   setStep("profile");
      // }
    }
  }, [open, user]);

  useEffect(() => {
    if (mentorActivated && open) {
      onOpenChange(false);
    }
  }, [mentorActivated, open, onOpenChange]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const success = await onSubmit(formData);
    setIsSubmitting(false);
    if (success) {
      setStep("success");
      setTimeout(() => onOpenChange(false), 5000);
    }
  };

  const isAboutStepValid = () => {
    if (!formData.city.trim() || !formData.imageFile) return false;
    switch (formData.userType) {
      case "school":
        return !!(formData.schoolName?.trim() && formData.class);
      case "college":
      case "fresher":
        return !!(
          formData.course?.trim() &&
          formData.specializedIn?.trim() &&
          formData.collegeName?.trim()
        );
      case "professional":
        return !!(
          formData.experience &&
          formData.jobRole?.trim() &&
          formData.company?.trim() &&
          formData.startDate &&
          formData.endDate
        );
      default:
        return false;
    }
  };

  const isProfileStepValid = () => {
    return !!(
      formData.skills?.length &&
      formData.bio?.trim() &&
      formData.interestedNewcareer?.length
    );
  };

  const isExperienceStepValid = () => {
    return !!formData.mentorMotivation?.trim();
  };

  const canProceed = () => {
    if (step === "about") return isAboutStepValid();
    if (step === "profile") return isProfileStepValid();
    if (step === "experience") return isExperienceStepValid();
    return true;
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen && !mentorActivated) return;
        onOpenChange(newOpen);
      }}
    >
      <DialogContent className="sm:max-w-2xl p-2 border-t-4 border-b-4 border-blue-600 rounded-lg bg-white">
        <DialogTitle className="sr-only">Apply as a Mentor</DialogTitle>
        <div className="min-h-screen bg-gray-50 p-2 md:p-8">
          <Card className="max-w-3xl mx-auto p-2 md:p-8">
            <h1 className="text-3xl font-bold mb-2">Apply as a Mentor</h1>
            {step !== "success" && <ProgressIndicator step={step} />}
            {step === "about" && (
              <AboutStep
                formData={formData}
                setFormData={setFormData}
                approvalStatus={approvalStatus}
                approvalReason={approvalReason}
              />
            )}
            {step === "profile" && (
              <ProfileStep formData={formData} setFormData={setFormData} />
            )}
            {step === "experience" && (
              <ExperienceStep formData={formData} setFormData={setFormData} />
            )}
            {step === "success" && (
              <SuccessStep
                setLogoutModalOpen={function (open: boolean): void {
                  throw new Error("Function not implemented.");
                }}
                loggingOut={false}
                handleLogout={function (): Promise<void> {
                  throw new Error("Function not implemented.");
                }}
              />
            )}
            {step !== "success" && (
              <div className="mt-8 flex justify-between">
                {step !== "about" && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      setStep(step === "experience" ? "profile" : "about")
                    }
                  >
                    Previous
                  </Button>
                )}
                <div className="flex-1" />
                <Button
                  className="bg-black text-white"
                  onClick={() => {
                    if (step === "about" && isAboutStepValid())
                      setStep("profile");
                    else if (step === "profile" && isProfileStepValid())
                      setStep("experience");
                    else if (step === "experience" && isExperienceStepValid())
                      handleSubmit();
                  }}
                  disabled={isSubmitting || !canProceed()}
                >
                  {step === "experience"
                    ? isSubmitting
                      ? "Submitting..."
                      : "Submit"
                    : "Next"}
                </Button>
              </div>
            )}
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default WelcomeModal;
