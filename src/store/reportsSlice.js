import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from '../lib/helper/supabaseClient'

// Thunk to fetch reports from Supabase
export const fetchReports = createAsyncThunk(
  'reports/fetchReports',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .limit(100);

      if (error) throw error;

      // Map the data to match the report structure
      return data.map(report => ({
        id: report.id,
        created_at: report.created_at,
        mobility_mode: report.mobility_mode,
        type: report.type,
        details: report.details,
        description: report.description,
        email: report.email,
        marker_id: report.marker_id
      }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to add a new report to Supabase
export const addReport = createAsyncThunk(
  'reports/addReport',
  async ({ created_at, mobility_mode, type, details, description, email, marker_id }, { rejectWithValue }) => {
    try {
      console.log("Sending data to Supabase:", {
        created_at,
        mobility_mode,
        type,
        details,
        description,
        email,
        marker_id
      });

      const { data, error } = await supabase
        .from("reports")
        .insert({
          created_at,
          mobility_mode,
          type,
          details,
          description,
          email,
          marker_id
        })
        .select("*");

      if (error) throw error;

      console.log("Report added successfully:", data);

      return data[0];
    } catch (error) {
      console.error("Error adding report:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to delete a report from Supabase
export const deleteReport = createAsyncThunk(
  'reports/deleteReport',
  async (reportId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .delete()
        .eq('id', reportId);

      if (error) throw error;

      return reportId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const reportsSlice = createSlice({
  name: "reports",
  initialState: [],
  reducers: {
    setReports(state, action) {
      return action.payload;
    },
    addReportRealtime(state, action) {
      state.push(action.payload);
    },
    updateReportRealtime(state, action) {
      const index = state.findIndex(report => report.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteReportRealtime(state, action) {
      return state.filter(report => report.id !== action.payload.id);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        console.error("Failed to fetch reports: ", action.payload);
      })
      .addCase(addReport.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(addReport.rejected, (state, action) => {
        console.error("Failed to add report: ", action.payload);
      })
      .addCase(deleteReport.fulfilled, (state, action) => {
        return state.filter(report => report.id !== action.payload);
      })
      .addCase(deleteReport.rejected, (state, action) => {
        console.error("Failed to delete report: ", action.payload);
      });
  }
});

export const { setReports, addReportRealtime, updateReportRealtime, deleteReportRealtime } = reportsSlice.actions;
export default reportsSlice.reducer;
