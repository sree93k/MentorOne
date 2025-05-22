import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "mentor" | "mentee";
  profleImg: string;
  phone: string;
  passwordDate: string;
  activated?: boolean;
  mentorActivated?: boolean;
}

interface InitialState {
  _id: string;
  user: User | null;
  loading: boolean;
  error: object;
  isAuthenticated: boolean;
  activated: boolean;
  mentorActivated?: boolean;
  accessToken: string;
  currentTab: string;
  formData: object;
  dashboard: string;
  isOnline: { status: boolean; role: "mentor" | "mentee" | null };
  isApproved: string;
  pageTitle: string;
  tempData: object;
}

const initialState: InitialState = {
  _id: "",
  user: null,
  loading: false,
  error: {},
  isAuthenticated: false,
  activated: false,
  mentorActivated: false,
  accessToken: "",
  currentTab: "",
  formData: {},
  dashboard: "",
  isOnline: { status: false, role: null },
  isApproved: "",
  pageTitle: "User Panel",
  tempData: {},
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
  resetUser,
} = userSlice.actions;
export default userSlice.reducer;
