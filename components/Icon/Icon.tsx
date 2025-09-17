import type { SVGProps } from "react";

export type IconId =
  | "profile_icon"
  | "diary_icon"
  | "chair_icon"
  | "close_icon"
  | "journey_icon"
  | "delete_icon"
  | "edit_icon"
  | "fitness_icon"
  | "tableware_icon"
  | "google_icon"
  | "down_icon"
  | "up_icon"
  | "logout_icon"
  | "burger_icon"
  | "myDay_icon";

type Props = {
  id: IconId;
  size?: number;
  className?: string;
  title?: string;
} & Omit<SVGProps<SVGSVGElement>, "width" | "height">;

export default function Icon({
  id,
  size = 24,
  className,
  title,
  ...rest
}: Props) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : "presentation"}
      fill="currentColor"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      <use href={`#${id}`} />
    </svg>
  );
}
