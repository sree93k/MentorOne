import { createSlice } from "@reduxjs/toolkit";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "mentor" | "mentee";
}

interface InitialState {
  user: User | null;
  loading: boolean;
  error: object;
  isAuthenticated: boolean;
  accessToken: string;
  modal: boolean;
  formData: object;
}

const initialState: InitialState = {
  user: null,
  loading: false,
  error: {},
  isAuthenticated: false,
  accessToken: "",
  modal: false,
  formData: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
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
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
    setModal(state, action) {
      state.modal = action.payload;
    },
    setFormData(state, action) {
      state.formData = action.payload;
    },
    resetUser(state) {
      state.user = null;
      state.loading = false;
      state.error = {};
      state.isAuthenticated = false;
      state.accessToken = "";
      state.modal = false;
      state.formData = {};
    },
  },
});

export const {
  setUser,
  setLoading,
  setError,
  setIsAuthenticated,
  setAccessToken,
  setModal,
  setFormData,
  resetUser,
} = userSlice.actions;
export default userSlice.reducer;
