import { Time, TimeCategory, TimeTodo } from "../types/Time";

export const dayInMs = 86400000;

class TimeRange {
  _id: string;
  todo?: TimeTodo | null;
  category?: TimeCategory | null;
  time: Time;

  constructor(
    ms: number,
    todo: TimeTodo | null,
    category: TimeCategory | null
  ) {
    this._id = new Date().toISOString();
    this.time = {
      ms: ms,
      percent: +((ms / dayInMs) * 100).toFixed(2),
    };
    this.todo = todo ? { ...todo } : null;
    this.category = category ? { ...category } : null;
  }
}

export default TimeRange;
