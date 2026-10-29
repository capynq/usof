import AdminJS from "adminjs";
import { adminResources } from "../controllers/admin.controller.js";

export const createAdmin = async (services) => {
  const admin = new AdminJS({
    rootPath: "/admin",
    loginPath: "/admin/login",
    logoutPath: "/admin/logout",
    resources: adminResources(services),
    branding: {
      companyName: "Usof",
      logo: false,
      withMadeWithLove: false,
    },
  });
  await admin.initialize();

  return admin;
};
