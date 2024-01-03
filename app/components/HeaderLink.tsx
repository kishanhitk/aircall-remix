import { NavLink } from "@remix-run/react";
import clsx from "clsx";

export interface HeaderLinkProps {
  href: string;
  title: string;
}
export const HeaderLink = ({ href, title }: HeaderLinkProps) => {
  return (
    <NavLink
      unstable_viewTransition
      prefetch="intent"
      to={href}
      className={({ isActive }) =>
        clsx(
          isActive
            ? " border-black border-b-2 text-gray-900 font-medium"
            : "text-gray-800",
          "p-3 mx-2 block"
        )
      }
    >
      {title}
    </NavLink>
  );
};
