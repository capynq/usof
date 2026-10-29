import { Router } from "express";

export const authRoutes = (controller, authenticate) => {
  const router = Router();
  router.get("/me", authenticate, controller.me);
  router.post("/register", controller.register);
  router.post("/login", controller.login);
  router.post("/logout", authenticate, controller.logout);
  router.get("/email-confirm/:confirm_token", controller.confirm);
  router.post("/email-confirm", controller.resendConfirmation);
  router.post("/password-reset", controller.requestReset);
  router.post("/password-reset/:confirm_token", controller.reset);

  return router;
};
