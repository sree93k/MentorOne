import { AxiosError } from "axios";
import { adminAxiosInstance } from "./instances/adminInstance";
import { useId } from "react";

const api = adminAxiosInstance;

export const validateAdminSession = async () => {
  try {
    console.log("amdin validate_session step 1");

    const response = await api.get("/admin/validate_session");
    console.log("amdin validate_session step 2 response =>", response);
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
    // Retrieve the admin token from localStorage
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No admin token found. Please log in.");
    }
    console.log("admin get allusers step 1 sending........");
    let url = `/admin/allUsers?page=${page}&limit=${limit}`; // Note: Updated to match backend route
    if (role) url += `&role=${role}`;
    if (status) url += `&status=${status}`;

    const response = await api.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("admin get allusers step 2 response ......", response.data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Axios error:", error.response?.data || error.message);
      return error.response; // Return error response for handling in component
    } else {
      console.error("Unexpected error:", error);
      return null;
    }
  }
};

export const getUserRoleData = async (id: string) => {
  try {
    console.log("getUserRoleData service start 1:", id);
    const accessToken = localStorage.getItem("accessToken");
    console.log("getUserRoleData service start 2:", accessToken);
    const response = await api.get(`/admin/userData/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("getUserRoleData service start 3:", response);
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log("getUserRoleData service start 4 error:", error);
      console.error("Axios error:", error.response?.data || error.message);
      return error.response; // Return error response for handling in component
    } else {
      console.error("Unexpected error:", error);
      return null;
    }
  }
};

// Update user blocked status
export const updateUserStatus = async (userId: string, isBlocked: boolean) => {
  try {
    // const response = await api.patch(`/admin/users/${userId}/status`, {
    //   isBlocked,
    // });
    console.log("updateUserStatus service 1", useId, isBlocked);

    const accessToken = localStorage.getItem("accessToken");
    const userData = await api.patch(
      `/admin/userstatus_update/${userId}`,
      { isBlocked }, // This is the body
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("updateUserStatus service 2", userData);
    return userData;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
};

// Update mentor approval status
export const updateMentorStatus = async (mentorId: string, status: string) => {
  try {
    console.log("updateMentorStatus step 1 sending...", mentorId, status);

    const accessToken = localStorage.getItem("accessToken");
    const mentorData = await api.patch(
      `/admin/mentorstatus_update/${mentorId}`,
      { status }, // This is the body
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("updateMentorStatus repsonse", mentorData);

    return mentorData;
  } catch (error) {
    console.error("Error updating mentor status:", error);
    throw error;
  }
};
