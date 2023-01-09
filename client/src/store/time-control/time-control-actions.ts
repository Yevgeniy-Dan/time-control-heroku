import qs from "qs";

import { AppDispatch } from "..";
import api from "../../http";
import TimeRange from "../../models/time-range";
import { timeRangesActions } from "./time-control-slice";

export const fetchTimeRanges = () => {
  return async (dispatch: AppDispatch) => {
    const fetchData = async () => {
      const reponse = await api.get("/admin/time-ranges");

      const timeRanges = reponse.data.timeRanges;

      return timeRanges;
    };

    try {
      const timeRangesData: TimeRange[] = await fetchData();

      dispatch(timeRangesActions.replaceTimeRanges({ ranges: timeRangesData }));
    } catch (error) {
      console.log(error);
    }
  };
};

export const addTimeRange = (range: TimeRange) => {
  return async (dispatch: AppDispatch) => {
    const addTimeRequest = async () => {
      const addedItem = await api.post("/admin/add-time", {
        todo: qs.stringify(range.todo),
        category: qs.stringify(range.category),
        time: qs.stringify(range.time),
      });

      return addedItem;
    };

    try {
      const newTime = await addTimeRequest();
      dispatch(timeRangesActions.addTimeRange({ range: newTime.data }));
    } catch (error) {
      console.log(error);
    }
  };
};
