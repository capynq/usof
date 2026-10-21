import { NavLink } from "react-router";

export const NavigationLinks = ({
  ariaLabel,
  className,
  items,
  linkClassName,
  activeLinkClassName,
  iconClassName
}) => {
  return (
    <nav className={className} aria-label={ariaLabel}>
      {items.map(({ to, end, label, Icon }) => (
        <NavLink
          key={to}
          className={({ isActive }) => isActive
            ? `${linkClassName} ${activeLinkClassName}`
            : linkClassName}
          end={end}
          to={to}
        >
          {Icon && <Icon className={iconClassName} />}
          {label}
        </NavLink>
      ))}
    </nav>
  );
};
