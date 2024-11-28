import { Outlet, useNavigation } from "react-router-dom";
import { BigSidebar, Navbar, SmallSidebar, Loading } from "../Components";
import ISLInfo from "../Components/HomeInfo";
import Footer from "../Components/Footer"; // Import the Footer component

const HomeLayout = () => {
  const navigation = useNavigation();
  const isPageLoading = navigation.state === "loading";

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen">
        {/* Main Layout with Sidebar and Content */}
        <div className="flex flex-1">
          {/* Sidebar */}
          <BigSidebar />
          <SmallSidebar />

          {/* Main Content Area */}
          <div className="flex-1 overflow-auto p-4"> {/* Added pt-20 to give space for the sticky navbar */}
            {isPageLoading ? (
              <Loading />
            ) : (
              <>
                {/* Routed Content */}
                <section className="align-element py-20">
                  <Outlet />
                </section>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default HomeLayout;
