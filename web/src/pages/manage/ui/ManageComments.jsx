import { Link } from "react-router";
import { useGetManagementListQuery } from "../api/managementApi.js";
import { CommentStatusAction } from "../../../features/comments/ui/CommentStatusAction.jsx";
import { ManagementList } from "./ManagementList.jsx";
import { ManagementDeleteAction } from "./ManagementDeleteAction.jsx";
import { StatusBadge } from "../../../shared/ui/status-badge/StatusBadge.jsx";

export const ManageComments = () => {
  const query = useGetManagementListQuery("comments");
  return (
    <section>
      <h1>Comments</h1>
      <p>
        Comment text belongs to its author. You can change visibility or remove
        a comment.
      </p>
      <ManagementList query={query} resource="comments">
        {(record) => (
          <article className="management-record" key={record.id}>
            <span className="management-field" data-label="ID" aria-label={`Comment ID ${record.id}`}>{record.id}</span>
            <p className="management-comment-excerpt" aria-label="Comment text">
              <Link to={`/comments/${record.id}`}>{record.content || "No comment text"}</Link>
            </p>
            <span className="management-field" data-label="Author" aria-label={`Author ${record.author?.login || record.author_id || "unknown"}`}>
              {record.author?.login || record.author_id || "Unknown author"}
            </span>
            <span className="management-field management-comment-status" data-label="Status" aria-label={`Status ${record.is_deleted ? "removed" : record.status || "unknown"}`}>
              <StatusBadge
                status={record.is_deleted ? "removed" : record.status}
              />
            </span>
            <div className="management-actions">
              {!record.is_deleted && (
                <>
                  <CommentStatusAction
                    comment={record}
                    postId={record.post_id}
                  />
                  <ManagementDeleteAction
                    resource="comments"
                    record={record}
                    label="comment"
                  />
                </>
              )}
            </div>
          </article>
        )}
      </ManagementList>
    </section>
  );
};
