import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { HomeLayout ,Error,Datasets,Stats,Landing,About,UnderConstruction,YourSpace} from "./pages";
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
      element:<Stats />,
    },
    {
      path:"Datasets",
      element:<UnderConstruction />,
    },
 {
  path:"about",
  element:<UnderConstruction />
 },
 {
  path:"your-space",
  element:<YourSpace/>,
 }

    ]
  }
])
function App() {
  return <RouterProvider router={router} />;
}

export default App;
