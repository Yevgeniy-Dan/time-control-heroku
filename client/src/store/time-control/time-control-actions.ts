import qs from "qs";

import { AppDispatch, RootState } from "..";
import api from "../../http";
import Category from "../../models/category";
import TimeRange, { dayInMs } from "../../models/time-range";
import { IReportDiagram } from "../../models/time/IDiagram";
import { ITable } from "../../models/time/ITable";
import { addTimeField, getTodayTimeRanges } from "./time-control-service";
import { timeRangesActions } from "./time-control-slice";

export const fetchTimeRanges = () => {
  return async (dispatch: AppDispatch) => {
    const fetchData = async () => {
      const reponse = await api.get("/admin/time-ranges");

      const timeRanges = reponse.data.timeRanges;

      return timeRanges;
    };

    try {
      let timeRangesData: TimeRange[] = await fetchData();

      timeRangesData = getTodayTimeRanges(timeRangesData);

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
        dates: qs.stringify({
          startDate: range.startDate,
          endDate: range.endDate,
        }),
      });

      return addedItem;
    };

    try {
      const newTime = await addTimeRequest();
      dispatch(
        timeRangesActions.addTimeRange({
          range: addTimeField(newTime.data),
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
};

export const removeTimeRange = (range: TimeRange) => {
  return async (dispatch: AppDispatch) => {
    const sendRequest = async () => {
      const response = await api.post("/admin/delete-time-range", {
        timeRangeId: range._id,
      });

      return response.data;
    };
    try {
      const removedItem = await sendRequest();
      dispatch(timeRangesActions.removeTimeRange({ item: removedItem }));
    } catch (err) {
      console.log(err);
    }
  };
};

export const createDiagramObject = (
  categories: Category[],
  timeRanges: TimeRange[]
) => {
  const tableData: IReportDiagram[] = getDiagramData(categories, timeRanges);

  const diagramObj = {
    labels: tableData.map(({ categoryTitle: title }) => title),
    datasets: [
      {
        data: tableData.map(
          ({ percent: totalTimeInPercent }) => totalTimeInPercent
        ),
        backgroundColor: tableData.map(({ color }) => color),
        hoverBackgroundColor: tableData.map(({ color }) => color),
        borderWidth: 0,
      },
    ],
  };
  return {
    ...diagramObj,
  };
};

export const createTableObject = (
  categories: Category[],
  timeRanges: TimeRange[]
) => {
  const data = getDiagramData(categories, timeRanges);

  const tableData: ITable[] = data.map((item) => {
    let updatedItem: ITable = {
      ...item,
      todos: [],
    };

    const todos = timeRanges
      .filter((r) => r.category?.categoryId === item.categoryId)
      .map((todo) => {
        return {
          todoTitle: todo.todo ? todo.todo.title : "No Title",
          time: todo.time.ms,
          percent: todo.time.percent,
        };
      });

    const todosWithoutCategory = timeRanges
      .filter((r) => !r.category)
      .map((todo) => {
        return {
          todoTitle: todo.todo ? todo.todo.title : "No Title",
          time: todo.time.ms,
          percent: todo.time.percent,
        };
      });

    if (todos.length === 0) {
      if (item.categoryTitle === "Unfilled time") {
        updatedItem = { ...item, todos: [] };
      } else if (item.categoryTitle === "Other") {
        updatedItem = { ...item, todos: [...todosWithoutCategory] };
      }
    } else {
      updatedItem = { ...item, todos: [...todos] };
    }

    return updatedItem;
  });

  return tableData;
};

const getDiagramData = (categories: Category[], timeRanges: TimeRange[]) => {
  const data = categories.map((c) => {
    const totalCategoryTime = timeRanges
      .filter((tr) => tr.category?.categoryId === c._id)
      .reduce((sum, item) => sum + item.time.ms, 0);

    const totalCategoryPercentTime = timeRanges
      .filter((tr) => tr.category?.categoryId === c._id)
      .reduce((sum, item) => sum + item.time.percent, 0);

    return {
      categoryId: c._id,
      categoryTitle: c.title,
      color: c.color,
      time: totalCategoryTime,
      percent: totalCategoryPercentTime,
    };
  });

  const timeRangesWithoutCategories = timeRanges.filter((t) => !t.category);

  if (timeRangesWithoutCategories.length !== 0) {
    data.push({
      categoryId: Math.floor(Math.random() * 10000).toString(),
      categoryTitle: "Other",
      color: "#0000004c",
      time: timeRangesWithoutCategories.reduce(
        (sum, item) => sum + item.time.ms,
        0
      ),
      percent: +timeRangesWithoutCategories
        .reduce((sum, item) => sum + item.time.percent, 0)
        .toFixed(2),
    });
  }

  const totalTimeSum = data.reduce(
    (totalTimeSum, item) => totalTimeSum + item.time,
    0
  );

  const totalPercentTimeSum = data.reduce(
    (totalTimeSum, item) => totalTimeSum + item.percent,
    0
  );

  if (100 - totalPercentTimeSum !== 0) {
    data.push({
      categoryId: Math.floor(Math.random() * 100).toString(),
      categoryTitle: "Unfilled time",
      color: "#00000033",
      time: dayInMs - totalTimeSum,
      percent: +(100 - totalPercentTimeSum).toFixed(2),
    });
  }

  return data;
};
