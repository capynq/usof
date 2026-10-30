export const buildPostPayload = (values, { isEditing, isAdmin, isOwner }) => {
  if (!isEditing) {
    return {
      title: values.title,
      content: values.content,
      categories: values.categories,
    };
  }

  return {
    categories: values.categories,
    ...(isAdmin ? { status: values.status } : {}),
    ...(isOwner ? { title: values.title, content: values.content } : {}),
  };
};

export const toggleCategorySelection = (selectedIds, categoryId) =>
  selectedIds.includes(categoryId)
    ? selectedIds.filter((id) => id !== categoryId)
    : [...selectedIds, categoryId];
