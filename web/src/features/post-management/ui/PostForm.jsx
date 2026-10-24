import { useState } from "react";
import { useNavigate } from "react-router";
import { getErrorMessage } from "../../../shared/api/index.js";
import {
  useCreatePostMutation,
  useUpdatePostMutation,
} from "../../../entities/post/index.js";
import { useGetCategoriesQuery } from "../../../entities/category/index.js";
import { EMPTY_POST_VALUES } from "../model/constants.js";
import { buildPostPayload, toggleCategorySelection } from "../model/postForm.js";
import { AdminPostControls } from "./AdminPostControls.jsx";
import { CategoryPicker } from "./CategoryPicker.jsx";
import { PostFields } from "./PostFields.jsx";
import styles from "./PostForm.module.css";

const getInitialValues = (post) => {
  if (!post) {
    return EMPTY_POST_VALUES;
  }

  return {
    title: post.title,
    content: post.content,
    categories: post.categories.map((category) => Number(category.id)),
    status: post.status,
  };
};

export const PostForm = ({ post, isAdmin = false }) => {
  const navigate = useNavigate();
  const [values, setValues] = useState(() => getInitialValues(post));
  const [formError, setFormError] = useState(null);
  const { data: categories, error: categoriesError, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const [createPost, createState] = useCreatePostMutation();
  const [updatePost, updateState] = useUpdatePostMutation();
  const isEditing = Boolean(post);
  const isSaving = createState.isLoading || updateState.isLoading;

  const setField = (event) => {
    const { name, value } = event.currentTarget;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const toggleCategory = (categoryId) => setValues((current) => ({
    ...current,
    categories: toggleCategorySelection(current.categories, categoryId),
  }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);
    if (!values.categories.length) {
      setFormError("Choose at least one category.");
      return;
    }

    try {
      if (isEditing) {
        const body = buildPostPayload(values, { isEditing, isAdmin });
        await updatePost({ postId: post.id, ...body }).unwrap();
        navigate(`/posts/${post.id}`);
        return;
      }

      const createdPost = await createPost(buildPostPayload(values, { isEditing, isAdmin })).unwrap();
      navigate(`/posts/${createdPost.id}`);
    } catch (error) {
      setFormError(getErrorMessage(error, "The question could not be saved."));
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {isAdmin && isEditing && <AdminPostControls post={post} status={values.status} onChange={setField} />}
      {!isAdmin && <PostFields values={values} onChange={setField} />}
      <CategoryPicker
        categories={categories}
        error={categoriesError}
        isLoading={categoriesLoading}
        selectedIds={values.categories}
        onToggle={toggleCategory}
      />
      {formError && <p className={styles.error} role="alert">{formError}</p>}
      <div className={styles.actions}>
        <button className={`button ${styles.save}`} type="submit" disabled={isSaving || categoriesLoading || Boolean(categoriesError)}>
          {isSaving ? "Saving…" : isEditing ? "Save changes" : "Publish question"}
        </button>
        <button className="button" type="button" disabled={isSaving} onClick={() => navigate(-1)}>
          Cancel
        </button>
      </div>
    </form>
  );
};
