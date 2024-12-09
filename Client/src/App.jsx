import React from 'react';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
// elements
import {
  HomeLayout,
  Error,
  Datasets,
  Stats,
  Landing,
  About,
  UnderConstruction,
  YourSpace,
  DashBoardLanding,
  DashBoardLayout,
  Login,
  Register,
  Dictionary,
  Words,
  DictionaryLanding,
  Characters,
  Nmf,
  Profile,
  Prediction
} from "./pages";
// actions
import { action as RegisterAction } from './pages/Register';
import { action as LoginAction } from "./pages/Login";
import { VideosPage, UploadVideo, CoursePage, CommunityFeed } from "./Components";

// react-alert setup
import { Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import { positions } from 'react-alert';

const options = {
  timeout: 5000,
  position: positions.TOP_CENTER,
};

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
            path:"profile",
            element:<Profile />
          },
          {
            path:"Prediction",
            element:<Prediction />,
          },
          {
            path: "Dictionary",
            element: <Dictionary />,
            children: [
              {
                index: true,
                element: <DictionaryLanding />,
              },
              {
                path: "Profile",
                element: <Profile />,
              },
              {
                path: "Words",
                element: <Words />,
              },
              {
                path: "Characters",
                element: <Characters />,
              },
              {
                path: "Nmf",
                element: <Nmf />,
              },
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
            path: "courses",
            element: <CoursePage />,
          },
          {
            path: "discussions",
            element: <CommunityFeed />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <AlertProvider template={AlertTemplate} {...options}>
      <RouterProvider router={router} />
    </AlertProvider>
  );
}

export default App;
