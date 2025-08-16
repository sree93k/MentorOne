import { useState, useEffect, useCallback, useRef } from "react";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  BookOpen,
  MessageCircle,
  BarChart3,
  Download,
  Share2,
  Star,
  Video,
  PlayCircle,
  PauseCircle,
  Wifi,
  WifiOff,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useParams, useNavigate } from "react-router-dom";
import { getTutorialById } from "@/services/menteeService";
import EnhancedVideoSecurityService from "@/services/videoSecurityService";
import HLSVideoPlayerService from "@/services/HLSVideoPlayerService";
import { VideoSecurityManager } from "@/services/videoSecurityEnhancements";

interface Episode {
  _id: string;
  episode: string;
  title: string;
  description: string;
  videoUrl: string;
  completed?: boolean;
}

interface Season {
  _id: string;
  season: string;
  episodes: Episode[];
}

interface UserInfo {
  name: string;
  id: string;
}

export default function VideoTutorialPage() {
  const { id } = useParams<{ id: string }>();
  const [tutorial, setTutorial] = useState<any>(null);
  const [activeEpisode, setActiveEpisode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [hoveredEpisode, setHoveredEpisode] = useState<string | null>(null);
  const [sessionExpiredModal, setSessionExpiredModal] = useState(false);
  const [videoStreamingMethod, setVideoStreamingMethod] = useState<
    "hls" | "progressive" | null
  >(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "connecting" | "error"
  >("connecting");
  const [videoQuality, setVideoQuality] = useState<string>("Auto");

  // 🔥 FIX: Add video URL state to store in React
  const [videoUrl, setVideoUrl] = useState<string>("");

  // 🔒 SECURITY: Add security manager and user info
  const [securityManager] = useState(() => new VideoSecurityManager());
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "User",
    id: "unknown",
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 🔒 SECURITY: Setup security event listeners
  useEffect(() => {
    const handleSessionIntegrityFailure = (event: CustomEvent) => {
      console.error("🚫 Session integrity failure detected:", event.detail);
      setError("Security violation detected. Please refresh and try again.");
      setVideoUrl("");
    };

    const handleRecordingDetected = () => {
      console.warn("🚫 Recording attempt detected");
      setError("Recording is not allowed for this content.");
    };

    window.addEventListener(
      "sessionIntegrityFailure",
      handleSessionIntegrityFailure as EventListener
    );
    window.addEventListener("recordingDetected", handleRecordingDetected);

    return () => {
      window.removeEventListener(
        "sessionIntegrityFailure",
        handleSessionIntegrityFailure as EventListener
      );
      window.removeEventListener("recordingDetected", handleRecordingDetected);
    };
  }, []);

  // 🔒 ENHANCED VIDEO LOADING WITH COMPLETE SECURITY
  const loadVideoSecurely = useCallback(
    async (episode: Episode, serviceId: string) => {
      setIsVideoLoading(true);
      setError(null);
      setConnectionStatus("connecting");
      setVideoUrl("");

      try {
        console.log("🔒 Loading video with enhanced security", {
          episodeId: episode._id,
          title: episode.title,
          serviceId,
        });

        if (!videoRef.current) {
          throw new Error("Video element not available");
        }

        // Clean up previous video
        HLSVideoPlayerService.destroyPlayer();

        // Extract S3 key from video URL
        const s3Key = extractS3Key(episode.videoUrl);

        // Load video using auto-detection (HLS or Progressive)
        const loadResult = await HLSVideoPlayerService.loadVideo(
          videoRef.current,
          serviceId,
          s3Key,
          episode._id
        );

        setVideoStreamingMethod(loadResult.method);
        setConnectionStatus("connected");

        // 🔥 FIX: Store video URL in React state
        if (loadResult.videoUrl) {
          console.log(
            "🔧 STORING VIDEO URL IN REACT STATE:",
            loadResult.videoUrl
          );
          setVideoUrl(loadResult.videoUrl);
        }

        // 🔒 SECURITY: Apply comprehensive protection
        if (videoRef.current && id) {
          securityManager.protectVideo(videoRef.current, serviceId, userInfo);
        }

        console.log("🎬 Video loaded successfully with security", {
          method: loadResult.method,
          security: loadResult.info.security,
          downloadPrevention: loadResult.info.downloadPrevention,
          videoUrl: loadResult.videoUrl ? "SET" : "NOT_SET",
        });

        // Set up video event listeners for analytics
        setTimeout(() => {
          if (videoRef.current) {
            setupVideoEventListeners(videoRef.current);
          }
        }, 100);
      } catch (error: any) {
        console.error("🔒 FAILED TO LOAD SECURE VIDEO:", error);
        setError(error.message || "Failed to load video");
        setConnectionStatus("error");
        setVideoUrl("");

        if (
          error.message.includes("Session expired") ||
          error.message.includes("Invalid")
        ) {
          setSessionExpiredModal(true);
        }
      } finally {
        setIsVideoLoading(false);
      }
    },
    [securityManager, userInfo, id]
  );

  // Function to extract S3 object key from full URL
  const extractS3Key = (url: string): string => {
    const bucketUrl = "https://mentorone-app.s3.ap-south-1.amazonaws.com/";
    let key = url;
    if (url.startsWith(bucketUrl)) {
      key = url.replace(bucketUrl, "");
    } else if (url.includes("/videos/")) {
      key = url.split("/videos/").pop() || url;
    }
    key = key.split("?")[0];
    return key;
  };

  // Set up video analytics and heartbeat with security monitoring
  const setupVideoEventListeners = (video: HTMLVideoElement) => {
    if (!video) {
      console.warn("🎬 Video element is null, skipping event listeners");
      return;
    }

    video.addEventListener("loadstart", () => {
      console.log("🔒 Secure video loading started");
    });

    video.addEventListener("loadedmetadata", () => {
      console.log("🔒 Secure video metadata loaded successfully!");
      if (
        video.videoWidth > 0 &&
        video.videoHeight > 0 &&
        !isNaN(video.duration)
      ) {
        console.log("✅ Secure video controls enabled!");
      }
    });

    video.addEventListener("canplay", () => {
      console.log("🔒 Secure video ready to play");
      setConnectionStatus("connected");
    });

    video.addEventListener("waiting", () => {
      console.log("🔒 Secure video buffering");
      setConnectionStatus("connecting");
    });

    video.addEventListener("playing", () => {
      console.log("🔒 Secure video playing");
      setConnectionStatus("connected");

      // Update session activity
      if (id) {
        EnhancedVideoSecurityService.markSessionActive(id);
      }
    });

    video.addEventListener("pause", () => {
      console.log("🔒 Secure video paused");

      // Update session activity
      if (id) {
        EnhancedVideoSecurityService.markSessionInactive(id);
      }
    });

    video.addEventListener("error", (e) => {
      console.error("🔒 Secure video error:", e);
      setConnectionStatus("error");
      setError("Secure video playback error occurred");
    });

    // 🔒 SECURITY: Monitor for unauthorized access attempts
    video.addEventListener("loadstart", () => {
      if (!video.src.includes("sessionToken=")) {
        console.error("🚫 Unauthorized video source detected!");
        video.src = "";
        setError("Unauthorized video access detected");
      }
    });

    // Quality change detection for HLS
    if (HLSVideoPlayerService.isUsingHLS()) {
      const checkQuality = () => {
        const qualities = HLSVideoPlayerService.getAvailableQualities();
        if (qualities.length > 0) {
          setVideoQuality(qualities[0] || "Auto");
        }
      };

      const qualityInterval = setInterval(checkQuality, 5000);
      return () => clearInterval(qualityInterval);
    }
  };

  // 🔒 SECURE EPISODE HANDLER
  const handleEpisodeClick = async (episode: Episode) => {
    setActiveEpisode(episode._id);

    if (!id) {
      setError("Service ID is missing");
      return;
    }

    try {
      console.log("🔒 Loading episode with enhanced security", {
        episodeId: episode._id,
        title: episode.title,
      });

      // Create or validate video session first
      await EnhancedVideoSecurityService.createVideoSession(id);

      // Load the video securely
      await loadVideoSecurely(episode, id);

      console.log("🔒 Episode loaded successfully with security");
    } catch (error: any) {
      console.error("🔒 Failed to load secure episode:", error);
      setError(error.message || "Failed to load video");
    }
  };

  // 🔒 SESSION EXPIRED MODAL HANDLER
  const handleSessionExpired = async () => {
    setSessionExpiredModal(false);
    setError(null);

    try {
      if (activeEpisode && tutorial && id) {
        const episode = tutorial.exclusiveContent
          .flatMap((s: Season) => s.episodes)
          .find((e: Episode) => e._id === activeEpisode);

        if (episode) {
          console.log("🔒 Retrying after session refresh with security");
          await handleEpisodeClick(episode);
        }
      }
    } catch (error) {
      console.error("🔒 Error refreshing secure session:", error);
      setError("Unable to refresh session. Please try again later.");
    }
  };

  // 🔒 SECURE INITIAL LOAD
  useEffect(() => {
    const fetchTutorial = async () => {
      if (!id) {
        setError("Tutorial ID is missing");
        return;
      }

      try {
        // 🔒 SECURITY: Get user info for watermarking
        // In a real app, you'd get this from your auth context
        const currentUser = {
          name: "John Doe", // Get from auth context
          id: "user123", // Get from auth context
        };
        setUserInfo(currentUser);

        const tutorialData = await getTutorialById(id);
        const seasons = tutorialData.exclusiveContent.map((season: any) => ({
          ...season,
          episodes: season.episodes.map((ep: any, index: number) => ({
            ...ep,
            completed: index < 2, // Mock completion status
          })),
        }));

        setTutorial({ ...tutorialData, exclusiveContent: seasons });

        // 🔒 SECURE INITIAL VIDEO LOAD
        if (seasons[0]?.episodes[0]) {
          setActiveEpisode(seasons[0].episodes[0]._id);
          try {
            await handleEpisodeClick(seasons[0].episodes[0]);
          } catch (error: any) {
            console.error("Failed to load initial secure video:", error);
            setError(error.message || "Failed to load initial video");
          }
        }

        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch tutorial:", err);
        setError(err.message || "Failed to load tutorial");
      }
    };

    fetchTutorial();
  }, [id]);

  // 🔒 CLEANUP ON COMPONENT UNMOUNT
  useEffect(() => {
    return () => {
      if (id) {
        console.log("🔒 Cleaning up secure video session");
        EnhancedVideoSecurityService.revokeVideoSession(id).catch(
          console.error
        );
        HLSVideoPlayerService.destroyPlayer();
        securityManager.cleanup();
      }
    };
  }, [id, securityManager]);

  // Connection Status Indicator
  const ConnectionIndicator = () => (
    <div className="flex items-center gap-2 text-xs">
      {connectionStatus === "connected" && (
        <>
          <Wifi className="w-3 h-3 text-green-500" />
          <span className="text-green-600">Secure Connected</span>
        </>
      )}
      {connectionStatus === "connecting" && (
        <>
          <div className="w-3 h-3 border border-yellow-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-yellow-600">Secure Connecting...</span>
        </>
      )}
      {connectionStatus === "error" && (
        <>
          <WifiOff className="w-3 h-3 text-red-500" />
          <span className="text-red-600">Security Error</span>
        </>
      )}
    </div>
  );

  // Streaming Method Badge
  const StreamingMethodBadge = () => {
    if (!videoStreamingMethod) return null;

    return (
      <Badge
        className={`text-xs ${
          videoStreamingMethod === "hls"
            ? "bg-green-100 text-green-800 border-green-300"
            : "bg-yellow-100 text-yellow-800 border-yellow-300"
        }`}
      >
        {videoStreamingMethod === "hls"
          ? "🔒 HLS Secure"
          : "🔒 Progressive Secure"}
      </Badge>
    );
  };

  // Add Session Expired Modal
  const SessionExpiredModal = () =>
    sessionExpiredModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Secure Session Expired
            </h3>
            <p className="text-gray-600 mb-6">
              Your secure video session has expired for security reasons. Click
              refresh to continue watching with enhanced protection.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setSessionExpiredModal(false)}
                variant="outline"
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSessionExpired}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl"
              >
                🔒 Refresh Secure Session
              </Button>
            </div>
          </div>
        </div>
      </div>
    );

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex justify-center items-center py-32">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Video className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Secure Video Error
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                onClick={() => navigate(-1)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl"
              >
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex justify-center items-center py-32">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">
                Loading secure tutorial...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const seasons: Season[] = tutorial.exclusiveContent;
  const completedCount = seasons
    .flatMap((s: Season) => s.episodes)
    .filter((e: Episode) => e.completed).length;
  const totalCount = seasons.flatMap((s: Season) => s.episodes).length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  const activeEpisodeData = seasons
    .flatMap((s: Season) => s.episodes)
    .find((e: Episode) => e._id === activeEpisode);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Back Button */}
      <div className="relative z-10 -ml-6">
        <button
          className="group flex h-12 w-12 items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-blue-600 hover:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
          {/* Main Video Section */}
          <div className="lg:col-span-7 space-y-6">
            {/* 🔒 SECURE Video Player Card */}
            <Card className="border-0 shadow-2xl bg-black rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div
                  ref={videoContainerRef}
                  className="aspect-video relative bg-black rounded-2xl overflow-hidden"
                >
                  {isVideoLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black">
                      <div className="text-center">
                        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-white font-medium">
                          🔒 Loading secure video...
                        </p>
                        <ConnectionIndicator />
                      </div>
                    </div>
                  ) : activeEpisodeData ? (
                    <>
                      {/* 🔒 SECURE VIDEO ELEMENT */}
                      <video
                        ref={videoRef}
                        id="secure-video-player"
                        src={videoUrl}
                        width="100%"
                        height="100%"
                        controls
                        className="object-contain rounded-2xl"
                        preload="metadata"
                        style={{ background: "#000" }}
                        controlsList="nodownload noremoteplayback"
                        disablePictureInPicture={true}
                        crossOrigin="use-credentials"
                        onContextMenu={(e) => {
                          e.preventDefault();
                          return false;
                        }}
                        onLoad={() => console.log("🔒 Secure video loaded")}
                        onError={(e) =>
                          console.error("🔒 Secure video error:", e)
                        }
                      >
                        Your browser does not support secure video playback.
                      </video>

                      {/* 🔒 SECURITY Info Overlay */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <ConnectionIndicator />
                        <StreamingMethodBadge />
                        <Badge className="bg-red-100 text-red-800 border-red-300 text-xs">
                          🔒 Protected Content
                        </Badge>
                        {videoStreamingMethod === "hls" && (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-xs">
                            Quality: {videoQuality}
                          </Badge>
                        )}
                      </div>

                      {/* 🔒 WATERMARK (will be added by SecurityManager) */}
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
                      <div className="text-center">
                        <PlayCircle className="w-24 h-24 text-white/50 mx-auto mb-4" />
                        <p className="text-white/70 font-medium">
                          🔒 Select an episode to start secure learning
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 🔒 SECURE Video Controls & Info */}
            <Card className="border-0 shadow-xl bg-white rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                      <Video className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">
                        {activeEpisodeData?.episode} |{" "}
                        {activeEpisodeData?.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        🔒 Secure Episode Details
                        {videoStreamingMethod === "hls" && (
                          <Badge className="bg-green-100 text-green-700 border-green-300 text-xs">
                            🔒 HLS Secure Streaming
                          </Badge>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="rounded-lg">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-lg opacity-50"
                      disabled
                      title="🔒 Download blocked for security"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <Tabs defaultValue="about" className="w-full">
                  <TabsList className="bg-gray-100 h-12 rounded-xl p-1">
                    <TabsTrigger
                      value="about"
                      className="rounded-lg px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      About
                    </TabsTrigger>
                    <TabsTrigger
                      value="security"
                      className="rounded-lg px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Security
                    </TabsTrigger>
                    <TabsTrigger
                      value="discuss"
                      className="rounded-lg px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Discuss
                    </TabsTrigger>
                    <TabsTrigger
                      value="stats"
                      className="rounded-lg px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Stats
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="about" className="mt-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          Episode Description
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {activeEpisodeData?.description ||
                            "No description available for this episode."}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                        <div className="text-center p-3 bg-purple-50 rounded-xl">
                          <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                          <p className="text-lg font-bold text-gray-900">
                            15 min
                          </p>
                          <p className="text-sm text-gray-600">Duration</p>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-xl">
                          <Settings className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                          <p className="text-lg font-bold text-gray-900">
                            {videoStreamingMethod?.toUpperCase() || "Loading"}
                          </p>
                          <p className="text-sm text-gray-600">Streaming</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-xl">
                          <Star className="w-6 h-6 text-green-600 mx-auto mb-2" />
                          <p className="text-lg font-bold text-gray-900">
                            🔒 Secure
                          </p>
                          <p className="text-sm text-gray-600">Protection</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="security" className="mt-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          🔒 Security Features Active
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                            <h4 className="font-semibold text-green-800 mb-2">
                              ✅ Download Protection
                            </h4>
                            <p className="text-sm text-green-700">
                              Video cannot be downloaded or saved
                            </p>
                          </div>
                          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                            <h4 className="font-semibold text-green-800 mb-2">
                              ✅ Session Monitoring
                            </h4>
                            <p className="text-sm text-green-700">
                              Session integrity continuously verified
                            </p>
                          </div>
                          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                            <h4 className="font-semibold text-green-800 mb-2">
                              ✅ Recording Detection
                            </h4>
                            <p className="text-sm text-green-700">
                              Screen recording attempts are blocked
                            </p>
                          </div>
                          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                            <h4 className="font-semibold text-green-800 mb-2">
                              ✅ Watermarking
                            </h4>
                            <p className="text-sm text-green-700">
                              User identification overlay applied
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                        <h4 className="font-semibold text-red-800 mb-2">
                          ⚠️ Security Notice
                        </h4>
                        <p className="text-sm text-red-700">
                          This content is protected by advanced security
                          measures. Any attempts to circumvent these protections
                          may result in account suspension.
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="discuss" className="mt-6">
                    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageCircle className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Discussion Forum
                          </h3>
                          <p className="text-gray-600 mb-4">
                            Ask your doubts and discuss with other learners
                            here.
                          </p>
                          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Start Discussion
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="stats" className="mt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <h4 className="font-semibold text-gray-700">Method</h4>
                        <p className="text-lg font-bold text-purple-600">
                          {videoStreamingMethod?.toUpperCase() || "Loading"}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <h4 className="font-semibold text-gray-700">
                          Security
                        </h4>
                        <p className="text-lg font-bold text-green-600">
                          🔒 Maximum
                        </p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <h4 className="font-semibold text-gray-700">Status</h4>
                        <p className="text-lg font-bold text-blue-600">
                          {connectionStatus.charAt(0).toUpperCase() +
                            connectionStatus.slice(1)}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <h4 className="font-semibold text-gray-700">Quality</h4>
                        <p className="text-lg font-bold text-orange-600">
                          {videoQuality}
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Course Progress & Episodes */}
          <div className="lg:col-span-3">
            <div className="sticky top-8 space-y-6">
              {/* Course Progress Card */}
              <Card className="border-0 shadow-xl bg-white rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    {tutorial.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">
                          Progress
                        </span>
                        <span className="text-sm font-bold text-purple-600">
                          {progressPercentage}%
                        </span>
                      </div>
                      <Progress
                        value={progressPercentage}
                        className="h-3 bg-gray-200"
                      />
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {completedCount} of {totalCount} completed
                      </span>
                      <Badge className="bg-green-100 text-green-800 border-0">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        🔒 Secure
                      </Badge>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <div className="text-xl font-bold text-purple-600">
                          {seasons.length}
                        </div>
                        <div className="text-xs text-gray-600">Seasons</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">
                          {totalCount}
                        </div>
                        <div className="text-xs text-gray-600">Episodes</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Episodes List */}
              <Card className="border-0 shadow-xl bg-white rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    🔒 Secure Course Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <Accordion
                    type="single"
                    collapsible
                    defaultValue={seasons[0]?._id}
                    className="w-full space-y-2"
                  >
                    {seasons.map((season: Season) => (
                      <AccordionItem
                        key={season._id}
                        value={season._id}
                        className="border border-gray-200 rounded-xl overflow-hidden"
                      >
                        <AccordionTrigger className="bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-3 hover:no-underline hover:from-purple-100 hover:to-blue-100 transition-all duration-200">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                              <Video className="w-4 h-4 text-white" />
                            </div>
                            <div className="text-left">
                              <h4 className="font-bold text-gray-900 text-sm">
                                🔒 {season.season}
                              </h4>
                              <p className="text-xs text-gray-600">
                                {season.episodes.length} secure episodes
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-2 py-2 bg-white">
                          <div className="space-y-1">
                            {season.episodes.map((episode: Episode) => (
                              <div
                                key={episode._id}
                                className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                  activeEpisode === episode._id
                                    ? "bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-300"
                                    : hoveredEpisode === episode._id
                                    ? "bg-gray-50 border border-gray-200"
                                    : "hover:bg-gray-50"
                                }`}
                                onClick={() => handleEpisodeClick(episode)}
                                onMouseEnter={() =>
                                  setHoveredEpisode(episode._id)
                                }
                                onMouseLeave={() => setHoveredEpisode(null)}
                              >
                                {/* Episode Icon */}
                                <div
                                  className={`p-2 rounded-lg transition-all duration-200 ${
                                    episode.completed
                                      ? "bg-green-100"
                                      : activeEpisode === episode._id
                                      ? "bg-purple-200"
                                      : "bg-gray-100 group-hover:bg-purple-100"
                                  }`}
                                >
                                  {episode.completed ? (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  ) : activeEpisode === episode._id ? (
                                    <PauseCircle className="w-4 h-4 text-purple-600" />
                                  ) : (
                                    <PlayCircle className="w-4 h-4 text-gray-500 group-hover:text-purple-600" />
                                  )}
                                </div>

                                {/* Episode Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1 mb-1">
                                    <span className="text-xs font-semibold text-gray-900">
                                      {episode.episode}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      •
                                    </span>
                                    <span className="text-xs text-gray-900 truncate">
                                      {episode.title}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Clock className="w-3 h-3" />
                                    <span>15 min</span>
                                    <span className="text-green-600">🔒</span>
                                  </div>
                                </div>

                                {/* Status Indicator */}
                                {episode.completed && (
                                  <div className="flex-shrink-0">
                                    <Badge className="bg-green-100 text-green-700 border-0 text-xs px-2 py-1">
                                      ✅ Done
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* 🔒 SECURE Session Expired Modal */}
      <SessionExpiredModal />
    </div>
  );
}
