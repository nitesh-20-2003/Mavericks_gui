import { RouterProvider, createBrowserRouter } from "react-router-dom";
<<<<<<< HEAD:src/App.jsx
import { HomeLayout ,Error,Datasets,Stats,Landing,About,UnderConstruction,YourSpace,DashBoardLanding,DashBoardLayout ,Login ,Register} from "./pages";
const router = createBrowserRouter([
=======
import { HomeLayout ,Error, Datasets, Stats, Landing, About, UnderConstruction, ProfilePage} from "./pages";
import { VideosPage } from "./Components";

const userId = localStorage.getItem("userId");
const router=createBrowserRouter([
>>>>>>> origin/main:Client/src/App.jsx
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
<<<<<<< HEAD:src/App.jsx
      {
        path: "register",
        element: <Register />,
        
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "dashboard",
        element: <DashBoardLayout />,
        children: [
          {
            index: true,
            element: <DashBoardLanding />,
          },
          { path: "stats", element: <Stats /> },
          {
            path: "Datasets",
            element: <UnderConstruction />,
          },
          {
            path: "about",
            element: <UnderConstruction />,
          },
          {
            path: "your-space",
            element: <YourSpace />,
          },
        ],
      },
    ],
  },
]);
=======
     { path:"stats",
      element:<UnderConstruction />,
    },
    {
      path:"Datasets",
      element:<VideosPage />,
    },
    {
      path:"about",
      element:<UnderConstruction />
    },
    {
      path: `profile/${userId}`,  // 'userId' is dynamic and will be extracted
      element: <ProfilePage />,
    }
    ]
  }
])
>>>>>>> origin/main:Client/src/App.jsx
function App() {
  return <RouterProvider router={router} />;
}

export default App;
