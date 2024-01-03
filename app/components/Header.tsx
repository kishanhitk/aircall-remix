import { HeaderLink } from "./HeaderLink";

const Header = () => {
  return (
    <div className="flex max-w-2xl mx-auto border-b-2 border-gray-100 sticky">
      <HeaderLink href="/activities" title="Activities" />
      <HeaderLink href="/archived" title="Archived" />
    </div>
  );
};

export default Header;
