import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./app/routes/MainRoutes";

export default function App() {
  const router = createBrowserRouter(routes);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}
