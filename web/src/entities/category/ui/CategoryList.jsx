export const CategoryList = ({ categories, className, label = "Categories" }) => {
  if (!categories?.length) {
    return null;
  }

  return (
    <ul className={className} aria-label={label}>
      {categories.map((category) => (
        <li key={category.id}>{category.title}</li>
      ))}
    </ul>
  );
};
