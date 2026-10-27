import { FormCompanion } from "../../../shared/ui/mascot/FormCompanion.jsx";
import { AdminPostControls } from "./AdminPostControls.jsx";
import { CategoryPicker } from "./CategoryPicker.jsx";
import { PostFields } from "./PostFields.jsx";
import { PostFormActions } from "./PostFormActions.jsx";
import { usePostFormController } from "../model/usePostFormController.js";
import styles from "./PostForm.module.css";

export const PostForm = ({ post, isAdmin = false }) => {
  const form = usePostFormController({ post, isAdmin });

  return (
    <form className={styles.form} onSubmit={form.submit}>
      <FormCompanion context={isAdmin ? "manage" : "writing"} />
      {isAdmin && form.isEditing && (
        <AdminPostControls
          post={post}
          status={form.values.status}
          onChange={form.setField}
        />
      )}
      {!isAdmin && <PostFields values={form.values} onChange={form.setField} />}
      <CategoryPicker
        categories={form.categories}
        error={form.categoriesError}
        isLoading={form.categoriesLoading}
        selectedIds={form.values.categories}
        onToggle={form.toggleCategory}
      />
      {form.formError && (
        <p className={styles.error} role="alert">
          {form.formError}
        </p>
      )}
      <PostFormActions
        isEditing={form.isEditing}
        isSaving={form.isSaving}
        isDisabled={form.categoriesLoading || Boolean(form.categoriesError)}
        onCancel={form.cancel}
      />
    </form>
  );
};
