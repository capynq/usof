import { useLogoutMutation } from "../api/authApi.js";

export const LogoutButton = ({ className }) => {
  const [logout, { isLoading }] = useLogoutMutation();

  return (
    <button
      className={className}
      type="button"
      disabled={isLoading}
      onClick={() => logout()}
    >
      {isLoading && "Signing out…"}
      {!isLoading && "Sign out"}
    </button>
  );
};
