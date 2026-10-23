import { Navigate } from "react-router";
import { useSelector } from "react-redux";
import { AUTH_STATUS } from "../model/constants.js";

export const GuestRoute = ({ children }) => {
  const status = useSelector((state) => state.auth.status);

  if (status === AUTH_STATUS.authenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};
