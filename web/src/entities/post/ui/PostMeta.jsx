import { AuthorLink } from "../../user/index.js";
import { formatPostDate } from "../lib/formatPostDate.js";
import { StatusBadge } from "../../../shared/ui/status-badge/StatusBadge.jsx";

export const PostMeta = ({ post, leading, className, showAuthor = true }) => (
  <div className={className}>
    {leading}
    {showAuthor && <AuthorLink user={post.author} />}
    <time dateTime={post.publish_date}>{formatPostDate(post.publish_date)}</time>
    {post.updated_at && post.updated_at !== post.publish_date && (
      <span>
        Updated <time dateTime={post.updated_at}>{formatPostDate(post.updated_at)}</time>
      </span>
    )}
    {post.status !== "active" && <StatusBadge status="inactive" />}
  </div>
);
