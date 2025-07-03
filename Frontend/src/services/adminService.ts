import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { adminAxiosInstance } from "./instances/adminInstance";

const api = adminAxiosInstance;

export interface UserResponse {
  data: {
    users: Array<{
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      mentorId?: { isApproved: string };
      role: string[];
      isBlocked?: boolean;
    }>;
    total: number;
    totalMentors: number;
    totalMentees: number;
    totalBoth: number;
    approvalPending: number;
  };
}

export const validateAdminSession = async () => {
  try {
    const token = Cookies.get("adminAccessToken");
    if (!token) throw new Error("No authentication token found");

    const response = await api.get("/admin/validate_session", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Axios error:", error.response?.data || error.message);
      return error.response;
    }
    console.error("Unexpected error:", error);
    return null;
  }
};

interface DashboardDatas {
  users: object;
  bookings: object;
  payment: object;
  services: object;
}

export const getDashboardData = async (): Promise<DashboardDatas | null> => {
  try {
    const token = Cookies.get("adminAccessToken");

    const url = `/admin/dashboard`;
    const response = await api.get<UserResponse>(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Map the response to match DashboardDatas interface
    return {
      users: response.data.data?.users || {},
      bookings: response.data.data?.bookings || {},
      payment: response.data.data?.payment || {},
      services: response.data.data?.services || {},
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Axios error:", error.response?.data || error.message);
      return null;
    }
    console.error("Unexpected error:", error);
    return null;
  }
};
export const getAllUsers = async (
  page: number,
  limit: number,
  role?: string,
  status?: string,
  searchQuery?: string
): Promise<UserResponse | null> => {
  try {
    const token = Cookies.get("adminAccessToken");
    if (!token) throw new Error("No authentication token found");

    let url = `/admin/users?page=${page}&limit=${limit}`;
    if (role) url += `&role=${role}`;
    if (status) url += `&status=${status}`;
    if (searchQuery) url += `&searchQuery=${encodeURIComponent(searchQuery)}`;

    const response = await api.get<UserResponse>(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Axios error:", error.response?.data || error.message);
      return null;
    }
    console.error("Unexpected error:", error);
    return null;
  }
};

export const getUserRoleData = async (id: string) => {
  try {
    const token = Cookies.get("adminAccessToken");
    if (!token) throw new Error("No authentication token found");

    const response = await api.get(`/admin/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Axios error:", error.response?.data || error.message);
      return error.response;
    }
    console.error("Unexpected error:", error);
    return null;
  }
};

export const updateUserStatus = async (userId: string, isBlocked: boolean) => {
  try {
    const token = Cookies.get("adminAccessToken");
    if (!token) throw new Error("No authentication token found");

    const response = await api.patch(
      `/admin/userstatus_update/${userId}`,
      { isBlocked },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response;
  } catch (error: unknown) {
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
    const token = Cookies.get("adminAccessToken");
    if (!token) throw new Error("No authentication token found");

    const response = await api.patch(
      `/admin/mentorstatus_update/${mentorId}`,
      { status, reason },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response;
  } catch (error: unknown) {
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
    const token = Cookies.get("adminAccessToken");
    if (!token) throw new Error("No authentication token found");

    let url = `/admin/bookings?page=${page}&limit=${limit}`;
    if (searchQuery) url += `&searchQuery=${encodeURIComponent(searchQuery)}`;
    if (service && service !== "All")
      url += `&service=${encodeURIComponent(service)}`;
    if (status && status !== "All")
      url += `&status=${encodeURIComponent(status)}`;

    const response = await api.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Axios error:", error.response?.data || error.message);
      return null;
    }
    console.error("Unexpected error:", error);
    return null;
  }
};

export const getAllPayments = async (
  page: number,
  limit: number,
  searchQuery: string = "",
  status?: string
) => {
  try {
    const token = Cookies.get("adminAccessToken");
    if (!token) throw new Error("No authentication token found");

    let url = `/admin/payments?page=${page}&limit=${limit}`;
    if (searchQuery) url += `&searchQuery=${encodeURIComponent(searchQuery)}`;
    if (status && status !== "All")
      url += `&status=${encodeURIComponent(status)}`;

    const response = await api.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Axios error:", error.response?.data || error.message);
      return null;
    }
    console.error("Unexpected error:", error);
    return null;
  }
};

export const transferToMentor = async (
  paymentId: string,
  mentorId: string,
  amount: number
) => {
  try {
    const token = Cookies.get("adminAccessToken");
    if (!token) throw new Error("No authentication token found");

    const response = await api.post(
      "/admin/transfer-to-mentor",
      { paymentId, mentorId, amount },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Axios error:", error.response?.data || error.message);
      return null;
    }
    console.error("Unexpected error:", error);
    return null;
  }
};
