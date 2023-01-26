import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import TimeRange from "../../models/time-range";

import { IDoughnutDiagram } from "../../models/time/IDiagram";
import { ITable } from "../../models/time/ITable";

type InitialState = {
  ranges: TimeRange[];
  isReplaced: boolean;
  tableData: ITable[];
  diagramObj: IDoughnutDiagram;
  diagramIsLoaded: boolean;
};

const initialState: InitialState = {
  ranges: [],
  isReplaced: false,
  tableData: [] as ITable[],
  diagramObj: {} as IDoughnutDiagram,
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
      action: PayloadAction<{ obj: IDoughnutDiagram }>
    ) {
      state.diagramObj = { ...action.payload.obj };
      state.diagramIsLoaded = true;
    },
    createTableObject(state, action: PayloadAction<ITable[]>) {
      state.tableData = action.payload;
      // state.diagramIsLoaded = true;
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
