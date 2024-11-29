import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { HomeLayout ,Error, Datasets, Stats, Landing, About, UnderConstruction, ProfilePage} from "./pages";
import { VideosPage } from "./Components";

const userId = localStorage.getItem("userId");
const router=createBrowserRouter([
  {
    path:'/',
    element:<HomeLayout />,
    errorElement:<Error />,
    children:[
      {
        index:true,
        element:<Landing />
      },
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
function App() {
  return <RouterProvider router={router} />;
}

export default App;
