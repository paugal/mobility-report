import { createSlice } from "@reduxjs/toolkit";

const markersSlice = createSlice({
  name: "markers",
  initialState: [
    { geocode: [41.3850, 2.1710], type: "Bicycle" },
    { geocode: [41.3870, 2.1720], type: "Train" },
    { geocode: [41.3860, 2.1730], type: "Metro" }
  ],
  reducers: {
    setMarkers(state, action) {
      return action.payload;
    }
  }
});

export const { setMarkers } = markersSlice.actions;
export default markersSlice.reducer;
