import React from 'react'
import { Outlet } from 'react-router-dom'
const HomeLayout = () => {
  return (
    <>
<<<<<<< HEAD:src/pages/HomeLayout.jsx
    <Outlet />
=======
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
                <section className="align-element">
                  <Outlet />
                </section>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
>>>>>>> origin/main:Client/src/pages/HomeLayout.jsx
    </>
  )
}

export default HomeLayout