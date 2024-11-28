import { Outlet, useNavigation } from "react-router-dom";
import { BigSidebar, Navbar, SmallSidebar, Loading } from "../Components";
import ISLInfo from "../Components/HomeInfo";
import Footer from "../Components/Footer"; // Import the Footer component
import Wrapper from "../assets/Wrappers/Dashboard";

const HomeLayout = () => {
  const navigation = useNavigation();
  const isPageLoading = navigation.state === "loading";

  return (
    <Wrapper>
      <main className="dashboard">
        <SmallSidebar />
        <BigSidebar />
        <div>
          <Navbar />
          <div className="dashboard-page">
            {isPageLoading ? (
              <Loading />
            ) : (
              <>
                <Outlet />
              </>
            )}
          </div>
        </div>
      </main>
    </Wrapper>
  );
};

export default HomeLayout;
