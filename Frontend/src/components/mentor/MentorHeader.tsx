import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Send } from "lucide-react";
import LogoImg from "@/assets/Logo2.png";
import LogoName from "@/assets/LogoName2.png";
import MentorChat from "../users/Chatting";
import { RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";
import ThemeToggle from "../users/ThemeToggle";
const MentorHeader: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);
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
          {/* <span className="text-xl">MENTOR ONE</span> */}
        </div>

        <div className="flex items gap-8">
          <span className="text-2xl font-semibold text-black dark:text-white">
            Hi,{" "}
            {`${
              user?.firstName
                ? user.firstName.charAt(0).toUpperCase() +
                  user.firstName.slice(1)
                : "Mentor"
            }`}
          </span>

          {/* <nav className="flex gap-8">
           
          </nav> */}
          <div className="flex items-center gap-4">
            <Input
              type="search"
              placeholder="Search"
              className="w-64 rounded-full"
            />
            <button onClick={openChat}>
              <Send size={24} />
            </button>
          </div>
          <ThemeToggle />
        </div>
        <MentorChat open={isChatOpen} onOpenChange={setIsChatOpen} />
      </header>
    </>
  );
};

export default MentorHeader;
