import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FilterHeaderProps {
  title: string;
  options?: string[];
}

export default function FilterHeader({
  title,
  options = [],
}: FilterHeaderProps) {
  return (
    <div className="flex items-center gap-1 cursor-pointer">
      {title}
      {options.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <ChevronDown size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white">
            {options.map((option) => (
              <DropdownMenuItem key={option}>{option}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
