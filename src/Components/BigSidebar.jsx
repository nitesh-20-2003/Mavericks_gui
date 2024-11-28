import Wrapper from "../assets/Wrappers/BigSidebar.js";
import NavLinks from "./Navlinks.jsx";
import { useSelector } from "react-redux"; // Import Redux hook

const BigSidebar = () => {
  const showSidebar = useSelector((state) => state.sidebarState.showSidebar); 
  // console.log(showSidebar)
  return (
    <Wrapper>
      <div
        className={
          showSidebar ? "sidebar-container show-sidebar" : "sidebar-container"
        }
      >
        <div className="content">
          <header>
          </header>
          <NavLinks isBigSidebar />
        </div>
      </div>
    </Wrapper>
  );
};

export default BigSidebar;
