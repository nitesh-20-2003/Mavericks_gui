import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { HomeLayout ,Error,Datasets,Stats,Landing,About,UnderConstruction,YourSpace,DashBoardLanding,DashBoardLayout ,Login ,Register} from "./pages";
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
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
function App() {
  return <RouterProvider router={router} />;
}

export default App;
