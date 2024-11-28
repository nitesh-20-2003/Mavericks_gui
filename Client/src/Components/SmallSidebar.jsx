import { FaTimes } from "react-icons/fa";
import Wrapper from "../assets/Wrappers/SmallSidebar";
import NavLinks from "./Navlinks.jsx"
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "../features/SidebarSlice.js"; // Redux action

const SmallSidebar = () => {
  const dispatch = useDispatch();
  const showSidebar = useSelector((state) => state.sidebarState.showSidebar); // Get sidebar state from Redux

  return (
    <Wrapper>
      <div
        className={
          showSidebar ? "sidebar-container show-sidebar" : "sidebar-container"
        }
      >
        <div className="content">
          <button
            type="button"
            className="close-btn"
            onClick={() => dispatch(toggleSidebar())} // Toggle sidebar visibility
          >
            <FaTimes />
          </button>
          <header>
          </header>
          <NavLinks /> {/* Include NavLinks component */}
        </div>
      </div>
    </Wrapper>
  );
};

export default SmallSidebar;
