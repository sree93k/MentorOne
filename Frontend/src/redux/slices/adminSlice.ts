import { createSlice } from "@reduxjs/toolkit";

interface Admin {
  _id: string; // Match API response
  adminEmail: string; // Match API response
  adminName: string; // Match API response
  role: "admin";
  firstName?: string; // Optional fields from response
  lastName?: string;
  profilePicture?: string;
  __v?: number; // Optional MongoDB version key
}
interface InitialState {
  user: Admin | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  formData: object;
  pageTitle: string;
  tempData: object;
}

const initialState: InitialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  formData: {},
  pageTitle: "Admin Panel",
  tempData: {},
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin(state, action) {
      state.user = action.payload;
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
    setTempData(state, action) {
      state.tempData = action.payload;
    },
    resetAdmin: () => initialState,
  },
});

export const {
  setAdmin,
  setLoading,
  setError,
  setIsAuthenticated,
  resetAdmin,
} = adminSlice.actions;

export default adminSlice.reducer;
