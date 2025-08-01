import LogoImg from "@/assets/logo3.png";
import LogoName from "@/assets/logoname3.png";
import ThemeToggle from "../users/ThemeToggle";
const MentorHeader: React.FC = () => {
  return (
    <>
      <header className="flex items-center justify-between px-32 py-4 bg-white dark:text-white dark:bg-gray-800">
        <div className="flex items-center gap-4">
          <img src={LogoImg} alt="Mentor ONE Logo" className="w-14 h-14" />
          <img
            src={LogoName}
            alt="Mentor ONE LogoName"
            className="w-auto h-16"
          />
          {/* <span className="text-xl">MENTOR ONE</span> */}
        </div>

        <div className="flex items gap-8">
          <span className="text-3xl  text-blue-700 dark:text-white">
            Hi, Admin !
          </span>

          <ThemeToggle />
        </div>
        {/* <MentorChat open={isChatOpen} onOpenChange={setIsChatOpen} /> */}
      </header>
    </>
  );
};

export default MentorHeader;
