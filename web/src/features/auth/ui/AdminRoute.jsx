import { useSelector } from "react-redux";
import { Link } from "react-router";
import { selectCurrentUser } from "../model/authSlice.js";
import { ProtectedRoute } from "./ProtectedRoute.jsx";

export const AdminRoute = ({ children }) => {
  const user = useSelector(selectCurrentUser);

  return (
    <ProtectedRoute>
      {user?.role === "admin" ? (
        children
      ) : (
        <section>
          <h1>Administrator access required</h1>
          <p>This part of Usof is for community management.</p>
          <Link to="/">Back to questions</Link>
        </section>
      )}
    </ProtectedRoute>
  );
};
