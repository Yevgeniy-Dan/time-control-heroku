import qs from "qs";

import { AppDispatch } from "..";
import api from "../../http";
import Category from "../../models/category";
import TimeRange, { dayInMs, weekInMs } from "../../models/time-range";
import { IReportDiagram } from "../../models/time/IDiagram";
import { ITable } from "../../models/time/ITable";
import {
  addTimeField,
  getTodayTimeRanges,
  getWeeklyReport,
} from "./time-control-service";
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

      const activeTimeRange = timeRangesData.filter((t) => {
        return t.isActive;
      })[0];

      const todayRanges = getTodayTimeRanges(timeRangesData);
      const weekRanges = getWeeklyReport(timeRangesData);

      dispatch(
        timeRangesActions.replaceTimeRanges({
          todayRanges: todayRanges,
          weekRanges: weekRanges,
          activeRange: activeTimeRange,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
};

export const addActiveTimeRange = (range: TimeRange) => {
  return async (dispatch: AppDispatch) => {
    const addTimeRequest = async () => {
      const addedItem = await api.post("/admin/add-active-time", {
        todo: qs.stringify(range.todo),
        category: qs.stringify(range.category),
        startDate: range.startDate,
      });

      return addedItem;
    };

    try {
      const newTime = await addTimeRequest();
      dispatch(timeRangesActions.replaceActiveRange(newTime.data));
    } catch (error) {
      console.log(error);
    }
  };
};

export const addTimeRange = (range: TimeRange) => {
  return async (dispatch: AppDispatch) => {
    const addTimeRequest = async () => {
      const addedItem = await api.post("/admin/add-time-range", {
        rangeId: range._id,
        todo: qs.stringify(range.todo),
        category: qs.stringify(range.category),
        endDate: range.endDate,
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

// export const completeTimeRange = (range: TimeRange) => {
//   return async (dispatch: AppDispatch, getState: RootState) => {
//     const completeTimeRequest = async () => {
//       const addedItem = await api.post("/admin/complete-time", {
//         rangeId: getState.timeRanges.
//         todo: qs.stringify(range.todo),
//         category: qs.stringify(range.category),
//         endDate: range.endDate,
//       });

//       return addedItem;
//     };
//     try {
//       const newTime = await completeTimeRequest();
//       dispatch(
//         timeRangesActions.addTimeRange({
//           range: addTimeField(newTime.data),
//         })
//       );
//     } catch (error) {
//       console.log(error);
//     }
//   };
// };

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
  timeRanges: TimeRange[],
  period: "day" | "week"
) => {
  const tableData: IReportDiagram[] = createDiagramData(
    categories,
    timeRanges,
    period
  );

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

const parseInTodo = (array: TimeRange[]) => {
  return array.map((todo) => {
    return {
      id: todo._id,
      todoTitle: todo.todo ? todo.todo.title : "No Title",
      time: todo.time.ms,
      percent: todo.time.percent,
      categoryId: todo.category?.categoryId,
    };
  });
};

export const createTableObject = (
  categories: Category[],
  timeRanges: TimeRange[],
  period: "day" | "week"
) => {
  const data = createDiagramData(categories, timeRanges, period);

  const timeRangesWithoutCategory = parseInTodo(
    timeRanges.filter((r) => !r.category)
  ).map((t) => {
    const { categoryId, ...rest } = t;
    return { ...rest };
  });

  const timeRangesWithDeletedCategory = parseInTodo(
    timeRanges
      .filter((t) => t.category && t.category.categoryId)
      .filter((t) => {
        return !data.some((d) => d.categoryId === t.category!.categoryId);
      })
  ).map((t) => {
    const { categoryId, ...rest } = t;
    return { ...rest };
  });

  const updatedData: ITable[] = data
    .map((item) => {
      let updatedItem: ITable = {
        ...item,
        todos: [],
      };
      if (item.categoryTitle === "Other") {
        return {
          ...item,
          todos: [
            ...timeRangesWithDeletedCategory,
            ...timeRangesWithoutCategory,
          ],
        };
      } else if (item.categoryTitle === "Unfilled time") {
        return { ...item, todos: [] };
      }

      return updatedItem;
    })
    .filter((data) => data.todos?.length !== 0);

  const tableData: ITable[] = data
    .filter((item) => {
      return !updatedData.some((ud) => ud?.categoryId === item.categoryId);
    })
    .map((item) => {
      let updatedItem: ITable = {
        ...item,
        todos: [],
      };

      const todos = parseInTodo(
        timeRanges.filter((r) => r.category?.categoryId === item.categoryId)
      );

      if (todos.length !== 0) {
        updatedItem = { ...item, todos: [...todos] };
      }

      return updatedItem;
    });

  return [...tableData, ...updatedData];
};

const createDiagramData = (
  categories: Category[],
  timeRanges: TimeRange[],
  period: "day" | "week"
) => {
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
      time: period === "day" ? dayInMs - totalTimeSum : weekInMs - totalTimeSum,
      percent: +(100 - totalPercentTimeSum).toFixed(2),
    });
  }

  return data;
};
