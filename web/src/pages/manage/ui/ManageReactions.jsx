import { useState } from "react";
import { ReactionListDialog } from "../../../features/reactions/ui/ReactionListDialog.jsx";
import { ReactionTargetPicker } from "./ReactionTargetPicker.jsx";

export const ManageReactions = () => {
  const [selected, setSelected] = useState(null);
  return (
    <section>
      <div className="management-intro">
        <h1>Reaction management</h1>
        <p>Find a question or comment to review and remove its reactions.</p>
      </div>
      <ReactionTargetPicker onSelect={setSelected} />
      {selected && (
        <ReactionListDialog
          open
          onClose={() => setSelected(null)}
          {...selected}
        />
      )}
    </section>
  );
};
