import { useState } from "react";
import { Link } from "react-router";
import { useGetManagementListQuery } from "../api/managementApi.js";
import { ManagementList } from "./ManagementList.jsx";
import { ManagementDeleteAction } from "./ManagementDeleteAction.jsx";
import { CategoryEditor } from "./CategoryEditor.jsx";

export const ManageCategories = () => {
  const query = useGetManagementListQuery("categories");
  const [editing, setEditing] = useState(null);
  return (
    <section>
      <div className="management-heading-row">
        <h1>Categories</h1>
        <button type="button" onClick={() => setEditing({})}>
          Create category
        </button>
      </div>
      <ManagementList query={query} resource="categories">
        {(record) => (
          <article className="management-record" key={record.id}>
            <span className="management-field" data-label="ID" aria-label={`Category ID ${record.id}`}>{record.id}</span>
            <h2><Link to={`/categories/${record.id}`}>{record.title || "Untitled category"}</Link></h2>
            <p className="management-description" aria-label={`Description: ${record.description || "No description yet."}`}>{record.description || "No description yet."}</p>
            <div className="management-actions">
              <button type="button" aria-label={`Edit category ${record.id}`} onClick={() => setEditing(record)}>Edit</button>
              <ManagementDeleteAction resource="categories" record={record} label="category" />
            </div>
          </article>
        )}
      </ManagementList>
      {editing && (
        <CategoryEditor
          key={editing.id ?? "new"}
          record={editing.id ? editing : null}
          onClose={() => setEditing(null)}
        />
      )}
    </section>
  );
};
