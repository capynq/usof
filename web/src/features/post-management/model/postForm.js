export const buildPostPayload = (values, { isEditing, isAdmin }) => {
  if (!isEditing) {
    return {
      title: values.title,
      content: values.content,
      categories: values.categories,
    };
  }

  return isAdmin
    ? { categories: values.categories, status: values.status }
    : { title: values.title, content: values.content, categories: values.categories };
};

export const toggleCategorySelection = (selectedIds, categoryId) =>
  selectedIds.includes(categoryId)
    ? selectedIds.filter((id) => id !== categoryId)
    : [...selectedIds, categoryId];
