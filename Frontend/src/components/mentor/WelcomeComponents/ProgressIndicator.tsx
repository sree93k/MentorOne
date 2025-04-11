const ProgressIndicator: React.FC<{
  step: "about" | "profile" | "experience" | "success";
}> = ({ step }) => {
  return (
    <div className="flex gap-2 items-center mb-3">
      <div
        className={`w-3 h-3 rounded-full ${
          step === "about" ||
          step === "profile" ||
          step === "experience" ||
          step === "success"
            ? "bg-green-500"
            : "bg-gray-200"
        }`}
      />
      <span className={step === "about" ? "font-medium" : "text-gray-500"}>
        About you
      </span>
      <div className="h-px flex-1 bg-gray-200" />
      <div
        className={`w-3 h-3 rounded-full ${
          step === "profile" || step === "experience" || step === "success"
            ? "bg-green-500"
            : "bg-gray-200"
        }`}
      />
      <span className={step === "profile" ? "font-medium" : "text-gray-500"}>
        Profile
      </span>
      <div className="h-px flex-1 bg-gray-200" />
      <div
        className={`w-3 h-3 rounded-full ${
          step === "experience" || step === "success"
            ? "bg-green-500"
            : "bg-gray-200"
        }`}
      />
      <span className={step === "experience" ? "font-medium" : "text-gray-500"}>
        Experience
      </span>
    </div>
  );
};

export default ProgressIndicator;
