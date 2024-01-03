import React from "react";
import { HeaderLink } from "./HeaderLink";

const Header = () => {
  return (
    <div className="flex">
      <HeaderLink href="/activities" title="Activities" />
      <HeaderLink href="/archived" title="Archived" />
    </div>
  );
};

export default Header;
