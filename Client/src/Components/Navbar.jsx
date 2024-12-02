import Wrapper from "../assets/Wrappers/Navbar";
import { FaAlignLeft } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "../features/SidebarSlice"; 
import Logo from './Logo';
import Logout from "./Logout";
const Navbar = () => {
  const isSidebarBig = useSelector((state) => state.sidebarState.showSidebar); 
  const dispatch = useDispatch();

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <Wrapper>
      <div className="nav-center">
        <button
          type="button"
          className="toggle-btn"
          onClick={handleToggleSidebar}
        >
          <FaAlignLeft />
        </button>
        <div>
          <Logo />
          <div className="">
            <label className="input input-bordered   hidden md:flex md:items-center md:gap-2 md:w-[60vw] md:max-w-[1120px] md:mx-auto">
              <input type="text" className="grow input-ghost" placeholder="Search" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
          </div>

          <h4 className="logo-text"></h4>
        </div>
        <div className="btn-container">
      <Logout />
        </div>
      </div>
    </Wrapper>
  );
};

export default Navbar;
