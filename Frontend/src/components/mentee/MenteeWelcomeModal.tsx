import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BriefcaseIcon,
  GraduationCapIcon,
  Users2Icon,
  UserIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  XIcon,
  CheckIcon,
  SearchIcon,
} from "lucide-react";
import { RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";

// Define the possible user types
type UserType = "school" | "college" | "fresher" | "professional";

// Define the shape of the form data for both forms
interface FormData {
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
  careerGoals?: string;
  interestedNewcareer?: string[];
  goals?: string[];
}

// Define the props for the component
interface WelcomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => Promise<boolean>;
}

// Predefined career options
const careerOptions = [
  "Software Developer",
  "Data Scientist",
  "UI/UX Designer",
  "Product Manager",
  "Digital Marketing",
  "Content Writer",
  "Graphic Designer",
  "Business Analyst",
  "Machine Learning Engineer",
  "Project Manager",
  "DevOps Engineer",
  "Full Stack Developer",
  "Front-end Developer",
  "Back-end Developer",
];

export function WelcomeModal({
  open,
  onOpenChange,
  onSubmit,
}: WelcomeModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    userType: "college",
    city: "",
    interestedNewcareer: [],
    goals: [],
  });
  const [loading, setLoading] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [isForm1Valid, setIsForm1Valid] = useState(false);
  const [isForm2Valid, setIsForm2Valid] = useState(false);
  const [careerSearchTerm, setCareerSearchTerm] = useState("");
  const [filteredCareers, setFilteredCareers] = useState<string[]>([]);
  const [showCareerDropdown, setShowCareerDropdown] = useState(false);

  const { user } = useSelector((state: RootState) => state.user);

  // Generate year options for the last 20 years
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 21 }, (_, i) =>
    (currentYear - 20 + i).toString()
  );

  // **New useEffect to handle step skipping based on mentorId**
  useEffect(() => {
    if (open && user) {
      // Initialize formData with existing user data
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
      });

      // Skip to second form if mentorId exists
      if (user.mentorId) {
        setStep(2);
        setProgressValue(50);
      } else {
        setStep(1);
        setProgressValue(0);
      }
    }
  }, [open, user]);

  // Filter careers based on search term
  useEffect(() => {
    if (careerSearchTerm.trim() === "") {
      setFilteredCareers([]);
      return;
    }
    const filtered = careerOptions.filter((career) =>
      career.toLowerCase().includes(careerSearchTerm.toLowerCase())
    );
    setFilteredCareers(filtered);
  }, [careerSearchTerm]);

  // Validate form 1
  useEffect(() => {
    const validateForm1 = () => {
      if (!formData.city.trim()) return false;
      switch (formData.userType) {
        case "school":
          return !!(formData.schoolName?.trim() && formData.class);
        case "college":
        case "fresher":
          return !!(
            formData.course &&
            formData.specializedIn &&
            formData.collegeName?.trim()
          );
        case "professional":
          return !!(
            formData.experience &&
            formData.jobRole &&
            formData.company?.trim()
          );
        default:
          return false;
      }
    };
    setIsForm1Valid(validateForm1());
  }, [formData]);

  // Validate form 2
  useEffect(() => {
    const validateForm2 = () => {
      return !!(
        formData.goals &&
        formData.goals.length > 0 &&
        formData.careerGoals
      );
    };
    setIsForm2Valid(validateForm2());
  }, [formData.goals, formData.careerGoals]);

  // Handle input changes
  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean | string[]
  ) => {
    if (
      typeof value === "string" &&
      ["schoolName", "collegeName", "company", "city"].includes(field)
    ) {
      if (!/^[a-zA-Z0-9\s.,'-]*$/.test(value)) {
        return;
      }
    }
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleOption = (option: string) => {
    setFormData((prev) => {
      const current = prev.goals || [];
      const updated = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option];
      return { ...prev, goals: updated };
    });
  };

  const addCareerInterest = (career: string) => {
    if (!career.trim()) return;
    setFormData((prev) => {
      const current = prev.interestedNewcareer || [];
      if (!current.includes(career)) {
        return {
          ...prev,
          interestedNewcareer: [...current, career],
        };
      }
      return prev;
    });
    setCareerSearchTerm("");
    setShowCareerDropdown(false);
  };

  const removeCareerInterest = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      interestedNewcareer: (prev.interestedNewcareer || []).filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleNext = () => {
    if (isForm1Valid) {
      setProgressValue(50);
      setStep(2);
    }
  };

  const handleBack = () => {
    setProgressValue(0);
    setStep(1);
  };

  const handleSubmit = async () => {
    if (isForm2Valid) {
      setLoading(true);
      const submitData = {
        ...formData,
        id: user?._id, // Assuming user.id is available
        isUpdate: !!user?.mentorId, // Set to true if mentorId exists (indicating an update)
      };
      console.log("Submitting form data:", submitData);
      const success = await onSubmit(submitData); // Your API call function
      setLoading(false);
      if (success) {
        onOpenChange(false); // Close modal or form
      }
    }
  };

  const renderSchoolForm = () => (
    <div className="space-y-4">
      <div>
        <Label>School Name*</Label>
        <Input
          placeholder="Enter your school name"
          value={formData.schoolName || ""}
          onChange={(e) => handleInputChange("schoolName", e.target.value)}
          className="bg-white"
        />
      </div>
      <div>
        <Label>Current Class*</Label>
        <div className="grid grid-cols-6 gap-2 mt-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
            <Button
              key={num}
              variant={
                formData.class === num.toString() ? "default" : "outline"
              }
              onClick={() => handleInputChange("class", num.toString())}
              className={`h-10 w-full ${
                formData.class === num.toString()
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-white text-gray-800 hover:bg-gray-100 hover:text-blue-600 border-gray-300"
              }`}
            >
              {num}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCollegeForm = () => (
    <div className="space-y-4">
      <div>
        <Label>Course*</Label>
        <Select
          value={formData.course}
          onValueChange={(value) => handleInputChange("course", value)}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select Course" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="btech">B.Tech</SelectItem>
            <SelectItem value="bsc">B.Sc</SelectItem>
            <SelectItem value="bca">BCA</SelectItem>
            <SelectItem value="mca">MCA</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Course Specialization*</Label>
        <Select
          value={formData.specializedIn}
          onValueChange={(value) => handleInputChange("specializedIn", value)}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select Specialization" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="cs">Computer Science</SelectItem>
            <SelectItem value="it">Information Technology</SelectItem>
            <SelectItem value="ec">Electronics</SelectItem>
            <SelectItem value="me">Mechanical</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Start Year</Label>
          <Select
            value={formData.startDate}
            onValueChange={(value) => handleInputChange("startDate", value)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent className="bg-white max-h-56 overflow-y-auto">
              {yearOptions.map((year) => (
                <SelectItem key={`start-${year}`} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>End Year</Label>
          <Select
            value={formData.endDate}
            onValueChange={(value) => handleInputChange("endDate", value)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent className="bg-white max-h-56 overflow-y-auto">
              {yearOptions.map((year) => (
                <SelectItem key={`end-${year}`} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label>College Name*</Label>
        <Input
          placeholder="Enter your college name"
          value={formData.collegeName || ""}
          onChange={(e) => handleInputChange("collegeName", e.target.value)}
          className="bg-white"
        />
      </div>
    </div>
  );

  const renderProfessionalForm = () => (
    <div className="space-y-4">
      <div>
        <Label>Total Working Experience*</Label>
        <Select
          value={formData.experience}
          onValueChange={(value) => handleInputChange("experience", value)}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select Experience" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="0-1">0-1 years</SelectItem>
            <SelectItem value="1-3">1-3 years</SelectItem>
            <SelectItem value="3-5">3-5 years</SelectItem>
            <SelectItem value="5+">5+ years</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Current Job Role*</Label>
        <Select
          value={formData.jobRole}
          onValueChange={(value) => handleInputChange("jobRole", value)}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select Job Role" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="sde">Software Developer</SelectItem>
            <SelectItem value="designer">UI/UX Designer</SelectItem>
            <SelectItem value="pm">Product Manager</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Current Company*</Label>
        <Input
          placeholder="Enter company name"
          value={formData.company || ""}
          onChange={(e) => handleInputChange("company", e.target.value)}
          className="bg-white"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="currentlyWorking"
          checked={formData.currentlyWorking}
          onCheckedChange={(checked) =>
            handleInputChange("currentlyWorking", !!checked)
          }
        />
        <label
          htmlFor="currentlyWorking"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Currently working in this role
        </label>
      </div>
    </div>
  );

  const renderSecondForm = () => (
    <div className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Ready to Be Master ONE!</h2>
          <p className="text-gray-500 mb-4">Plan your Career</p>
          <Progress value={66} className="h-2 mb-4" />
        </div>
        <div>
          <Label className="mb-2 block">
            Select your goals (multiple selection allowed)*
          </Label>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className={`flex items-center gap-2 justify-start ${
                formData.goals?.includes("To find a Job")
                  ? "bg-blue-100 border-blue-500 text-blue-700"
                  : "bg-white text-gray-800 hover:bg-gray-50"
              }`}
              onClick={() => toggleOption("To find a Job")}
            >
              <BriefcaseIcon className="w-4 h-4" />
              To find a Job
              {formData.goals?.includes("To find a Job") && (
                <CheckIcon className="w-4 h-4 ml-auto" />
              )}
            </Button>
            <Button
              variant="outline"
              className={`flex items-center gap-2 justify-start ${
                formData.goals?.includes("Compete & Upskill")
                  ? "bg-blue-100 border-blue-500 text-blue-700"
                  : "bg-white text-gray-800 hover:bg-gray-50"
              }`}
              onClick={() => toggleOption("Compete & Upskill")}
            >
              <GraduationCapIcon className="w-4 h-4" />
              Compete & Upskill
              {formData.goals?.includes("Compete & Upskill") && (
                <CheckIcon className="w-4 h-4 ml-auto" />
              )}
            </Button>
            <Button
              variant="outline"
              className={`flex items-center gap-2 justify-start ${
                formData.goals?.includes("To Host an Event")
                  ? "bg-blue-100 border-blue-500 text-blue-700"
                  : "bg-white text-gray-800 hover:bg-gray-50"
              }`}
              onClick={() => toggleOption("To Host an Event")}
            >
              <Users2Icon className="w-4 h-4" />
              To Host an Event
              {formData.goals?.includes("To Host an Event") && (
                <CheckIcon className="w-4 h-4 ml-auto" />
              )}
            </Button>
            <Button
              variant="outline"
              className={`flex items-center gap-2 justify-start ${
                formData.goals?.includes("To be a Mentor")
                  ? "bg-blue-100 border-blue-500 text-blue-700"
                  : "bg-white text-gray-800 hover:bg-gray-50"
              }`}
              onClick={() => toggleOption("To be a Mentor")}
            >
              <UserIcon className="w-4 h-4" />
              To be a Mentor
              {formData.goals?.includes("To be a Mentor") && (
                <CheckIcon className="w-4 h-4 ml-auto" />
              )}
            </Button>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium mb-3">Career Goal*</h3>
          <div className="space-y-3">
            <Button
              variant="outline"
              className={`w-full justify-start ${
                formData.careerGoals === "Grow in my current career"
                  ? "bg-blue-100 border-blue-500 text-blue-700"
                  : "bg-white text-gray-800 hover:bg-gray-50"
              }`}
              onClick={() =>
                handleInputChange("careerGoals", "Grow in my current career")
              }
            >
              <UserIcon className="w-4 h-4 mr-2" />
              Grow in my current career
              {formData.careerGoals === "Grow in my current career" && (
                <CheckIcon className="w-4 h-4 ml-auto" />
              )}
            </Button>
            <Button
              variant="outline"
              className={`w-full justify-start ${
                formData.careerGoals === "Transition into a new career"
                  ? "bg-blue-100 border-blue-500 text-blue-700"
                  : "bg-white text-gray-800 hover:bg-gray-50"
              }`}
              onClick={() =>
                handleInputChange("careerGoals", "Transition into a new career")
              }
            >
              <BriefcaseIcon className="w-4 h-4 mr-2" />
              Transition into a new career
              {formData.careerGoals === "Transition into a new career" && (
                <CheckIcon className="w-4 h-4 ml-auto" />
              )}
            </Button>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium mb-3">
            Interested in a new career
          </h3>
          <div className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              {formData.interestedNewcareer?.map((career, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200"
                >
                  {career}
                  <XIcon
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeCareerInterest(index)}
                  />
                </Badge>
              ))}
            </div>
            <div className="relative">
              <div className="flex">
                <div className="relative flex-grow">
                  <Input
                    placeholder="Search for a career"
                    value={careerSearchTerm}
                    onChange={(e) => {
                      setCareerSearchTerm(e.target.value);
                      setShowCareerDropdown(true);
                    }}
                    onFocus={() => setShowCareerDropdown(true)}
                    className="bg-white pr-8"
                  />
                  <SearchIcon className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                <Button
                  variant="outline"
                  className="ml-2 bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => addCareerInterest(careerSearchTerm)}
                  disabled={!careerSearchTerm.trim()}
                >
                  Add
                </Button>
              </div>
              {showCareerDropdown && filteredCareers.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredCareers.map((career, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                      onClick={() => {
                        addCareerInterest(career);
                        setShowCareerDropdown(false);
                      }}
                    >
                      {career}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between pt-4">
          <Button
            className="bg-black text-white hover:bg-gray-800"
            variant="outline"
            onClick={handleBack}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            className={`bg-black text-white ${
              isForm2Valid
                ? "hover:bg-gray-800"
                : "opacity-50 cursor-not-allowed"
            }`}
            onClick={handleSubmit}
            disabled={loading || !isForm2Valid}
          >
            {loading ? "Submitting..." : "Finish"}
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg p-6 border-t-4 border-b-4 border-blue-600 rounded-lg bg-white">
        {step === 1 ? (
          <>
            <div className="flex items-center justify-center m-2">
              <div className="text-3xl font-bold text-blue-600">MENTOR ONE</div>
            </div>
            <div className="text-center mb-1">
              <h2 className="text-xl font-semibold">Ready to Be ONE now!</h2>
              <p className="text-gray-600">Lets Explore the Journey</p>
            </div>
            <Progress value={progressValue} />
            <div className="grid grid-cols-2 gap-3 mb-2 mt-4">
              {(
                ["school", "college", "fresher", "professional"] as UserType[]
              ).map((type) => (
                <Button
                  key={type}
                  variant={formData.userType === type ? "default" : "outline"}
                  onClick={() => handleInputChange("userType", type)}
                  className={`capitalize ${
                    formData.userType === type
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-white text-gray-800 hover:bg-gray-100 hover:text-blue-600 border-gray-300"
                  }`}
                >
                  {type}{" "}
                  {type === "school"
                    ? "Student"
                    : type === "college"
                    ? "Student"
                    : ""}
                </Button>
              ))}
            </div>
            {formData.userType === "school" && renderSchoolForm()}
            {(formData.userType === "college" ||
              formData.userType === "fresher") &&
              renderCollegeForm()}
            {formData.userType === "professional" && renderProfessionalForm()}
            <div className="mt-6">
              <Label>City*</Label>
              <Input
                placeholder="Enter your city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="bg-white"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleNext}
                disabled={loading || !isForm1Valid}
                className={`bg-black text-white ${
                  isForm1Valid
                    ? "hover:bg-gray-800"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                {loading ? "Submitting..." : "Next"}
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </>
        ) : (
          renderSecondForm()
        )}
      </DialogContent>
    </Dialog>
  );
}

export default WelcomeModal;
