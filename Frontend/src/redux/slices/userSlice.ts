import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "mentor" | "mentee";
  profilePicture: string;
  phone: string;
  passwordDate: string;
  activated?: boolean;
  mentorActivated?: boolean;
}

interface NotificationCounts {
  mentorCount: number;
  menteeCount: number;
  lastFetched: string | null;
}

// NEW: Chat notification counts interface
interface ChatNotificationCounts {
  mentorUnreadChats: number;
  menteeUnreadChats: number;
  lastUpdated: string | null;
}

interface InitialState {
  _id: string;
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  activated: boolean;
  mentorActivated?: boolean;
  accessToken: string;
  currentTab: string;
  formData: object;
  dashboard: string;
  isOnline: { status: boolean; role: "mentor" | "mentee" | null };
  isApproved: string;
  reason: string;
  pageTitle: string;
  tempData: object;
  profilePictureSignedUrl?: string;
  notifications: NotificationCounts;
  // NEW: Chat notification state
  chatNotifications: ChatNotificationCounts;
}

const initialState: InitialState = {
  _id: "",
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  activated: false,
  mentorActivated: false,
  accessToken: "",
  currentTab: "",
  formData: {},
  dashboard: "",
  isOnline: { status: false, role: null },
  isApproved: "",
  reason: "",
  pageTitle: "User Panel",
  tempData: {},
  profilePictureSignedUrl: undefined,
  notifications: {
    mentorCount: 0,
    menteeCount: 0,
    lastFetched: null,
  },
  // NEW: Initial chat notification state
  chatNotifications: {
    mentorUnreadChats: 0,
    menteeUnreadChats: 0,
    lastUpdated: null,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      if (action.payload && action.payload.activated !== undefined) {
        state.activated = action.payload.activated;
      }
      if (action.payload && action.payload.currentTab !== undefined) {
        state.currentTab = action.payload.currentTab;
      }
      state.profilePictureSignedUrl = undefined;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setIsAuthenticated(state, action) {
      state.isAuthenticated = action.payload;
    },
    setActivated(state, action) {
      state.activated = action.payload;
    },
    setMentorActivated(state, action) {
      state.mentorActivated = action.payload;
    },
    setCurrentTab(state, action) {
      state.currentTab = action.payload;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
    setFormData(state, action) {
      state.formData = action.payload;
    },
    setDashboard(state, action) {
      state.dashboard = action.payload;
    },
    setOnlineStatus(
      state,
      action: PayloadAction<{
        status: boolean;
        role: "mentor" | "mentee" | null;
      }>
    ) {
      state.isOnline = action.payload;
    },
    setIsApproved(state, action) {
      state.isApproved = action.payload;
    },
    setReason(state, action) {
      state.reason = action.payload;
    },
    setProfilePictureSignedUrl(state, action) {
      state.profilePictureSignedUrl = action.payload;
    },
    updateProfilePicture(state, action) {
      if (state.user) {
        state.user.profilePicture = action.payload;
      }
      state.profilePictureSignedUrl = undefined;
    },
    // Existing notification actions
    setNotificationCounts(
      state,
      action: PayloadAction<{ mentorCount: number; menteeCount: number }>
    ) {
      state.notifications.mentorCount = action.payload.mentorCount;
      state.notifications.menteeCount = action.payload.menteeCount;
      state.notifications.lastFetched = new Date().toISOString();
    },
    incrementNotificationCount(
      state,
      action: PayloadAction<{ role: "mentor" | "mentee" | "both" }>
    ) {
      const { role } = action.payload;
      if (role === "mentor" || role === "both") {
        state.notifications.mentorCount += 1;
      }
      if (role === "mentee" || role === "both") {
        state.notifications.menteeCount += 1;
      }
    },
    clearNotificationCount(
      state,
      action: PayloadAction<{ role: "mentor" | "mentee" }>
    ) {
      const { role } = action.payload;
      if (role === "mentor") {
        state.notifications.mentorCount = 0;
      } else if (role === "mentee") {
        state.notifications.menteeCount = 0;
      }
    },
    decrementNotificationCount(
      state,
      action: PayloadAction<{ role: "mentor" | "mentee" | "both" }>
    ) {
      const { role } = action.payload;
      if (role === "mentor" || role === "both") {
        state.notifications.mentorCount = Math.max(
          0,
          state.notifications.mentorCount - 1
        );
      }
      if (role === "mentee" || role === "both") {
        state.notifications.menteeCount = Math.max(
          0,
          state.notifications.menteeCount - 1
        );
      }
    },

    // NEW: Chat notification actions
    setChatUnreadCounts(
      state,
      action: PayloadAction<{
        mentorUnreadChats: number;
        menteeUnreadChats: number;
      }>
    ) {
      state.chatNotifications.mentorUnreadChats =
        action.payload.mentorUnreadChats;
      state.chatNotifications.menteeUnreadChats =
        action.payload.menteeUnreadChats;
      state.chatNotifications.lastUpdated = new Date().toISOString();
    },
    incrementChatUnread(
      state,
      action: PayloadAction<{ role: "mentor" | "mentee" }>
    ) {
      const { role } = action.payload;
      if (role === "mentor") {
        state.chatNotifications.mentorUnreadChats += 1;
      } else if (role === "mentee") {
        state.chatNotifications.menteeUnreadChats += 1;
      }
      state.chatNotifications.lastUpdated = new Date().toISOString();
    },
    decrementChatUnread(
      state,
      action: PayloadAction<{ role: "mentor" | "mentee" }>
    ) {
      const { role } = action.payload;
      if (role === "mentor") {
        state.chatNotifications.mentorUnreadChats = Math.max(
          0,
          state.chatNotifications.mentorUnreadChats - 1
        );
      } else if (role === "mentee") {
        state.chatNotifications.menteeUnreadChats = Math.max(
          0,
          state.chatNotifications.menteeUnreadChats - 1
        );
      }
      state.chatNotifications.lastUpdated = new Date().toISOString();
    },
    clearChatUnread(
      state,
      action: PayloadAction<{ role: "mentor" | "mentee" }>
    ) {
      const { role } = action.payload;
      if (role === "mentor") {
        state.chatNotifications.mentorUnreadChats = 0;
      } else if (role === "mentee") {
        state.chatNotifications.menteeUnreadChats = 0;
      }
      state.chatNotifications.lastUpdated = new Date().toISOString();
    },
    resetUser: () => initialState,
  },
});

export const {
  setUser,
  setLoading,
  setError,
  setIsAuthenticated,
  setActivated,
  setMentorActivated,
  setCurrentTab,
  setAccessToken,
  setFormData,
  setDashboard,
  setOnlineStatus,
  setIsApproved,
  setReason,
  setProfilePictureSignedUrl,
  updateProfilePicture,
  // Existing notification actions
  setNotificationCounts,
  incrementNotificationCount,
  clearNotificationCount,
  decrementNotificationCount,
  // NEW: Export chat notification actions
  setChatUnreadCounts,
  incrementChatUnread,
  decrementChatUnread,
  clearChatUnread,
  resetUser,
} = userSlice.actions;

export default userSlice.reducer;
