import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [pendingPage, setPendingPage] = useState(1);
  const [answeredPage, setAnsweredPage] = useState(1);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [answeredTotal, setAnsweredTotal] = useState(0);
  const [pendingSearch, setPendingSearch] = useState("");
  const [answeredSearch, setAnsweredSearch] = useState("");
  const [answeredSort, setAnsweredSort] = useState<"asc" | "desc">("desc");
  const limit = 8;
  const { user } = useSelector((state: RootState) => state.user);

  // Fetch Priority DMs for the current tab
  useEffect(() => {
    const fetchPriorityDMs = async () => {
      if (!user?._id) return;
      setIsLoading(true);
      try {
        const status = selectedTab === "pending" ? "pending" : "replied";
        const page = selectedTab === "pending" ? pendingPage : answeredPage;
        const searchQuery =
          selectedTab === "pending" ? pendingSearch : answeredSearch;
        const sort = selectedTab === "answered" ? answeredSort : undefined;

        const { priorityDMs, total } = await getAllPriorityDMsByMentor(
          page,
          limit,
          searchQuery,
          status,
          sort
        );

        setPriorityDMs(priorityDMs);
        if (selectedTab === "pending") {
          setPendingTotal(total);
        } else {
          setAnsweredTotal(total);
        }
      } catch (error) {
        console.error("Error fetching Priority DMs:", error);
        toast.error("Failed to load Priority DMs.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPriorityDMs();
  }, [
    user?._id,
    selectedTab,
    pendingPage,
    answeredPage,
    pendingSearch,
    answeredSearch,
    answeredSort,
  ]);

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
        const { priorityDMs, total } = await getAllPriorityDMsByMentor(
          pendingPage,
          limit,
          pendingSearch,
          "pending"
        );
        setPriorityDMs(priorityDMs);
        setPendingTotal(total);
      } catch (error) {
        console.error("Error refreshing Priority DMs:", error);
        toast.error("Failed to refresh Priority DMs.");
      }
    };
    fetchDMs();
  };

  const handleCardClick = (dmId: string) => {
    setExpandedCardId(expandedCardId === dmId ? null : dmId);
  };

  const handlePageChange = (page: number) => {
    if (selectedTab === "pending") {
      setPendingPage(page);
    } else {
      setAnsweredPage(page);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (selectedTab === "pending") {
      setPendingSearch(value);
      setPendingPage(1); // Reset to first page on search
    } else {
      setAnsweredSearch(value);
      setAnsweredPage(1); // Reset to first page on search
    }
  };

  const toggleSort = () => {
    setAnsweredSort(answeredSort === "asc" ? "desc" : "asc");
    setAnsweredPage(1); // Reset to first page on sort change
  };

  // Helper to extract first line of content, stripping HTML
  const getFirstLine = (html: string): string => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    const lines = text.split("\n").filter((line) => line.trim());
    return lines[0] || "No content";
  };

  const renderMinimalCard = (dm: PriorityDM) => (
    <div
      className="bg-gray-100 rounded-lg p-3 h-24 flex items-center gap-3 cursor-pointer hover:bg-gray-200 transition-colors"
      onClick={() => handleCardClick(dm._id)}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={dm.menteeId.profilePicture || ""} />
        <AvatarFallback>{dm.menteeId.firstName[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {dm.menteeId.firstName} {dm.menteeId.lastName}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {getFirstLine(dm.content)}
        </p>
        {dm.pdfFiles?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {dm.pdfFiles.map((file, i) => (
              <div
                key={i}
                className="flex items-center bg-gray-200 rounded-md px-1 py-0.5 text-xs"
                title={file.fileName}
              >
                <FileText size={12} className="mr-1" />
                <span className="truncate max-w-[100px]">{file.fileName}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-2">
        {dm.status === "pending" ? (
          <Button
            variant="default"
            size="sm"
            className="bg-blue-600 text-white rounded-full hover:bg-blue-700"
            onClick={(e) => {
              e.stopPropagation();
              handleReply(dm);
            }}
          >
            Reply
          </Button>
        ) : (
          <>
            {dm.menteeTestimonial?.rating && (
              <Rating className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <RatingStar
                    key={i}
                    filled={i < dm.menteeTestimonial.rating}
                    size={16}
                  />
                ))}
              </Rating>
            )}
            <Button
              variant="default"
              size="sm"
              className="bg-green-600 text-white rounded-full hover:bg-green-700"
              onClick={(e) => {
                e.stopPropagation();
                handleViewAnswer(dm);
              }}
            >
              Show Answer
            </Button>
          </>
        )}
      </div>
    </div>
  );

  const renderExpandedCard = (dm: PriorityDM, index: number) => (
    <div key={dm._id}>
      {index !== 0 && <hr className="border-t border-gray-300 my-4" />}
      <div
        className="bg-gray-200 rounded-lg p-4 cursor-pointer"
        onClick={() => handleCardClick(dm._id)}
      >
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
              {new Date(dm.timestamp).toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
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
                  title={file.fileName}
                >
                  <FileText size={16} className="mr-1" />
                  <span className="text-sm truncate max-w-[200px]">
                    {file.fileName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-between items-center">
          {dm.status === "pending" ? (
            <Button
              variant="default"
              className="bg-blue-600 text-white rounded-full hover:bg-blue-700"
              onClick={(e) => {
                e.stopPropagation();
                handleReply(dm);
              }}
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewAnswer(dm);
                }}
              >
                Show Answer
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderPagination = (total: number, currentPage: number) => {
    const totalPages = Math.ceil(total / limit);
    return (
      <div className="flex justify-center gap-2 mt-6">
        <Button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          variant="outline"
        >
          Previous
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </Button>
        ))}
        <Button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          variant="outline"
        >
          Next
        </Button>
      </div>
    );
  };

  return (
    <div className="mx-36 py-6">
      <h1 className="text-2xl font-bold mb-6">Priority DM</h1>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="w-full flex justify-start gap-8 border-b mb-4">
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
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search by mentee name or content..."
              value={pendingSearch}
              onChange={handleSearch}
              className="w-full sm:w-64 rounded-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
          </div>
          <div className="space-y-4">
            {isLoading ? (
              <p>Loading...</p>
            ) : priorityDMs.length === 0 ? (
              <p>No pending Priority DMs.</p>
            ) : (
              priorityDMs.map((dm, index) =>
                expandedCardId === dm._id
                  ? renderExpandedCard(dm, index)
                  : renderMinimalCard(dm)
              )
            )}
          </div>
          {pendingTotal > 0 && renderPagination(pendingTotal, pendingPage)}
        </TabsContent>

        <TabsContent value="answered">
          <div className="flex justify-between items-center mb-4">
            <Input
              type="text"
              placeholder="Search by mentee name or content..."
              value={answeredSearch}
              onChange={handleSearch}
              className="w-full sm:w-64 rounded-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
            <Button variant="outline" onClick={toggleSort} className="ml-4">
              Sort:{" "}
              {answeredSort === "asc" ? "Oldest to Latest" : "Latest to Oldest"}
            </Button>
          </div>
          <div className="space-y-4">
            {isLoading ? (
              <p>Loading...</p>
            ) : priorityDMs.length === 0 ? (
              <p>No answered Priority DMs.</p>
            ) : (
              priorityDMs.map((dm, index) =>
                expandedCardId === dm._id
                  ? renderExpandedCard(dm, index)
                  : renderMinimalCard(dm)
              )
            )}
          </div>
          {answeredTotal > 0 && renderPagination(answeredTotal, answeredPage)}
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
