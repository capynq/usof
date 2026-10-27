import { getUserDisplayName } from "../../../entities/user/index.js";
import { PostFeed } from "../../../widgets/post-feed/ui/PostFeed.jsx";

export const UserProfilePosts = ({ user }) => (
  <PostFeed
    authorId={user.id}
    heading={`Questions by ${getUserDisplayName(user)}`}
  />
);
