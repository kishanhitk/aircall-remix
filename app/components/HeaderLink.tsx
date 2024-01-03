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
      prefetch="none"
      to={href}
      className={({ isActive }) =>
        clsx(
          isActive
            ? "bg-white text-black border-black border-2"
            : "bg-gray-100 text-black border-gray-100 border-2",
          "p-3 m-5 block "
        )
      }
    >
      {title}
    </NavLink>
  );
};
