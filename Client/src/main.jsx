import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { store } from "./store.js";
import App from "./App.jsx";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
fetch("/api/test")
  .then((res) => res.json())
  .then((data) => console.log(data));
createRoot(document.getElementById("root")).render(
    <Provider store={store}>
      <App />
      <ToastContainer position="top-center" />
    </Provider>
  
);
