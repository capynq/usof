import { useState } from "react";
import { Link } from "react-router";
import { useGetManagementListQuery } from "../api/managementApi.js";
import { ManagementList } from "./ManagementList.jsx";
import { ManagementDeleteAction } from "./ManagementDeleteAction.jsx";
import { UserEditor } from "./UserEditor.jsx";

export const ManageUsers = () => {
  const query = useGetManagementListQuery("users");
  const [editing, setEditing] = useState(null);

  return (
    <section>
      <div className="management-heading-row">
        <h1>Members</h1>
        <button type="button" onClick={() => setEditing({})}>
          Create member
        </button>
      </div>
      <ManagementList query={query} resource="members">
        {(record) => (
          <article className="management-record" key={record.id}>
            <span
              className="management-field"
              data-label="ID"
              aria-label={`Member ID ${record.id}`}
            >
              {record.id}
            </span>
            <div className="management-identity">
              <h2>
                <Link to={`/users/${record.id}`}>{record.login || "Unknown member"}</Link>
              </h2>
              <span>{record.full_name || "Name not provided"}</span>
            </div>
            <span
              className="management-field"
              data-label="Email"
              aria-label={`Email ${record.email || "unavailable"}`}
            >
              {record.email || "Email unavailable"}
            </span>
            <span
              className="management-field management-user-meta"
              data-label="Role and rating"
              aria-label={`Role and rating: ${record.role || "unavailable"}, ${record.rating ?? "unavailable"}`}
            >
              {record.role || "Role unavailable"} · Rating {record.rating ?? "—"}
            </span>
            <div className="management-actions">
              <button
                type="button"
                aria-label={`Edit member ${record.id}`}
                onClick={() => setEditing(record)}
              >
                Edit
              </button>
              <ManagementDeleteAction resource="users" record={record} label="member" />
            </div>
          </article>
        )}
      </ManagementList>
      {editing && (
        <UserEditor
          key={editing.id ?? "new"}
          record={editing.id ? editing : null}
          onClose={() => setEditing(null)}
        />
      )}
    </section>
  );
};
