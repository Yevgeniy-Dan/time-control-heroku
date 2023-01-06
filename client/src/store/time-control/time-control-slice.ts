import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import TimeRange from "../../models/time-range";

type InitialState = {
  ranges: TimeRange[];
};

const initialState: InitialState = {
  ranges: [],
};

const timeRangesSlice = createSlice({
  name: "timeControls",
  initialState: initialState,
  reducers: {
    replaceTimeRanges(state, action: PayloadAction<{ ranges: TimeRange[] }>) {
      state.ranges = action.payload.ranges;
    },
    addTimeRange(state, action: PayloadAction<{ range: TimeRange }>) {
      const updatedRanges = state.ranges;
      updatedRanges.push(action.payload.range);

      state.ranges = updatedRanges;
    },
  },
});

export const timeRangesActions = timeRangesSlice.actions;
export default timeRangesSlice;
