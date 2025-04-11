import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { WelcomeFormData } from "../MentorWelcomeModal";

interface ExperienceStepProps {
  formData: WelcomeFormData;
  setFormData: (data: WelcomeFormData) => void;
}

const ExperienceStep: React.FC<ExperienceStepProps> = ({
  formData,
  setFormData,
}) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700 mb-4">
        <p className="font-medium">Almost there!</p>
        <p>
          You're one step away from being a mentor and connecting with mentees!
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Intro Video (optional)</Label>
            <Input
              name="selfIntro"
              value={formData.selfIntro || ""}
              onChange={handleInputChange}
              placeholder="https://your-intro-video-url"
            />
            <p className="text-sm text-gray-500">
              Add a YouTube video or Loom link.
            </p>
          </div>
          <div className="space-y-2">
            <Label>Featured Article (optional)</Label>
            <Input
              name="featuredArticle"
              value={formData.featuredArticle || ""}
              onChange={handleInputChange}
              placeholder="https://your-blog-article-link"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>
            Why do you want to become a mentor? (Not publicly visible)
          </Label>
          <Textarea
            name="mentorMotivation"
            value={formData.mentorMotivation || ""}
            onChange={handleInputChange}
            placeholder="Share your motivation for mentoring"
            className="min-h-[150px]"
          />
        </div>

        <div className="space-y-2">
          <Label>
            Your greatest achievement so far? (Not publicly visible)
          </Label>
          <Textarea
            name="achievements"
            value={formData.achievements || ""}
            onChange={handleInputChange}
            placeholder="Share your proudest moment"
            className="min-h-[150px]"
          />
        </div>
      </div>
    </>
  );
};

export default ExperienceStep;
