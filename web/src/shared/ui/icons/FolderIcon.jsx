export const FolderIcon = ({ className, ...props }) => (
  <svg
    className={className}
    viewBox="0 0 16 16"
    width="16"
    height="16"
    fill="none"
    aria-hidden="true"
    {...props}
  >
    <path
      d="M1.5 4.25h5l1.5 1.5h6.5v7.5h-13z"
      fill="currentColor"
      fillOpacity=".16"
      stroke="currentColor"
      strokeLinejoin="round"
    />
    <path d="M1.5 6h13" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);
