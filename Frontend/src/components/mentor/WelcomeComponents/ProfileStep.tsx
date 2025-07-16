import { useState } from "react";
import Select from "react-select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { WelcomeFormData } from "../MentorWelcomeModal"; // Updated import

interface ProfileStepProps {
  formData: WelcomeFormData; // Updated type
  setFormData: (data: WelcomeFormData) => void; // Updated type
}

const demoSkills = [
  "JavaScript",
  "React",
  "Node.js",
  "Python",
  "Java",
  "C++",
  "HTML",
  "CSS",
  "SQL",
  "Git",
  "TypeScript",
  "AWS",
  "Docker",
  "MongoDB",
  "GraphQL",
];

const mentoringGoalsOptions = [
  { value: "Guide Students", label: "Guide Students" },
  { value: "Share Experience", label: "Share Experience" },
  { value: "Build Network", label: "Build Network" },
  { value: "Give Back", label: "Give Back" },
];

const ProfileStep: React.FC<ProfileStepProps> = ({ formData, setFormData }) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    formData.skills || []
  );

  const handleSkillChange = (selectedOptions: any) => {
    const skills = selectedOptions.map((option: any) => option.value);
    setSelectedSkills(skills);
    setFormData({ ...formData, skills });
  };

  const handleMentoringGoalsChange = (selectedOptions: any) => {
    const interestedNewcareer = selectedOptions.map(
      (option: any) => option.value
    );
    setFormData({ ...formData, interestedNewcareer });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Skills</Label>
          <Select
            isMulti
            options={demoSkills.map((skill) => ({
              value: skill,
              label: skill,
            }))}
            value={selectedSkills.map((skill) => ({
              value: skill,
              label: skill,
            }))}
            onChange={handleSkillChange}
            placeholder="Search and select skills"
            className="basic-multi-select"
            classNamePrefix="select"
          />

          <p className="text-sm text-gray-500">
            Describe your expertise (keep it below 10 skills).
          </p>
        </div>

        <div className="space-y-2">
          <Label>Mentoring Goals</Label>
          <Select
            isMulti
            options={mentoringGoalsOptions}
            value={
              formData.interestedNewcareer?.map((goal) => ({
                value: goal,
                label: goal,
              })) || []
            }
            onChange={handleMentoringGoalsChange}
            placeholder="Select your mentoring goals"
            className="basic-multi-select"
            classNamePrefix="select"
          />
          <p className="text-sm text-gray-500">
            Select at least one goal for mentoring.
          </p>
        </div>

        <div className="space-y-2">
          <Label>Bio</Label>
          <Textarea
            name="bio"
            value={formData.bio || ""}
            onChange={handleInputChange}
            placeholder="Tell us about yourself."
            className="min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>LinkedIn URL</Label>
            <Input
              name="linkedinUrl"
              value={formData.linkedinUrl || ""}
              onChange={handleInputChange}
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          <div className="space-y-2">
            <Label>Youtube Link (optional)</Label>
            <Input
              name="youtubeLink"
              value={formData.youtubeLink || ""}
              onChange={handleInputChange}
              placeholder="https://youtube.com/@username"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Personal Website (optional)</Label>
          <Input
            name="portfolio"
            value={formData.portfolio || ""}
            onChange={handleInputChange}
            placeholder="https://yourwebsite.com"
          />
        </div>
      </div>
    </>
  );
};

export default ProfileStep;
