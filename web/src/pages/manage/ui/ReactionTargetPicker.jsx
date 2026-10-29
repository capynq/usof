import { LoadingIndicator, useMinimumLoading } from "../../../shared/ui/loading/index.js";
import { useId, useState } from "react";
import { useGetPostsQuery } from "../../../entities/post/index.js";
import { useGetManagementListQuery } from "../api/managementApi.js";
import { getErrorMessage } from "../../../shared/api/index.js";
import { Pagination } from "../../../shared/ui/pagination/Pagination.jsx";
import { SelectControl } from "../../../shared/ui/select-control/index.js";
import {
  filterReactionComments,
  getReactionTargetExcerpt,
  paginateReactionTargets,
} from "../model/reactionTargetPicker.js";
import styles from "./ReactionTargetPicker.module.css";

const authorName = (record) =>
  record.author?.full_name || record.author?.login || `Member ${record.author_id}`;

const availabilityLabel = (record, target) => {
  if (target === "comment" && record.is_deleted) return "Removed";

  return record.status === "inactive" ? "Inactive" : "";
};

export const ReactionTargetPicker = ({ onSelect }) => {
  const searchId = useId();
  const idFormId = useId();
  const [target, setTarget] = useState("post");
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [targetId, setTargetId] = useState("");
  const postsQuery = useGetPostsQuery(
    { search: submittedSearch, page, page_size: 5, summary: true },
    { skip: target !== "post" || !submittedSearch },
  );
  const commentsQuery = useGetManagementListQuery("comments", {
    skip: target !== "comment",
  });
  const comments = filterReactionComments(commentsQuery.data, submittedSearch);
  const commentPage = paginateReactionTargets(comments, page);
  const postRecords = postsQuery.data?.data ?? [];
  const results = target === "post" ? postRecords : commentPage.records;
  const totalPages =
    target === "post" ? (postsQuery.data?.meta?.total_pages ?? 1) : commentPage.totalPages;
  const isFetching = target === "post" ? postsQuery.isFetching : commentsQuery.isFetching;
  const error = target === "post" ? postsQuery.error : commentsQuery.error;
  const { visible: showInitialLoading, completing } = useMinimumLoading(
    isFetching && Boolean(submittedSearch),
    error,
  );
  const hasSearch = Boolean(submittedSearch);
  const total = target === "post" ? (postsQuery.data?.meta?.total ?? 0) : commentPage.total;

  const changeTarget = (value) => {
    setTarget(value);
    setSearch("");
    setSubmittedSearch("");
    setPage(1);
    setTargetId("");
  };

  const submitSearch = (event) => {
    event.preventDefault();
    setSubmittedSearch(search.trim());
    setPage(1);
  };

  const selectRecord = (record) =>
    onSelect({
      target,
      targetId: Number(record.id),
      postId: target === "comment" ? Number(record.post_id) : undefined,
      context:
        target === "post"
          ? { kind: "question", id: record.id, title: record.title, author: authorName(record) }
          : {
              kind: "comment",
              id: record.id,
              postId: record.post_id,
              excerpt: getReactionTargetExcerpt(record),
              author: authorName(record),
            },
    });

  const submitId = (event) => {
    event.preventDefault();
    onSelect({
      target,
      targetId: Number(targetId),
      context: { kind: target === "post" ? "question" : "comment", id: Number(targetId) },
    });
  };

  return (
    <div className={styles.picker}>
      <label className={styles.scopeLabel}>
        Content type
        <SelectControl value={target} onChange={(event) => changeTarget(event.target.value)}>
          <option value="post">Question</option>
          <option value="comment">Comment</option>
        </SelectControl>
      </label>
      <form className={styles.searchForm} onSubmit={submitSearch}>
        <label htmlFor={searchId}>Search {target === "post" ? "questions" : "comments"}</label>
        <div className={styles.searchRow}>
          <input
            id={searchId}
            type="search"
            maxLength={100}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={target === "post" ? "Title or question text" : "Comment, author, or ID"}
          />
          <button type="submit">Search</button>
        </div>
      </form>

      {(isFetching || showInitialLoading) && hasSearch && (
        <LoadingIndicator completing={completing}>
          Searching {target === "post" ? "questions" : "comments"}…
        </LoadingIndicator>
      )}
      {error && hasSearch && (
        <p role="alert">{getErrorMessage(error, "Content could not be loaded.")}</p>
      )}
      {hasSearch && !isFetching && !showInitialLoading && !error && results.length === 0 && (
        <p className={styles.empty}>
          No {target === "post" ? "questions" : "comments"} match this search.
        </p>
      )}
      {hasSearch && !isFetching && !showInitialLoading && !error && results.length > 0 && (
        <>
          <p className={styles.resultCount} aria-live="polite">
            {total} matching {target === "post" ? "questions" : "comments"}
          </p>
          <ul className={styles.results}>
            {results.map((record) => (
              <li className={styles.result} key={record.id}>
                <div className={styles.resultText}>
                  <h2>
                    {target === "post"
                      ? record.title
                      : `Comment ${record.id} on question ${record.post_id}`}
                  </h2>
                  {target === "comment" && <p>{getReactionTargetExcerpt(record)}</p>}
                  <p className={styles.byline}>
                    By {authorName(record)} · ID {record.id}
                    {availabilityLabel(record, target)
                      ? ` · ${availabilityLabel(record, target)}`
                      : ""}
                  </p>
                </div>
                <button type="button" onClick={() => selectRecord(record)}>
                  View reactions
                </button>
              </li>
            ))}
          </ul>
          <Pagination
            page={target === "post" ? page : commentPage.page}
            totalPages={totalPages}
            onPageChange={setPage}
            label="Reaction target pages"
          />
        </>
      )}

      <details className={styles.idDisclosure}>
        <summary>Find by ID</summary>
        <form className={styles.idForm} onSubmit={submitId}>
          <label htmlFor={idFormId}>{target === "post" ? "Question ID" : "Comment ID"}</label>
          <input
            id={idFormId}
            type="number"
            min={1}
            max={2147483647}
            step={1}
            required
            value={targetId}
            onChange={(event) => setTargetId(event.target.value)}
          />
          <button type="submit">Open reactions</button>
        </form>
      </details>
    </div>
  );
};
