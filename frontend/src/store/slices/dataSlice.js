import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bookings: [],
  totalBookings: 0,
  loading: false,
  error: null,
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    fetchDataStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBookingsSuccess: (state, action) => {
      state.loading = false;
      state.bookings = action.payload.data;
      state.totalBookings = action.payload.total || action.payload.data.length;
    },
    fetchDataFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearData: (state) => {
      state.bookings = [];
      state.totalBookings = 0;
    }
  },
});

export const { fetchDataStart, fetchBookingsSuccess, fetchDataFailure, clearData } = dataSlice.actions;
export default dataSlice.reducer;
