import { AuthorLink } from "../../user/index.js";
import { formatPostDate } from "../lib/formatPostDate.js";

export const PostMeta = ({ post, leading, className, statusClassName }) => (
  <div className={className}>
    {leading}
    <AuthorLink user={post.author} />
    <time dateTime={post.publish_date}>{formatPostDate(post.publish_date)}</time>
    {post.status !== "active" && <span className={statusClassName}>Inactive</span>}
  </div>
);
