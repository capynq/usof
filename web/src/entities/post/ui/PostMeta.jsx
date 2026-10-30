import { AuthorLink } from "../../user/index.js";
import { formatPostDate } from "../lib/formatPostDate.js";
import { StatusBadge } from "../../../shared/ui/status-badge/StatusBadge.jsx";

export const PostMeta = ({ post, leading, leadingGroupClassName, className, showAuthor = true }) => (
  <div className={className}>
    {showAuthor && <AuthorLink user={post.author} />}
    {leadingGroupClassName ? (
      <span className={leadingGroupClassName}>
        {leading}
        <time dateTime={post.publish_date}>{formatPostDate(post.publish_date)}</time>
      </span>
    ) : (
      <>
        {leading}
        <time dateTime={post.publish_date}>{formatPostDate(post.publish_date)}</time>
      </>
    )}
    {post.updated_at && post.updated_at !== post.publish_date && (
      <span>
        Updated <time dateTime={post.updated_at}>{formatPostDate(post.updated_at)}</time>
      </span>
    )}
    {post.status !== "active" && <StatusBadge status="inactive" />}
  </div>
);
