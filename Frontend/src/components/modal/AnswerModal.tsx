import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Pencil } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Rating, RatingStar } from "flowbite-react";
interface ViewAnswerModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: {
    user: string;
    avatar: string;
    timestamp: string;
    content: string;
    answer: string;
  };
  onEdit: (newAnswer: string) => void;
}

export default function ViewAnswerModal({
  isOpen,
  onClose,
  question,
  onEdit,
}: ViewAnswerModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAnswer, setEditedAnswer] = useState(question.answer);

  const handleEdit = () => {
    onEdit(editedAnswer);
    setIsEditing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Answer</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}></Button>
          </div>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3 mb-4 relative">
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
            <div className="absolute top-3 right-4">
              <Rating>
                <RatingStar />
                <RatingStar />
                <RatingStar />
                <RatingStar />
                <RatingStar filled={false} />
              </Rating>
            </div>
          </div>
          <p className="text-sm bg-gray-100 p-2">{question.content}</p>
          <div className="flex items-center gap-3 mt-6">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>SK</AvatarFallback>
            </Avatar>
            <p className="text-sm font-medium">Sreekuttan</p>
            {!isEditing && (
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
          {isEditing ? (
            <>
              <Textarea
                value={editedAnswer}
                onChange={(e) => setEditedAnswer(e.target.value)}
                className="min-h-[200px] bg-gray-100"
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEdit} className="bg-black text-white">
                  Save Changes
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm whitespace-pre-wrap bg-gray-100 ">
              {question.answer}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
