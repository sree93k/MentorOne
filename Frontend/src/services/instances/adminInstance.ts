import axios from "axios";
import store from "@/redux/store/store";
import { resetAdmin } from "@/redux/slices/adminSlice";

const API_URL = import.meta.env.VITE_MENTOR_ONE_API_URL;
export const adminAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
