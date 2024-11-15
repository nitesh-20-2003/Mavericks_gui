import { Outlet } from "react-router-dom";
import {BigSidebar, Navbar, SmallSidebar} from '../Components'
 const HomeLayout = () => {
  return (
    <>
    <Navbar />
    <SmallSidebar/>
      <BigSidebar  />
      <section>
        <Outlet />
      </section>
    </>
  );
}
export default HomeLayout;