import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { HomeLayout ,Error,Datasets,Stats,Landing,About} from "./pages";
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
      element:<Datasets />,
    },
 {
  path:"about",
  element:<About />
 }
    ]
  }
])
function App() {
  return <RouterProvider router={router} />;
}

export default App;
