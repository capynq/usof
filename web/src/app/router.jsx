import { Navigate } from "react-router";
import { AdminRoute } from "../features/auth/ui/AdminRoute.jsx";
import { ManageLayout } from "../pages/manage/ui/ManageLayout.jsx";
import { FavoritesPage } from "../pages/favorites/ui/FavoritesPage.jsx";
import { CommentPermalinkPage } from "../pages/comment/ui/CommentPermalinkPage.jsx";
import { createBrowserRouter } from "react-router";
import { AccountPage } from "../pages/account/index.js";
import { CategoryPage } from "../pages/category/index.js";
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
      {
        path: "manage",
        handle: { mascotContext: "manage" },
        element: (
          <AdminRoute>
            <ManageLayout />
          </AdminRoute>
        ),
        children: [
          { index: true, element: <Navigate to="users" replace /> },
          {
            path: "users",
            lazy: async () => ({
              Component: (await import("../pages/manage/ui/ManageUsers.jsx"))
                .ManageUsers,
            }),
          },
          {
            path: "categories",
            lazy: async () => ({
              Component: (
                await import("../pages/manage/ui/ManageCategories.jsx")
              ).ManageCategories,
            }),
          },
          {
            path: "posts",
            lazy: async () => ({
              Component: (await import("../pages/manage/ui/ManagePosts.jsx"))
                .ManagePosts,
            }),
          },
          {
            path: "comments",
            lazy: async () => ({
              Component: (await import("../pages/manage/ui/ManageComments.jsx"))
                .ManageComments,
            }),
          },
          {
            path: "reactions",
            lazy: async () => ({
              Component: (
                await import("../pages/manage/ui/ManageReactions.jsx")
              ).ManageReactions,
            }),
          },
        ],
      },
      {
        path: "favorites",
        handle: { mascotContext: "browse" },
        element: (
          <ProtectedRoute>
            <FavoritesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "comments/:commentId",
        handle: { mascotContext: "writing" },
        element: <CommentPermalinkPage />,
      },
      {
        path: "about",
        handle: { mascotContext: "browse" },
        element: <AboutPage />,
      },
      {
        path: "posts/new",
        handle: { mascotContext: "writing" },
        element: (
          <ProtectedRoute>
            <CreatePostPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "posts/:postId/edit",
        handle: { mascotContext: "writing" },
        element: (
          <ProtectedRoute>
            <EditPostPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "posts/:postId",
        handle: { mascotContext: "writing" },
        element: <PostDetailsPage />,
      },
      {
        path: "categories/:categoryId",
        handle: { mascotContext: "browse" },
        element: <CategoryPage />,
      },
      {
        path: "users/:userId",
        handle: { mascotContext: "browse" },
        element: <UserProfilePage />,
      },
      {
        path: "login",
        handle: { mascotContext: "account" },
        element: (
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        ),
      },
      {
        path: "register",
        handle: { mascotContext: "account" },
        element: (
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        ),
      },
      {
        path: "email-confirmation",
        handle: { mascotContext: "account" },
        element: <EmailConfirmationPage />,
      },
      {
        path: "forgot-password",
        handle: { mascotContext: "account" },
        element: <ForgotPasswordPage />,
      },
      {
        path: "reset-password",
        handle: { mascotContext: "account" },
        element: <ResetPasswordPage />,
      },
      {
        path: "account",
        handle: { mascotContext: "account" },
        element: (
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        handle: { mascotContext: "system" },
        element: <NotFoundPage />,
      },
    ],
  },
]);
