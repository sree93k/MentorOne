import { useState } from "react";
import { Send } from "lucide-react";
import LogoImg from "@/assets/Logo2.png";
import LogoName from "@/assets/LogoName2.png";
import Chatting from "../users/Chatting";
import ThemeToggle from "../users/ThemeToggle";

const MentorHeader: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openChat = () => {
    setIsChatOpen(true);
  };

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
        </div>
        <div className="flex items gap-8">
          <div className="flex px-6 items-center gap-4">
            <button onClick={openChat}>
              <Send size={24} />
            </button>
          </div>
          <ThemeToggle />
        </div>
        <Chatting open={isChatOpen} onOpenChange={setIsChatOpen} />
      </header>
    </>
  );
};

export default MentorHeader;
