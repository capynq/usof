import { useParams } from "react-router";
import { useGetPublicUserQuery } from "../../../entities/user/index.js";

export const useUserProfileController = () => {
  const { userId: rawUserId } = useParams();
  const userId = Number(rawUserId);
  const isValidUserId = Number.isInteger(userId) && userId > 0;
  const query = useGetPublicUserQuery(userId, { skip: !isValidUserId });

  return {
    isValidUserId,
    user: query.data,
    userError: query.error,
    isUserLoading: query.isLoading,
  };
};
