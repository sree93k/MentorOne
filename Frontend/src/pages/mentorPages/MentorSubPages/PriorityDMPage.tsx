import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import PriorityDMModal from "@/components/modal/PriorityDMModal";
import AnswerModal from "@/components/modal/AnswerModal";
import { Rating, RatingStar } from "flowbite-react";
import { getAllPriorityDMsByMentor } from "@/services/mentorService";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { FileText } from "lucide-react";

interface PriorityDM {
  _id: string;
  serviceId: { _id: string; title: string };
  menteeId: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  bookingId: { _id: string };
  content: string;
  pdfFiles: Array<{ fileName: string; s3Key: string; url: string }>;
  mentorReply?: {
    content: string;
    pdfFiles: Array<{ fileName: string; s3Key: string; url: string }>;
    repliedAt: string;
  };
  status: "pending" | "replied" | "closed";
  menteeTestimonial?: { rating: number; comment: string; submittedAt: string };
  timestamp: string;
}

export default function PriorityDMPage() {
  const [selectedTab, setSelectedTab] = useState("pending");
  const [priorityDMs, setPriorityDMs] = useState<PriorityDM[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [answerModalOpen, setAnswerModalOpen] = useState(false);
  const [selectedDM, setSelectedDM] = useState<PriorityDM | null>(null);
  const { user } = useSelector((state: RootState) => state.user);

  // Fetch all Priority DMs for the mentor
  useEffect(() => {
    const fetchPriorityDMs = async () => {
      if (!user?._id) return;
      setIsLoading(true);
      try {
        const dms = await getAllPriorityDMsByMentor();
        setPriorityDMs(dms);
      } catch (error) {
        console.error("Error fetching Priority DMs:", error);
        toast.error("Failed to load Priority DMs.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPriorityDMs();
  }, [user?._id]);

  const handleReply = (dm: PriorityDM) => {
    setSelectedDM(dm);
    setModalOpen(true);
  };

  const handleViewAnswer = (dm: PriorityDM) => {
    setSelectedDM(dm);
    setAnswerModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedDM(null);
    // Refresh DMs after reply
    const fetchDMs = async () => {
      try {
        const dms = await getAllPriorityDMsByMentor();
        setPriorityDMs(dms);
      } catch (error) {
        console.error("Error refreshing Priority DMs:", error);
        toast.error("Failed to refresh Priority DMs.");
      }
    };
    fetchDMs();
  };

  const renderDM = (dm: PriorityDM, index: number) => (
    <div key={dm._id}>
      {index !== 0 && <hr className="border-t border-gray-300 my-4" />}
      <div className="bg-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={dm.menteeId.profilePicture || ""} />
            <AvatarFallback>{dm.menteeId.firstName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">
              {dm.menteeId.firstName} {dm.menteeId.lastName}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(dm.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
        <div
          className="text-sm mb-4 ql-editor"
          dangerouslySetInnerHTML={{ __html: dm.content }}
        />
        {dm.pdfFiles?.length > 0 && (
          <div className="mb-4">
            <p className="font-medium">Attachments:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {dm.pdfFiles.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center bg-gray-100 rounded-md px-2 py-1"
                >
                  <FileText size={16} className="mr-1" />
                  <span className="text-sm truncate max-w-xs">
                    {file.fileName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-between">
          {dm.status === "pending" ? (
            <Button
              variant="default"
              className="bg-blue-600 text-white rounded-full hover:bg-blue-700"
              onClick={() => handleReply(dm)}
            >
              Reply
            </Button>
          ) : (
            <>
              {dm.menteeTestimonial?.rating && (
                <Rating>
                  {[...Array(5)].map((_, i) => (
                    <RatingStar
                      key={i}
                      filled={i < dm.menteeTestimonial.rating}
                    />
                  ))}
                </Rating>
              )}
              <Button
                variant="default"
                className="bg-green-600 text-white rounded-full hover:bg-green-700"
                onClick={() => handleViewAnswer(dm)}
              >
                Show Answer
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );

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
            {isLoading ? (
              <p>Loading...</p>
            ) : priorityDMs.filter((dm) => dm.status === "pending").length ===
              0 ? (
              <p>No pending Priority DMs.</p>
            ) : (
              priorityDMs
                .filter((dm) => dm.status === "pending")
                .map((dm, index) => renderDM(dm, index))
            )}
          </div>
        </TabsContent>

        <TabsContent value="answered">
          <div className="space-y-6">
            {isLoading ? (
              <p>Loading...</p>
            ) : priorityDMs.filter((dm) => dm.status === "replied").length ===
              0 ? (
              <p>No answered Priority DMs.</p>
            ) : (
              priorityDMs
                .filter((dm) => dm.status === "replied")
                .map((dm, index) => renderDM(dm, index))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {selectedDM && (
        <>
          <PriorityDMModal
            isOpen={modalOpen}
            onClose={handleModalClose}
            serviceId={selectedDM.serviceId._id}
            bookingId={selectedDM.bookingId._id}
            title={selectedDM.serviceId.title}
            productType="Direct Message"
            existingDM={selectedDM}
          />
          <AnswerModal
            isOpen={answerModalOpen}
            onClose={() => setAnswerModalOpen(false)}
            question={selectedDM}
          />
        </>
      )}
    </div>
  );
}
