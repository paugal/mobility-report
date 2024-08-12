import { configureStore } from "@reduxjs/toolkit";
import markersReducer from "./markersSlice";

const store = configureStore({
    reducer: {
        markers: markersReducer
    }
})

export default store;