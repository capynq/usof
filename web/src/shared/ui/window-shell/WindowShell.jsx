import { useId } from "react";

export const WindowShell = ({
  as: Root = "section",
  bodyAs: Body = "div",
  title,
  titleIcon,
  titleClassName,
  titleId: providedTitleId,
  labelledBy,
  className,
  bodyClassName,
  bodyRole,
  ariaLive,
  role,
  children,
}) => {
  const generatedTitleId = useId();
  const titleId = providedTitleId || generatedTitleId;

  return (
    <Root
      className={`window ${className || ""}`.trim()}
      aria-live={ariaLive}
      aria-labelledby={labelledBy || titleId}
      role={role}
    >
      <div className="title-bar">
        <div className={`title-bar-text ${titleClassName || ""}`.trim()} id={titleId}>
          {titleIcon}
          {title}
        </div>
      </div>
      <Body className={`window-body ${bodyClassName || ""}`.trim()} role={bodyRole}>
        {children}
      </Body>
    </Root>
  );
};
