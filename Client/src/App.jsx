import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { HomeLayout ,Error,Datasets,Stats,Landing,About,UnderConstruction} from "./pages";
import { VideosPage } from "./Components";
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
 }
    ]
  }
])
function App() {
  return <RouterProvider router={router} />;
}

export default App;
