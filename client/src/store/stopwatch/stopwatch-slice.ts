import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";

type InitialState = {
  startDate: string;
  time: number;
  isPaused: boolean;
  isActive: boolean;
};

const initialState: InitialState = {
  startDate: "",
  time: 0,
  isPaused: true,
  isActive: false,
};

const stopwatchSlice = createSlice({
  name: "stopwatch",
  initialState: initialState,
  reducers: {
    reset: () => initialState,
    run(state, action: PayloadAction<{ startDate: string; time: number }>) {
      state.startDate = action.payload.startDate;
      state.time = action.payload.time;
      state.isActive = true;
      state.isPaused = false;
    },
    setTime(state) {
      state.time = state.time + stopwatchInterval;
    },
    clear(state) {
      state.isActive = false;
      state.time = 0;
    },
  },
});

export const stopwatchActions = stopwatchSlice.actions;
export default stopwatchSlice;
export const stopwatchInterval = 10;
