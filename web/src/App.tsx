import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { SWRConfig } from "swr";
import Admin from "./pages/admin/Admin";
import Home from "./pages/home/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
]);

function App() {
  return (
    <SWRConfig>
      <RouterProvider router={router} />
    </SWRConfig>
  );
}

export default App;
