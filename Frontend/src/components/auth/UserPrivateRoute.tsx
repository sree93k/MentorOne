import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store/store";
import { useDispatch, useSelector } from "react-redux";

import { logout, validateUserSession } from "@/services/userAuthService";
import { resetUser } from "@/redux/slices/userSlice";
import toast from "react-hot-toast";

interface PrivateRouteProps {
  element: React.ComponentType;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element: Element }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const validateSession = async () => {
      console.log("user private route...step1 ");
      const response = await validateUserSession();
      if (response?.status === 200) {
        return;
      }
      console.log("user private route...step2 ");
      if (response?.status === 400) {
        await logout();
        dispatch(resetUser());
        navigate("/login");
        toast.error("Session expired Please login again");
      }
    };
    console.log("user private route...step3");
    validateSession();
    console.log("user private route...step 4 end ");
  }, [dispatch, navigate]);

  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  return isAuthenticated ? <Element /> : <Navigate to="/" />;
};

export default PrivateRoute;
