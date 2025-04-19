import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: {
    user: string;
    avatar: string;
    timestamp: string;
    content: string;
  };
  onSubmit: (reply: string) => void;
}

export default function ReplyModal({
  isOpen,
  onClose,
  question,
  onSubmit,
}: ReplyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Reply</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}></Button>
          </div>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={question.avatar} />
              <AvatarFallback>{question.user[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{question.user}</p>
              <p className="text-xs text-muted-foreground">
                {question.timestamp}
              </p>
            </div>
          </div>
          <p className="text-sm">{question.content}</p>
          <div className="flex items-center gap-3 mt-6">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>SK</AvatarFallback>
            </Avatar>
            <p className="text-sm font-medium">Sreekuttan</p>
          </div>
          <Textarea placeholder="Reply..." className="min-h-[200px]" />
          <Button
            className="w-full bg-black text-white"
            onClick={() => onSubmit("Reply submitted")}
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
