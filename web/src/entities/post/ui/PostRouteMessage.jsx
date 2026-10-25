export const PostRouteMessage = ({ children, className, type = "error" }) => (
  <p className={className} role={type === "loading" ? "status" : "alert"}>
    {children}
  </p>
);
