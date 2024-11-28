import Wrapper from "../assets/Wrappers/Navbar";
import { FaAlignLeft } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "../features/SidebarSlice"; 

const Navbar = () => {
  // Get the sidebar state from Redux store
  const isSidebarBig = useSelector((state) => state.sidebarState.showSidebar); 
  const dispatch = useDispatch();

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <Wrapper className="sticky top-0 z-50"> {/* Sticky navbar */}
      <div className="nav-center">
        <button
          type="button"
          className="toggle-btn"
          onClick={handleToggleSidebar}
        >
          <FaAlignLeft />
        </button>
        <div>
          <h4 className="logo-text">search bar</h4>
        </div>
        <div className="btn-container"></div>
      </div>
    </Wrapper>
  );
};

export default Navbar;
