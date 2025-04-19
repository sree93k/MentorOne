import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ReplyModal from "@/components/modal/ReplyModal";
import ViewAnswerModal from "@/components/modal/AnswerModal";
import { Rating, RatingStar } from "flowbite-react";
interface Message {
  id: number;
  user: string;
  avatar: string;
  timestamp: string;
  content: string;
  answer?: string;
}

const messages: Message[] = [
  {
    id: 1,
    user: "Jasna Jasser",
    avatar: "https://github.com/shadcn.png",
    timestamp: "12 March 2025, 11:19 AM",
    content:
      "Hi Maam, I'm a fresher in MERN stack. I've done 2 real-world projects: an e-commerce site and an e-learning platform. I've applied for many jobs but haven't received any calls. Is there anything else I should do?",
    answer: `1. Strengthen Your Projects
  ✅ Add auth (JWT, OAuth), admin roles, payments (Stripe)
  ✅ Optimize DB queries (indexes, aggregation)
  ✅ Add testing (Jest, Cypress), deploy & document projects
  
  2. Improve Online Presence
  📌 GitHub: Clean commits, README
  📌 Portfolio: Your own site
  📌 LinkedIn: Active and updated
  📌 LeetCode: Practice DSA regularly
  
  3. Apply Smartly
  📝 Tailor resume
  🔍 Reach out for referrals
  ❄️ Cold emails work too
  
  4. Open Source
  Start small — fix bugs, update docs, raise PRs.`,
  },
  {
    id: 2,
    user: "Jasna Jasser",
    avatar: "https://github.com/shadcn.png",
    timestamp: "12 March 2025, 11:19 AM",
    content:
      "Apply on LinkedIn, AngelList, Wellfound, and reach out to employees for referrals. Hi Maam, I'm a fresher in MERN stack i have done 2 real world projects, one is an e-commerce website and another one is an e learning platform? And I applied for many jobs but still I didn't get any call yet? Is there anthing additonaly I need to add in my projects? what should I do?",
  },
  {
    id: 3,
    user: "Akhil Menon",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    timestamp: "13 March 2025, 9:45 AM",
    content:
      "Ma’am, I have done internships in frontend (React) but struggling with backend integration. Any recommended path or resources?",
    answer: `Glad you're exploring full-stack!
  
  1. Learn Basics of Backend
  ✅ Start with Node.js + Express.js
  ✅ Understand REST APIs, middlewares, routing
  
  2. Practice Integration
  ✅ Build small apps that use both frontend and backend
  ✅ Use Postman/Insomnia to test endpoints
  
  3. Database Basics
  ✅ MongoDB (Mongoose), relations, indexing
  
  4. Projects to Try
  📌 Blog app with login/signup
  📌 Expense Tracker with monthly filters
  📌 Simple chat app using WebSockets`,
  },
  {
    id: 4,
    user: "Neha Suresh",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    timestamp: "14 March 2025, 10:20 AM",
    content:
      "Hi! How important is contributing to open-source for freshers? And how can I start with it if I have no prior experience?",
  },
];

export default function PriorityDMPage() {
  const [selectedTab, setSelectedTab] = useState("pending");
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [viewAnswerModalOpen, setViewAnswerModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const handleReply = (message: Message) => {
    setSelectedMessage(message);
    setReplyModalOpen(true);
  };

  const handleViewAnswer = (message: Message) => {
    setSelectedMessage(message);
    setViewAnswerModalOpen(true);
  };

  const handleSubmitReply = (reply: string) => {
    console.log("Reply submitted:", reply);
    setReplyModalOpen(false);
  };

  const handleEditAnswer = (newAnswer: string) => {
    console.log("Answer edited:", newAnswer);
  };

  return (
    <div className="mx-36 py-6">
      <h1 className="text-2xl font-bold mb-6">Priority DM</h1>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="w-full flex justify-start gap-8 border-b mb-8">
          {["pending", "answered"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className={`pb-3 capitalize transition-all rounded-none ${
                selectedTab === tab
                  ? "border-b-2 border-black font-semibold text-black"
                  : "text-muted-foreground"
              }`}
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="pending">
          <div className="space-y-6">
            {messages
              .filter((m) => !m.answer)
              .map((message, index) => (
                <div key={message.id}>
                  {index !== 0 && (
                    <hr className="border-t border-gray-300 my-4" />
                  )}
                  <div className="bg-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.avatar} />
                        <AvatarFallback>{message.user[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{message.user}</p>
                        <p className="text-xs text-muted-foreground">
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm mb-4">{message.content}</p>
                    <div className="flex justify-end">
                      <Button
                        variant="default"
                        className="bg-blue-600 text-white rounded-full hover:bg-blue-700"
                        onClick={() => handleReply(message)}
                      >
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="answered">
          <div className="space-y-6">
            {messages
              .filter((m) => m.answer)
              .map((message, index) => (
                <div key={message.id}>
                  {index !== 0 && (
                    <hr className="border-t border-gray-300 my-4" />
                  )}
                  <div className="bg-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.avatar} />
                        <AvatarFallback>{message.user[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{message.user}</p>
                        <p className="text-xs text-muted-foreground">
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm mb-4">{message.content}</p>
                    <div className="flex justify-between">
                      <Rating>
                        <RatingStar />
                        <RatingStar />
                        <RatingStar />
                        <RatingStar />
                        <RatingStar filled={false} />
                      </Rating>

                      <Button
                        variant="default"
                        className="bg-green-600 text-white rounded-full hover:bg-green-700"
                        onClick={() => handleViewAnswer(message)}
                      >
                        Show Answer
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {selectedMessage && (
        <>
          <ReplyModal
            isOpen={replyModalOpen}
            onClose={() => setReplyModalOpen(false)}
            question={selectedMessage}
            onSubmit={handleSubmitReply}
          />
          <ViewAnswerModal
            isOpen={viewAnswerModalOpen}
            onClose={() => setViewAnswerModalOpen(false)}
            question={{
              ...selectedMessage,
              answer: selectedMessage.answer || "",
            }}
            onEdit={handleEditAnswer}
          />
        </>
      )}
    </div>
  );
}
