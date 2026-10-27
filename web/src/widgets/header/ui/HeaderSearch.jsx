import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { SearchIcon } from "../../../shared/ui/icons/index.js";
import styles from "./Header.module.css";

export const HeaderSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentSearch =
    location.pathname === "/"
      ? (new URLSearchParams(location.search).get("search") ?? "")
      : "";
  const [value, setValue] = useState(currentSearch);
  useEffect(() => {
    setValue(currentSearch);
  }, [currentSearch, location.pathname]);
  const submit = (event) => {
    event.preventDefault();
    const search = value.trim();
    if (location.pathname === "/") {
      const params = new URLSearchParams(location.search);
      if (search) params.set("search", search);
      else params.delete("search");
      params.delete("page");
      navigate(params.size ? `/?${params}` : "/");
      return;
    }

    navigate(search ? `/?${new URLSearchParams({ search })}` : "/");
  };
  return (
    <form className={styles.search} role="search" onSubmit={submit}>
      <label className="visually-hidden" htmlFor="header-search">
        Search questions
      </label>
      <input
        id="header-search"
        type="search"
        maxLength={100}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search questions"
      />
      <button type="submit" aria-label="Search questions">
        <SearchIcon />
      </button>
    </form>
  );
};
