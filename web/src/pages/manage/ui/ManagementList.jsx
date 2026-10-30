import { LoadingIndicator, useMinimumLoading } from "../../../shared/ui/loading/index.js";
import { useId } from "react";
import { useManagementCollection } from "../model/useManagementCollection.js";
import { Pagination } from "../../../shared/ui/pagination/Pagination.jsx";
import { getErrorMessage } from "../../../shared/api/index.js";

const searchScopes = {
  members: "ID, login, name, and email",
  categories: "ID, title, and description",
  comments: "ID, comment text, author, and status",
};

const columnLabels = {
  members: ["ID", "Member", "Email", "Role and rating", "Actions"],
  categories: ["ID", "Category", "Description", "Actions"],
  comments: ["ID", "Comment", "Author", "Status", "Actions"],
};

export const ManagementList = ({ query, resource, children }) => {
  const collection = useManagementCollection(query.data);
  const { visible: showInitialLoading, completing } = useMinimumLoading(
    query.isFetching,
    query.error,
  );
  const searchId = useId();
  const records = query.data ?? [];

  return (
    <div className="management-list" data-resource={resource}>
      <div className="management-toolbar">
        <label htmlFor={searchId}>
          <span>Search {resource}</span>
          <input
            id={searchId}
            type="search"
            maxLength={100}
            aria-describedby={`${searchId}-scope`}
            value={collection.search}
            onChange={(event) => collection.setSearch(event.target.value)}
          />
          <span className="management-search-hint" id={`${searchId}-scope`}>
            Searches {searchScopes[resource] ?? "ID and text"}.
          </span>
        </label>
        {!query.error && (
          <p className="management-count" aria-live="polite">
            {collection.total} of {records.length} {resource}
          </p>
        )}
      </div>
      {(query.isFetching || showInitialLoading) && (
        <LoadingIndicator completing={completing} expanded>Opening records…</LoadingIndicator>
      )}
      {query.error && (
        <p role="alert">{getErrorMessage(query.error, "Records could not be loaded.")}</p>
      )}
      {!query.isFetching && !showInitialLoading && !query.error && records.length === 0 && (
        <p className="management-empty">No {resource} yet.</p>
      )}
      {!query.isFetching &&
        !showInitialLoading &&
        !query.error &&
        records.length > 0 &&
        collection.total === 0 && (
          <p className="management-empty">No {resource} match this search.</p>
        )}
      {collection.total > 0 && (
        <div className="management-columns" aria-hidden="true">
          {(columnLabels[resource] ?? ["ID", "Record", "Actions"]).map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      )}
      {!showInitialLoading && !query.error && collection.matches.map((record) => children(record))}
      <Pagination
        page={collection.page}
        totalPages={collection.totalPages}
        onPageChange={collection.setPage}
        label="Management pages"
      />
    </div>
  );
};
