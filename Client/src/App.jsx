import { RouterProvider, createBrowserRouter } from "react-router-dom";
// elements
import { HomeLayout ,Error,Datasets,Stats,Landing,About,UnderConstruction,YourSpace,DashBoardLanding,DashBoardLayout ,Login ,Register,Dictionary,Words,DictionaryLanding} from "./pages";
// actions
import {action as RegisterAction} from './pages/Register'
import { action as LoginAction } from "./pages/Login";
import { VideosPage, UploadVideo } from "./Components";

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
        action: RegisterAction,
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
        action: LoginAction,
      },
      {
        path: "dashboard",
        element: <DashBoardLayout />,
        children: [
          {
            index: true,
            element: <DashBoardLanding />,
          },
          {
            path: "Dictionary",
            element: <Dictionary />,
            children: [
              {
                index: true,
                element:<DictionaryLanding />,
              },
              {
                path:"Words",
                element:<Words />,
              }
            ],
          },
          { path: "stats", element: <Stats /> },
          {
            path: "Datasets",
            element: <VideosPage />,
          },
          {
            path: "upload",
            element: <UploadVideo />,
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
