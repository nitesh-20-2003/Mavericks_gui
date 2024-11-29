import React from "react";
import Wrapper from "../assets/Wrappers/Dashboard";
import { SmallSidebar, BigSidebar, Navbar, Loading } from "../Components";
import { Outlet, useNavigation, useNavigate } from "react-router-dom";
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
            {isPageLoading ? <Loading /> : <Outlet />}
          </div>
        </div>
      </main>
    </Wrapper>
  );
};

export default HomeLayout;
