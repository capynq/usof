import { useMemo, useState } from "react";

export const useManagementCollection = (records = []) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const matches = useMemo(
    () =>
      records.filter((record) =>
        [
          record.id,
          record.login,
          record.full_name,
          record.email,
          record.title,
          record.description,
          record.content,
          record.status,
          record.author?.login,
          record.author?.full_name,
          record.is_deleted ? "removed" : "",
        ].some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(search.trim().toLowerCase()),
        ),
      ),
    [records, search],
  );
  const totalPages = Math.ceil(matches.length / 10);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));

  const changeSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  return {
    search,
    setSearch: changeSearch,
    page: currentPage,
    setPage,
    totalPages,
    matches: matches.slice((currentPage - 1) * 10, currentPage * 10),
    total: matches.length,
  };
};
