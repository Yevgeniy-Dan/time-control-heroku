import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import TimeRange from "../../models/time-range";
import timeRangeService from "./time-control-service";

type InitialState = {
  activeRange: TimeRange;
  todayRanges: TimeRange[];
  weekRanges: TimeRange[];
  isReplaced: boolean;
};

const initialState: InitialState = {
  todayRanges: [],
  weekRanges: [],
  isReplaced: false,
  activeRange: {} as TimeRange,
};

export const editActiveTimeRange = createAsyncThunk(
  "timerange",
  async (range: TimeRange, thunkAPI) => {
    try {
      return await timeRangeService.editTimeRange(range);
    } catch (error: any) {
      const message =
        (error.response &&
          error.response?.data &&
          error.response?.data?.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const timeRangesSlice = createSlice({
  name: "timeControls",
  initialState: initialState,
  reducers: {
    reset: () => initialState,
    replaceTimeRanges(
      state,
      action: PayloadAction<{
        todayRanges: TimeRange[];
        weekRanges: TimeRange[];
        activeRange?: TimeRange;
      }>
    ) {
      state.todayRanges = action.payload.todayRanges;
      state.weekRanges = action.payload.weekRanges;
      if (action.payload.activeRange) {
        state.activeRange = action.payload.activeRange;
      }
      state.isReplaced = true;
    },
    replaceActiveRange(state, action: PayloadAction<TimeRange>) {
      state.activeRange = action.payload;
    },
    addTimeRange(state, action: PayloadAction<{ range: TimeRange }>) {
      const updatedTodayRanges = state.todayRanges.filter(
        (r) => action.payload.range._id !== r._id
      );
      const updatedWeekRanges = state.weekRanges.filter(
        (r) => action.payload.range._id !== r._id
      );

      updatedTodayRanges.push(action.payload.range);
      updatedWeekRanges.push(action.payload.range);

      state.todayRanges = updatedTodayRanges;
      state.weekRanges = updatedWeekRanges;
      state.activeRange = {} as TimeRange;
    },
    removeTimeRange(state, action: PayloadAction<{ item: TimeRange }>) {
      const id = action.payload.item._id;
      state.todayRanges = state.todayRanges.filter((item) => item._id !== id);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(editActiveTimeRange.fulfilled, (state, action) => {
      state.activeRange = action.payload;
    });
  },
});

export const timeRangesActions = timeRangesSlice.actions;
export default timeRangesSlice;
