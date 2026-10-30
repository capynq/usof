import { useState } from "react";
import { useNavigate } from "react-router";
import { getErrorMessage } from "../../../shared/api/index.js";
import { useCreatePostMutation, useUpdatePostMutation } from "../../../entities/post/index.js";
import { useGetCategoriesQuery } from "../../../entities/category/index.js";
import { EMPTY_POST_VALUES } from "./constants.js";
import { buildPostPayload, toggleCategorySelection } from "./postForm.js";

const getInitialValues = (post) => {
  if (!post) return EMPTY_POST_VALUES;

  return {
    title: post.title,
    content: post.content,
    categories: post.categories.map((category) => Number(category.id)),
    status: post.status,
  };
};

export const usePostFormController = ({ post, isAdmin, isOwner }) => {
  const navigate = useNavigate();
  const [values, setValues] = useState(() => getInitialValues(post));
  const [formError, setFormError] = useState(null);
  const {
    data: categories,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useGetCategoriesQuery();
  const [createPost, createState] = useCreatePostMutation();
  const [updatePost, updateState] = useUpdatePostMutation();
  const isEditing = Boolean(post);
  const isSaving = createState.isLoading || updateState.isLoading;

  const setField = (event) => {
    const { name, value } = event.currentTarget;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const toggleCategory = (categoryId) => {
    setValues((current) => ({
      ...current,
      categories: toggleCategorySelection(current.categories, categoryId),
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setFormError(null);

    if (!values.categories.length) {
      setFormError("Choose at least one category.");

      return;
    }

    try {
      if (isEditing) {
        await updatePost({
          postId: post.id,
          ...buildPostPayload(values, { isEditing, isAdmin, isOwner }),
        }).unwrap();
        navigate(`/posts/${post.id}`);

        return;
      }

      const createdPost = await createPost(
        buildPostPayload(values, { isEditing, isAdmin, isOwner }),
      ).unwrap();
      navigate(`/posts/${createdPost.id}`);
    } catch (error) {
      setFormError(getErrorMessage(error, "The question could not be saved."));
    }
  };

  return {
    values,
    formError,
    categories,
    categoriesError,
    categoriesLoading,
    isEditing,
    isSaving,
    setField,
    toggleCategory,
    submit,
    cancel: () => navigate(post ? `/posts/${post.id}` : "/"),
  };
};
