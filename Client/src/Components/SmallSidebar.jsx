import { FaTimes } from "react-icons/fa";
import Wrapper from "../assets/Wrappers/SmallSidebar.js";
import NavLinks from "./Navlinks.jsx"
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "../features/SidebarSlice.js"; 
import Logo from './Logo.jsx';
const SmallSidebar = () => {
  const dispatch = useDispatch();
  const showSidebar = useSelector((state) => state.sidebarState.showSidebar); 

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
            // onClick={() => dispatch(toggleSidebar())}
          >
            <FaTimes />
          </button>
          <header>
              <Logo />
          </header>
          <NavLinks />
        </div>
      </div>
    </Wrapper>
  );
};

export default SmallSidebar;
