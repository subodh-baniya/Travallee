import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";

import router from "./Routes/Route";
import { Authprovider } from "./Contexts/Authprovider";

ReactDOM.createRoot(document.getElementById("root")).render(
    <Authprovider>
      <RouterProvider router={router} />
    </Authprovider>
);
