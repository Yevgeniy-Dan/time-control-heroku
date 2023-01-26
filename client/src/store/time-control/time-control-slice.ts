import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import TimeRange from "../../models/time-range";

type InitialState = {
  ranges: TimeRange[];
  isReplaced: boolean;
};

const initialState: InitialState = {
  ranges: [],
  isReplaced: false,
};

const timeRangesSlice = createSlice({
  name: "timeControls",
  initialState: initialState,
  reducers: {
    replaceTimeRanges(state, action: PayloadAction<{ ranges: TimeRange[] }>) {
      state.ranges = action.payload.ranges;
      state.isReplaced = true;
    },

    addTimeRange(state, action: PayloadAction<{ range: TimeRange }>) {
      const updatedRanges = state.ranges;
      updatedRanges.push(action.payload.range);

      state.ranges = updatedRanges;
    },
    removeTimeRange(state, action: PayloadAction<{ item: TimeRange }>) {
      const id = action.payload.item._id;
      state.ranges = state.ranges.filter((item) => item._id !== id);
    },
  },
});

export const timeRangesActions = timeRangesSlice.actions;
export default timeRangesSlice;
