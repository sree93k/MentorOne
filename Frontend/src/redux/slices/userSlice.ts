import { createSlice } from "@reduxjs/toolkit";

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
  resetUser,
} = userSlice.actions;
export default userSlice.reducer;
