import { createBrowserRouter } from "react-router";
import { AccountPage } from "../pages/account/index.js";
import { AboutPage } from "../pages/about/index.js";
import { EmailConfirmationPage } from "../pages/email-confirmation/index.js";
import { ForgotPasswordPage } from "../pages/forgot-password/index.js";
import { HomePage } from "../pages/home/index.js";
import { PostDetailsPage } from "../pages/post-details/index.js";
import { CreatePostPage } from "../pages/create-post/index.js";
import { EditPostPage } from "../pages/edit-post/index.js";
import { UserProfilePage } from "../pages/user-profile/index.js";
import { LoginPage } from "../pages/login/index.js";
import { NotFoundPage } from "../pages/not-found/index.js";
import { RegisterPage } from "../pages/register/index.js";
import { ResetPasswordPage } from "../pages/reset-password/index.js";
import { GuestRoute, ProtectedRoute } from "../features/auth/index.js";
import { MainLayout } from "./layouts/MainLayout.jsx";
import { RouteErrorFallback } from "./ui/RouteErrorFallback.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <RouteErrorFallback />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "posts/new", element: <ProtectedRoute><CreatePostPage /></ProtectedRoute> },
      { path: "posts/:postId/edit", element: <ProtectedRoute><EditPostPage /></ProtectedRoute> },
      { path: "posts/:postId", element: <PostDetailsPage /> },
      { path: "users/:userId", element: <UserProfilePage /> },
      { path: "login", element: <GuestRoute><LoginPage /></GuestRoute> },
      { path: "register", element: <GuestRoute><RegisterPage /></GuestRoute> },
      { path: "email-confirmation", element: <EmailConfirmationPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },
      { path: "account", element: <ProtectedRoute><AccountPage /></ProtectedRoute> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
