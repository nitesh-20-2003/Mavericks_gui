import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../features/SidebarSlice";
import links from "../utils/links";
import { NavLink } from "react-router-dom";

const NavLinks = ({ isBigSidebar }) => {
  const dispatch = useDispatch();

  const handleSidebarToggle = () => {
    console.log("Toggling sidebar...");
    dispatch(toggleSidebar());
  };

  return (
    <div className="nav-links">
      {links.map((link) => {
        const { text, path, icon } = link;
        return (
          <NavLink
            to={path}
            key={text}
            className="nav-link"
            onClick={isBigSidebar ? null : handleSidebarToggle}
            end
          >
            <span className="icon">{icon}</span>
            {text}
          </NavLink>
        );
      })}
    </div>
  );
};

export default NavLinks;
