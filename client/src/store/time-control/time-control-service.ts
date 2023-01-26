import TimeRange, { dayInMs, weekInMs } from "../../models/time-range";
import dayjs from "dayjs";

export const addTimeField = (timeRange: TimeRange) => {
  const ms = dayjs(timeRange.endDate)
    .subtract(dayjs(timeRange.startDate).valueOf())
    .valueOf();

  return {
    ...timeRange,
    time: {
      ms: ms,
      percent: +((ms / dayInMs) * 100).toFixed(2),
    },
  };
};

export const getTodayTimeRanges = (dbReportData: TimeRange[]): TimeRange[] => {
  const now = dayjs();

  const todaysStartAndEndTasks: TimeRange[] = dbReportData
    .filter((r) => {
      return (
        now.isSame(dayjs(r.startDate), "day") &&
        dayjs(r.startDate).isSame(r.endDate, "day")
      );
    })
    .map((t) => {
      const ms = dayjs(t.endDate)
        .subtract(dayjs(t.startDate).valueOf())
        .valueOf();

      return {
        ...t,
        time: {
          ms: ms,
          percent: +((ms / dayInMs) * 100).toFixed(2),
        },
      };
    });

  let todaysTasksWithPastStart: TimeRange[] = dbReportData
    .filter((t) => {
      // Retrieve task that did not start today, but ended today
      return now.isAfter(t.startDate, "day") && now.isSame(t.endDate, "day");
    })
    .map((t) => {
      // Define start time as today is midnight
      return {
        ...t,
        startDate: dayjs()
          .hour(0)
          .minute(0)
          .second(0)
          .millisecond(0)
          .toISOString(),
      };
    });

  let tasksForWholeDay: TimeRange[] = dbReportData.filter((t) => {
    return now.isAfter(t.startDate, "day") && now.isBefore(t.endDate, "day");
  });

  tasksForWholeDay = tasksForWholeDay.map((t) => {
    return {
      ...t,
      time: {
        ms: dayInMs,
        percent: 100,
      },
    };
  });

  todaysTasksWithPastStart = todaysTasksWithPastStart.map((t) => {
    let ms = dayjs(t.endDate).subtract(dayjs(t.startDate).valueOf()).valueOf();

    return {
      ...t,
      time: {
        ms: ms,
        percent: +((ms / dayInMs) * 100).toFixed(2),
      },
    };
  });

  return [
    ...todaysStartAndEndTasks,
    ...todaysTasksWithPastStart,
    ...tasksForWholeDay,
  ];
};

export const getWeeklyReport = (timeRanges: TimeRange[]) => {
  let now = dayjs();
  let firstDay = now
    .subtract(now.day(), "day")
    .hour(24)
    .minute(0)
    .second(0)
    .millisecond(0);

  let firstDayOfNextWeek = firstDay
    .add(6, "day")
    .hour(24)
    .minute(0)
    .second(0)
    .millisecond(0);

  const weeklyTimeRanges = timeRanges
    .filter((t) => {
      return (
        dayjs(t.endDate).isSameOrAfter(firstDay) &&
        dayjs(t.endDate).isBefore(firstDayOfNextWeek)
      );
    })
    .map((t) => {
      if (dayjs(t.startDate).isBefore(firstDay)) {
        return {
          ...t,
          startDate: dayjs()
            .hour(0)
            .minute(0)
            .second(0)
            .millisecond(0)
            .toISOString(),
        };
      } else {
        return {
          ...t,
        };
      }
    })
    .map((t) => {
      const ms = dayjs(t.endDate)
        .subtract(dayjs(t.startDate).valueOf())
        .valueOf();

      return {
        ...t,
        time: {
          ms: ms,
          percent: +((ms / weekInMs) * 100).toFixed(2),
        },
      };
    });

  return weeklyTimeRanges;
};
