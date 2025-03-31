import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
// import { validateAdminSession } from "../../services/adminService";
import { logout, validateAdminSession } from "@/services/adminService";
import { resetAdmin } from "@/redux/slices/adminSlice";
import toast from "react-hot-toast";

interface PrivateRouteProps {
  element: React.ComponentType;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element: Element }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const validateSession = async () => {
      console.log("admin private route...step1 ");
      const response = await validateAdminSession();
      if (response?.status === 200) {
        return;
      }
      console.log("admin private route...step2 ");
      if (response?.status === 401) {
        await logout();
        dispatch(resetAdmin());
        navigate("/admin/login");
        toast.error("Session expired Please login again");
      }
    };
    console.log("admin private route...step3");
    validateSession();
    console.log("admin private route...step 4 end ");
  }, [dispatch, navigate]);

  const { isAuthenticated } = useSelector((state: RootState) => state.admin);

  return isAuthenticated ? <Element /> : <Navigate to="/admin/login" />;
};

export default PrivateRoute;
