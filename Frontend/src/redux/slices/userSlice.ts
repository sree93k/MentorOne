// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface User {
//   _id: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   role: "mentor" | "mentee";
//   profleImg: string;
//   phone: string;
//   passwordDate: string;
//   activated?: boolean;
//   mentorActivated?: boolean;
// }

// interface InitialState {
//   _id: string;
//   user: User | null;
//   loading: boolean;
//   error: string | null;
//   isAuthenticated: boolean;
//   activated: boolean;
//   mentorActivated?: boolean;
//   accessToken: string;
//   currentTab: string;
//   formData: object;
//   dashboard: string;
//   isOnline: { status: boolean; role: "mentor" | "mentee" | null };
//   isApproved: string;
//   reason: string;
//   pageTitle: string;
//   tempData: object;
// }

// const initialState: InitialState = {
//   _id: "",
//   user: null,
//   loading: false,
//   error: null,
//   isAuthenticated: false,
//   activated: false,
//   mentorActivated: false,
//   accessToken: "",
//   currentTab: "",
//   formData: {},
//   dashboard: "",
//   isOnline: { status: false, role: null },
//   isApproved: "",
//   reason: "",
//   pageTitle: "User Panel",
//   tempData: {},
// };

// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     setUser(state, action) {
//       state.user = action.payload;
//       if (action.payload && action.payload.activated !== undefined) {
//         state.activated = action.payload.activated;
//       }
//       if (action.payload && action.payload.currentTab !== undefined) {
//         state.currentTab = action.payload.currentTab;
//       }
//     },
//     setLoading(state, action) {
//       state.loading = action.payload;
//     },
//     setError(state, action) {
//       state.error = action.payload;
//     },
//     setIsAuthenticated(state, action) {
//       state.isAuthenticated = action.payload;
//     },
//     setActivated(state, action) {
//       state.activated = action.payload;
//     },
//     setMentorActivated(state, action) {
//       state.mentorActivated = action.payload;
//     },
//     setCurrentTab(state, action) {
//       state.currentTab = action.payload;
//     },
//     setAccessToken(state, action) {
//       state.accessToken = action.payload;
//     },
//     setFormData(state, action) {
//       state.formData = action.payload;
//     },
//     setDashboard(state, action) {
//       state.dashboard = action.payload;
//     },
//     setOnlineStatus(
//       state,
//       action: PayloadAction<{
//         status: boolean;
//         role: "mentor" | "mentee" | null;
//       }>
//     ) {
//       state.isOnline = action.payload;
//     },
//     setIsApproved(state, action) {
//       state.isApproved = action.payload;
//     },
//     setReason(state, action) {
//       state.reason = action.payload;
//     },
//     resetUser: () => initialState,
//   },
// });

// export const {
//   setUser,
//   setLoading,
//   setError,
//   setIsAuthenticated,
//   setActivated,
//   setMentorActivated,
//   setCurrentTab,
//   setAccessToken,
//   setFormData,
//   setDashboard,
//   setOnlineStatus,
//   setIsApproved,
//   setReason,
//   resetUser,
// } = userSlice.actions;
// export default userSlice.reducer;
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "mentor" | "mentee";
  profilePicture: string; // This will now store S3 key or signed URL
  phone: string;
  passwordDate: string;
  activated?: boolean;
  mentorActivated?: boolean;
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
  // Add signed URL cache for profile picture
  profilePictureSignedUrl?: string;
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
      // Clear signed URL when user changes
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
    // New action to update profile picture signed URL
    setProfilePictureSignedUrl(state, action) {
      state.profilePictureSignedUrl = action.payload;
    },
    // Action to update profile picture (both in user and clear signed URL)
    updateProfilePicture(state, action) {
      if (state.user) {
        state.user.profilePicture = action.payload;
      }
      // Clear signed URL so it gets regenerated
      state.profilePictureSignedUrl = undefined;
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
  resetUser,
} = userSlice.actions;

export default userSlice.reducer;
