import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface MenteeChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function MenteeChat({ open, onOpenChange }: MenteeChatProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <img
              src="https://via.placeholder.com/30" // Replace with actual profile image
              alt="Jasna Jaffer"
              className="w-8 h-8 rounded-full"
            />
            Jasna Jaffer
          </SheetTitle>
          <SheetDescription>
            Chat with your mentor. Type your message below.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col h-[60vh] overflow-y-auto p-4 bg-gray-100">
          {/* Conversation History */}
          <div className="mb-2">
            <p className="text-sm text-gray-500">Today, 8:30pm</p>
            <div className="bg-gray-200 p-2 rounded-lg max-w-[70%] ml-auto">
              <p>Hello</p>
            </div>
          </div>
          <div className="mb-2">
            <p className="text-sm text-gray-500">Today, 8:30pm</p>
            <div className="bg-purple-500 text-white p-2 rounded-lg max-w-[70%]">
              <p>Hey there!</p>
            </div>
          </div>
          <div className="mb-2">
            <p className="text-sm text-gray-500">Today, 8:34pm</p>
            <div className="bg-gray-200 p-2 rounded-lg max-w-[70%] ml-auto">
              <p>I am fine and how are you?</p>
            </div>
          </div>
          <div className="mb-2">
            <p className="text-sm text-gray-500">Today, 8:36pm</p>
            <div className="bg-purple-500 text-white p-2 rounded-lg max-w-[70%]">
              <p>I am doing well, Can we meet tomorrow?</p>
            </div>
          </div>
          <div className="mb-2">
            <p className="text-sm text-gray-500">Today, 8:36pm</p>
            <div className="bg-gray-200 p-2 rounded-lg max-w-[70%] ml-auto">
              <p>Yes Sure!</p>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2">
            <button className="text-gray-500">
              <span role="img" aria-label="emoji">
                😊
              </span>
            </button>
            <Input
              type="text"
              placeholder="Type your message here..."
              className="flex-1"
            />
            <button className="text-gray-500">
              <span role="img" aria-label="microphone">
                🎙️
              </span>
            </button>
          </div>
          <Button type="submit" className="mt-2 w-full">
            Send
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MenteeChat;
