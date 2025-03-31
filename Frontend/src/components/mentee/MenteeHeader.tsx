import { Input } from "@/components/ui/input";
import { UserCircle2 } from "lucide-react";
import LogoImg from "@/assets/logo.png";
import LogoName from "@/assets/brandlogo.png";
const MenteeHeader: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-40 py-4 bg-white">
      <div className="flex items-center gap-4">
        <img src={LogoImg} alt="Mentor ONE Logo" className="w-14 h-14" />
        <img src={LogoName} alt="Mentor ONE LogoName" className="w-auto h-16" />
        {/* <span className="text-xl">MENTOR ONE</span> */}
      </div>
      <div className="flex items-center gap-8">
        <nav className="flex gap-8">
          <a href="#" className="font-medium border-b-2 border-black">
            Home
          </a>
          <a href="#" className="text-gray-500">
            Mentors
          </a>
          <a href="#" className="text-gray-500">
            Courses
          </a>
          <a href="#" className="text-gray-500">
            Blog
          </a>
          <a href="#" className="text-gray-500">
            Community
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <Input type="search" placeholder="Search" className="w-64" />
          <UserCircle2 size={24} />
        </div>
      </div>
    </header>
  );
};

export default MenteeHeader;
