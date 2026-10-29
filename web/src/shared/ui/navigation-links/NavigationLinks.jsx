import { NavLink } from "react-router";

export const NavigationLinks = ({
  ariaLabel,
  className,
  items,
  linkClassName,
  activeLinkClassName,
  iconClassName,
}) => {
  const navigationClassName = [className].filter(Boolean).join(" ");

  return (
    <nav className={navigationClassName} aria-label={ariaLabel}>
      {items.map(({ to, end, label, Icon }) => (
        <NavLink
          key={to}
          className={({ isActive }) =>
            [linkClassName, isActive && activeLinkClassName].filter(Boolean).join(" ")
          }
          end={end}
          to={to}
        >
          {Icon && <Icon className={[iconClassName].filter(Boolean).join(" ")} />}
          {label}
        </NavLink>
      ))}
    </nav>
  );
};
