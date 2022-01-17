/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  port: {},
};

export const communicateSlice = createSlice({
  name: 'communicate',
  initialState,
  reducers: {

    setPort: (state, action) => {
      state.port = action.payload;
    },

  },
});

export const {
  setPort,
} = communicateSlice.actions;

export default communicateSlice.reducer;
