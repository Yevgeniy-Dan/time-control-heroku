import dayjs, { Dayjs } from "dayjs";
import { Time, TimeCategory, TimeTodo } from "../types/Time";

export const dayInMs = 86400000;
export const weekInMs = 604800000;

class TimeRange {
  _id: string;
  todo?: TimeTodo | null;
  category?: TimeCategory | null;
  time: Time;
  startDate: string;
  endDate: string;

  constructor(
    startDate: Dayjs,
    todo: TimeTodo | null,
    category: TimeCategory | null
  ) {
    this._id = new Date().toISOString();
    this.startDate = startDate.toISOString();
    this.endDate = dayjs().toISOString();
    this.todo = todo ? { ...todo } : null;
    this.category = category ? { ...category } : null;
  }
}

export default TimeRange;
