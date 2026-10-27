const outerStar =
  "M10 1h4v2h1v2h1v2h1v2h3V8h2v1h2v3h-2v1h-2v1h-2v1h-2v2h1v2h1v2h1v2h-2v-1h-2v-2h-2v-2h-2v2H8v2H6v1H4v-2h1v-2h1v-2h1v-2H6v-1H4v-1H2v-1H0V9h2V8h2v1h3V7h1V5h1V3h1V1Z";

const innerStar =
  "M10 4h4v2h2v2h4v2h-3v2h-2v2h-2v2h1v3h-2v-2h-2v-2h-2v2H8v2H6v-3h1v-2H5v-2H3v-2H1v-2h4V8h2V6h3Z";

export const StarIcon = ({ filled = false, ...props }) => (
  <svg
    shapeRendering="crispEdges"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    aria-hidden="true"
    {...props}
  >
    <path
      d={filled ? outerStar : `${outerStar} ${innerStar}`}
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);
