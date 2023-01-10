import qs from "qs";

import { AppDispatch, RootState } from "..";
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

export const createDiagramObject = () => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const categories = getState().categories;
    const timeRanges = getState().timeRanges;

    const data = categories.items.map((c) => {
      const totalCategoryTime = timeRanges.ranges
        .filter((tr) => tr.category?.categoryId === c._id)
        .reduce((sum, item) => sum + item.time.percent, 0);

      return {
        title: c.title,
        color: c.color,
        totalTimeInPercent: totalCategoryTime,
      };
    });

    const totalPercentTimeSum = data.reduce(
      (totalTimeSum, item) => totalTimeSum + item.totalTimeInPercent,
      0
    );

    if (100 - totalPercentTimeSum !== 0) {
      data.push({
        color: "#00000033",
        title: "Other",
        totalTimeInPercent: +(100 - totalPercentTimeSum).toFixed(2),
      });
    }

    const diagramObj = {
      labels: data.map(({ title }) => title),
      datasets: [
        {
          data: data.map(({ totalTimeInPercent }) => totalTimeInPercent),
          backgroundColor: data.map(({ color }) => color),
          // hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          borderWidth: 0,
        },
      ],
    };

    dispatch(timeRangesActions.createDiagramObject({ obj: { ...diagramObj } }));
  };
};
