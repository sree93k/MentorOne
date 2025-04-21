import { Button } from "@/components/ui/button";
import DummyImage from "@/assets/DummyProfile.jpg";
interface BookingDetailsProps {
  onConfirmClick: () => void;
}

export default function BookingDetails({
  onConfirmClick,
}: BookingDetailsProps) {
  return (
    <div className="rounded-3xl overflow-hidden bg-gray-100">
      <div className="flex flex-row items-centre justify-centre gap-10 p-8">
        {/* Left Column */}
        <div className="flex flex-col items-start">
          <div className="w-32 h-32 rounded-full overflow-hidden mb-2">
            <img
              src={DummyImage}
              alt="Anita Benny"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl font-bold">Anita Benny</h2>
        </div>

        {/* Right Column */}
        <div className="flex items-center">
          <h1 className="text-4xl font-semibold">Mock Interview</h1>
        </div>
      </div>

      <div className="flex justify-between items-center px-8 py-4 border-t border-gray-200">
        <div className="text-sm">60 Minutes Meeting</div>
        <Button
          variant="outline"
          className="rounded-full border-gray-400 flex items-center gap-2"
          onClick={onConfirmClick}
        >
          ₹ 2300+
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12H19M19 12L12 5M19 12L12 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </div>

      <div className="bg-black text-white p-8">
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">About Service</h3>
          <p className="text-gray-300">
            A extensive mock-interview session followed by detailed feedback and
            analysis.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2 text-sm text-gray-300">
            <span>Career Growth</span>
            <span className="mx-2">|</span>
            <span>Communication</span>
            <span className="mx-2">|</span>
            <span>Interview Preparation</span>
            <span className="mx-2">|</span>
            <span>Career Coaching</span>
            <span className="mx-2">|</span>
            <span>Career Advice</span>
            <span className="mx-2">|</span>
            <span>Resume & CV Review</span>
            <span className="mx-2">|</span>
            <span>Interview Preparations</span>
            <span className="mx-2">|</span>
            <span>Mock Interviews</span>
          </div>
        </div>
      </div>
    </div>
  );
}
