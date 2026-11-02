import { useId } from "react";
import { LoadingIndicator, useMinimumLoading } from "../../../shared/ui/loading/index.js";
import { useManagementCollection } from "../model/useManagementCollection.js";
import { Pagination } from "../../../shared/ui/pagination/Pagination.jsx";
import { getErrorMessage } from "../../../shared/api/index.js";
import { RefreshControl } from "../../../shared/ui/refresh-control/index.js";
import { useStagedCollection } from "../../../shared/lib/useStagedCollection.js";
import { MANAGEMENT_SEARCH_MAX_LENGTH } from "../model/constants.js";

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

const fallbackColumnLabels = ["ID", "Record", "Actions"];

const noRecords = [];

export const ManagementList = ({ query, resource, children }) => {
  const { visible: showInitialLoading, completing } = useMinimumLoading(
    query.isLoading,
    query.error,
  );
  const searchId = useId();
  const staged = useStagedCollection(query.currentData, resource);
  const visibleRecords = staged.data ?? noRecords;
  const collection = useManagementCollection(visibleRecords);
  const onRefresh = staged.hasPending ? staged.applyPending : query.refetch;
  const hasRecords = visibleRecords.length > 0;
  const idle = !query.isFetching && !showInitialLoading && !query.error;

  return (
    <div className="management-list" data-resource={resource}>
      <div className="management-toolbar">
        <label htmlFor={searchId}>
          <span>Search {resource}</span>
          <input
            id={searchId}
            type="search"
            maxLength={MANAGEMENT_SEARCH_MAX_LENGTH}
            aria-describedby={`${searchId}-scope`}
            value={collection.search}
            onChange={(event) => collection.setSearch(event.target.value)}
          />
          <span className="management-search-hint" id={`${searchId}-scope`}>
            Searches {searchScopes[resource] ?? "ID and text"}.
          </span>
        </label>
        <div className="management-toolbar-status">
          <p className="management-count" aria-live="polite">
            {collection.total} of {visibleRecords.length} {resource}
          </p>
          <RefreshControl
            onClick={onRefresh}
            isFetching={query.isFetching}
            pendingCount={staged.pendingCount}
            error={query.error && hasRecords ? query.error : null}
          />
        </div>
      </div>
      {!hasRecords && (query.isFetching || showInitialLoading) && (
        <LoadingIndicator completing={completing} expanded>Opening records…</LoadingIndicator>
      )}
      {query.error && !hasRecords && (
        <p role="alert">{getErrorMessage(query.error, "Records could not be loaded.")}</p>
      )}
      {idle && !hasRecords && <p className="management-empty">No {resource} yet.</p>}
      {idle && hasRecords && collection.total === 0 && (
        <p className="management-empty">No {resource} match this search.</p>
      )}
      {hasRecords && (
        <div className="management-columns" aria-hidden="true">
          {(columnLabels[resource] ?? fallbackColumnLabels).map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      )}
      {!showInitialLoading && collection.matches.map((record) => children(record))}
      <Pagination
        page={collection.page}
        totalPages={collection.totalPages}
        onPageChange={collection.setPage}
        label="Management pages"
      />
    </div>
  );
};
