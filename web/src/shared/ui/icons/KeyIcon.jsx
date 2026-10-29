export const KeyIcon = ({ className }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      width="16"
      height="16"
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
    >
      <g transform="translate(0 4)">
        <path
          fill="#f2c94c"
          d="M5 1a4 4 0 1 0 3.8 5.2H10v2h2V6h2V4H8.8A4 4 0 0 0 5 1Zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z"
        />
        <path fill="#8c6414" d="M10 6v2h2V6h2V4h-4Z" />
      </g>
    </svg>
  );
};
