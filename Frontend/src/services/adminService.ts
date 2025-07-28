import { AxiosError } from "axios";
import { adminAxiosInstance } from "./instances/adminInstance";

const api = adminAxiosInstance;

export const validateAdminSession = async () => {
  try {
    console.log("admin validate_session step 1");
    // NO localStorage usage - cookies sent automatically
    const response = await api.get("/admin/validate_session");
    console.log("admin validate_session step 2 response =>", response);
    return response;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return error.response;
    } else {
      return null;
    }
  }
};

export const getAllusers = async (
  page: number,
  limit: number,
  role?: string,
  status?: string
) => {
  try {
    console.log("admin get allusers step 1 sending........");
    let url = `/admin/users?page=${page}&limit=${limit}`;
    if (role) url += `&role=${role}`;
    if (status) url += `&status=${status}`;

    // NO localStorage usage - cookies sent automatically
    const response = await api.get(url);

    console.log("admin get allusers step 2 response ......", response.data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Axios error:", error.response?.data || error.message);
      return error.response;
    } else {
      console.error("Unexpected error:", error);
      return null;
    }
  }
};

export const getUserRoleData = async (id: string) => {
  try {
    console.log("getUserRoleData service start 1:", id);
    // NO localStorage usage - cookies sent automatically
    // Fixed URL: removed space in `/admin/user /${id}`
    const response = await api.get(`/admin/user/${id}`);
    console.log("getUserRoleData service start 3:", response);
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log("getUserRoleData service start 4 error:", error);
      console.error("Axios error:", error.response?.data || error.message);
      return error.response;
    } else {
      console.error("Unexpected error:", error);
      return null;
    }
  }
};

export const updateUserStatus = async (userId: string, isBlocked: boolean) => {
  try {
    console.log("updateUserStatus service 1", userId, isBlocked);

    // NO localStorage usage - cookies sent automatically
    const userData = await api.patch(`/admin/userstatus_update/${userId}`, {
      isBlocked,
    });
    console.log("updateUserStatus service 2", userData);
    return userData;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
};

export const updateMentorStatus = async (
  mentorId: string,
  status: string,
  reason: string = ""
) => {
  try {
    console.log(
      "updateMentorStatus step 1 sending...",
      mentorId,
      status,
      reason
    );

    // NO localStorage usage - cookies sent automatically
    const mentorData = await api.patch(
      `/admin/mentorstatus_update/${mentorId}`,
      {
        status,
        reason,
      }
    );
    console.log("updateMentorStatus response", mentorData);

    return mentorData;
  } catch (error) {
    console.error("Error updating mentor status:", error);
    throw error;
  }
};

export const getAllBookings = async (
  page: number,
  limit: number,
  searchQuery: string = "",
  service?: string,
  status?: string
) => {
  try {
    console.log("admin get all bookings step 1 sending...");
    let url = `/admin/bookings?page=${page}&limit=${limit}`;
    if (searchQuery) url += `&searchQuery=${encodeURIComponent(searchQuery)}`;
    if (service && service !== "All")
      url += `&service=${encodeURIComponent(service)}`;
    if (status && status !== "All")
      url += `&status=${encodeURIComponent(status)}`;

    // NO localStorage usage - cookies sent automatically
    const response = await api.get(url);

    console.log("admin get all bookings step 2 response...", response.data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Axios error:", error.response?.data || error.message);
      return error.response;
    } else {
      console.error("Unexpected error:", error);
      return null;
    }
  }
};

export const getAllPayments = async (
  page: number,
  limit: number,
  searchQuery: string = "",
  status?: string
) => {
  try {
    console.log("admin get all payments step 1 sending...");
    let url = `/admin/payments?page=${page}&limit=${limit}`;
    if (searchQuery) url += `&searchQuery=${encodeURIComponent(searchQuery)}`;
    if (status && status !== "All")
      url += `&status=${encodeURIComponent(status)}`;

    // NO localStorage usage - cookies sent automatically
    const response = await api.get(url);

    console.log("admin get all payments step 2 response...", response.data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Axios error:", error.response?.data || error.message);
      return error.response;
    } else {
      console.error("Unexpected error:", error);
      return null;
    }
  }
};

export const transferToMentor = async (
  paymentId: string,
  mentorId: string,
  amount: number
) => {
  try {
    console.log(
      "admin transfer to mentor step 1 sending...",
      paymentId,
      mentorId,
      amount
    );
    // NO localStorage usage - cookies sent automatically
    const response = await api.post("/admin/transfer-to-mentor", {
      paymentId,
      mentorId,
      amount,
    });
    console.log("admin transfer to mentor step 2 response...", response.data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Axios error:", error.response?.data || error.message);
      return error.response;
    } else {
      console.error("Unexpected error:", error);
      return null;
    }
  }
};
