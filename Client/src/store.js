import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./features/SidebarSlice";

export const store = configureStore({
  reducer: {
    sidebarState: sidebarReducer,
  },
});
