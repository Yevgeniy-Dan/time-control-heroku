import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import TimeRange from "../../models/time-range";

type InitialState = {
  ranges: TimeRange[];
  isReplaced: boolean;
  diagramObj: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      hoverBackgroundColor: string[];
      borderWidth: number;
    }[];
  };
  diagramIsLoaded: boolean;
};

const initialState: InitialState = {
  ranges: [],
  isReplaced: false,
  diagramObj: {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
        borderWidth: 0,
      },
    ],
  },
  diagramIsLoaded: false,
};

const timeRangesSlice = createSlice({
  name: "timeControls",
  initialState: initialState,
  reducers: {
    replaceTimeRanges(state, action: PayloadAction<{ ranges: TimeRange[] }>) {
      state.ranges = action.payload.ranges;
      state.isReplaced = true;
    },
    createDiagramObject(
      state,
      action: PayloadAction<{ obj: InitialState["diagramObj"] }>
    ) {
      state.diagramObj = { ...action.payload.obj };
      state.diagramIsLoaded = true;
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
