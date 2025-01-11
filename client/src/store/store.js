import { configureStore } from "@reduxjs/toolkit";
import markersReducer from "./markersSlice";
import reportsReducer from "./reportsSlice";

const store = configureStore({
  reducer: {
    markers: markersReducer,
    reports: reportsReducer,
  },
});

export default store;
