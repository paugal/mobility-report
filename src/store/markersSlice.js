import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from '../lib/helper/supabaseClient';

// Thunk to fetch markers from Supabase
export const fetchMarkers = createAsyncThunk(
  'markers/fetchMarkers',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("markers")
        .select("*")
        .limit(100);

      if (error) throw error;

      return data.map(marker => ({
        id: marker.id, 
        latitude: marker.latitude,
        longitude:  marker.longitude,
        type: marker.type
      }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to add a new marker to Supabase and update the Redux store
export const addMarker = createAsyncThunk(
  'markers/addMarker',
  async ({ latitude, longitude, type }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("markers")
        .insert({
          latitude: latitude,
          longitude: longitude,
          type: 'Metro'
        })
        .select("*"); 

      if (error) throw error;

      // Return the newly inserted marker
      return {
        id: data[0].id,
        latitude: data[0].latitude,
        longitude : data[0].longitude,
        type: data[0].type
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteMarker = createAsyncThunk(
  'markers/deleteMarker',
  async (markerId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('markers')
        .delete()
        .eq('id', markerId); // Use the markerId parameter to specify which marker to delete

      if (error) throw error;

      // Return the deleted marker ID or relevant data if needed
      return markerId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const markersSlice = createSlice({
  name: "markers",
  initialState: [],
  reducers: {
    setMarkers(state, action) {
      return action.payload;
    },
    addMarkerRealtime(state, action) {
      state.push(action.payload);
    },
    updateMarkerRealtime(state, action) {
      const index = state.findIndex(marker => marker.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteMarkerRealtime(state, action) {
      return state.filter(marker => marker.id !== action.payload.id);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarkers.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(fetchMarkers.rejected, (state, action) => {
        console.error("Failed to fetch markers: ", action.payload);
      })
      .addCase(addMarker.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(addMarker.rejected, (state, action) => {
        console.error("Failed to add marker: ", action.payload);
      })
      .addCase(deleteMarker.fulfilled, (state, action) => {
        /* state.push(action.payload); */
        return state.filter(marker => marker.id !== action.payload);
      })
      .addCase(deleteMarker.rejected, (state, action) => {
        console.error("Failed to remove marker: ", action.payload);
      });
  }
});

export const { setMarkers, addMarkerRealtime, updateMarkerRealtime, deleteMarkerRealtime } = markersSlice.actions;
export default markersSlice.reducer;