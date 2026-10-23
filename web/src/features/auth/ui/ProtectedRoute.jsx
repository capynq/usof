import { Navigate, useLocation } from "react-router";
import { useSelector } from "react-redux";
import { AUTH_STATUS } from "../model/constants.js";

export const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { status, user } = useSelector((state) => state.auth);

  if (status === AUTH_STATUS.authenticated && user) {
    return children;
  }

  return <Navigate to="/login" replace state={{ from: location }} />;
};
