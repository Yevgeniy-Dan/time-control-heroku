import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import TimeRange from "../../models/time-range";

type InitialState = {
  todayRanges: TimeRange[];
  weekRanges: TimeRange[];
  isReplaced: boolean;
};

const initialState: InitialState = {
  todayRanges: [],
  weekRanges: [],
  isReplaced: false,
};

const timeRangesSlice = createSlice({
  name: "timeControls",
  initialState: initialState,
  reducers: {
    replaceTimeRanges(
      state,
      action: PayloadAction<{
        todayRanges: TimeRange[];
        weekRanges: TimeRange[];
      }>
    ) {
      state.todayRanges = action.payload.todayRanges;
      state.weekRanges = action.payload.weekRanges;
      state.isReplaced = true;
    },

    addTimeRange(state, action: PayloadAction<{ range: TimeRange }>) {
      const updatedRanges = state.todayRanges;
      updatedRanges.push(action.payload.range);

      state.todayRanges = updatedRanges;
    },
    removeTimeRange(state, action: PayloadAction<{ item: TimeRange }>) {
      const id = action.payload.item._id;
      state.todayRanges = state.todayRanges.filter((item) => item._id !== id);
    },
  },
});

export const timeRangesActions = timeRangesSlice.actions;
export default timeRangesSlice;
