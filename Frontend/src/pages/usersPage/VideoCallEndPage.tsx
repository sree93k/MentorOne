import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ShieldCheck,
  Video,
  Clock,
  Users,
  Star,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

const VideoCallEndPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { isOnline } = useSelector((state: RootState) => state.user);

  // Use joinLink from state, default to /user/meeting-join/<meetingId> for mentees
  const joinLink =
    state?.joinLink ||
    (isOnline?.role === "mentee"
      ? `/user/meeting-join/${id}`
      : `/user/meeting/${id}`);

  // Get meeting duration from state or default
  const meetingDuration = state?.duration || "45 min";
  const participantCount = state?.participantCount || 2;

  const handleRejoin = () => {
    console.log("VideoCallEndPage: Rejoining meeting with link:", joinLink);
    navigate(joinLink);
  };

  const handleReturnHome = () => {
    console.log("VideoCallEndPage: Navigating to home screen");
    navigate("/user/meetinghome");
  };

  const handleSubmitFeedback = () => {
    console.log("Opening feedback form");
    // You can implement feedback functionality here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 via-white to-blue-300">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
              <Video className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MentorOne Meet
            </span>
          </div>

          <div className="flex items-center space-x-2 text-gray-600 bg-white/50 px-3 py-2 rounded-lg">
            <span className="text-sm">Meeting ended</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl text-center space-y-8">
          {/* Meeting Duration Badge */}
          <div className="flex justify-center">
            <div className="bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-200/50 shadow-lg">
              <div className="flex items-center space-x-2 text-gray-700">
                <Clock className="w-5 h-5" />
                <span className="font-medium">{meetingDuration}</span>
                <span className="text-gray-500">•</span>
                <Users className="w-5 h-5" />
                <span className="font-medium">
                  {participantCount} participants
                </span>
              </div>
            </div>
          </div>

          {/* Main Message */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              You've left the meeting
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Thanks for joining! Your session has ended successfully.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            {isOnline?.role === "mentee" && (
              <button
                onClick={handleRejoin}
                className="w-full sm:w-auto bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Rejoin Meeting</span>
              </button>
            )}

            <button
              onClick={handleReturnHome}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Return to Home</span>
            </button>
          </div>

          {/* Feedback Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 max-w-md mx-auto">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                How was your meeting?
              </h3>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  </button>
                ))}
              </div>
              <button
                onClick={handleSubmitFeedback}
                className="w-full text-blue-600 hover:text-blue-700 font-medium py-2 transition-colors"
              >
                Submit detailed feedback
              </button>
            </div>
          </div>

          {/* Security Info Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 overflow-hidden max-w-2xl mx-auto">
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-50 p-3 rounded-xl">
                  <ShieldCheck className="text-blue-600 w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Your meeting was secure
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Only invited or admitted participants could join this
                    meeting.
                  </p>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Meeting Summary */}
          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">Duration</h4>
              <p className="text-2xl font-bold text-green-600">
                {meetingDuration}
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">Participants</h4>
              <p className="text-2xl font-bold text-blue-600">
                {participantCount}
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Video className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">Quality</h4>
              <p className="text-2xl font-bold text-purple-600">HD</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => navigate("/user/meetinghome")}
                className="flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Video className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">
                    Schedule another meeting
                  </div>
                  <div className="text-sm text-gray-500">
                    Set up your next session
                  </div>
                </div>
              </button>

              <button
                onClick={handleSubmitFeedback}
                className="flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">
                    Rate this session
                  </div>
                  <div className="text-sm text-gray-500">Help us improve</div>
                </div>
              </button>
            </div>
          </div>

          {/* Footer Message */}
          <div className="text-center text-gray-500 text-sm">
            Meeting ID: <span className="font-mono font-medium">{id}</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoCallEndPage;
