import { createBrowserRouter } from "react-router";
import { AboutPage } from "../pages/about/index.js";
import { HomePage } from "../pages/home/index.js";
import { NotFoundPage } from "../pages/not-found/index.js";
import { MainLayout } from "./layouts/MainLayout.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
