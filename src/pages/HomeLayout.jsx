import { Outlet,useNavigation } from "react-router-dom";
import {BigSidebar, Navbar, SmallSidebar,Loading} from '../Components'
 const HomeLayout = () => {
  const navigation=useNavigation();
  const isPageLoading=navigation.state==='loading';
  console.log(isPageLoading);
  return (
    <>
    <Navbar />
    <SmallSidebar/>
      <BigSidebar  />
      {isPageLoading ?(<Loading />)
      :(
          <section className="align-element py-20">
        <Outlet />
      </section>
      )}
      
    </>
  );
}
export default HomeLayout;