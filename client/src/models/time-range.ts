export type TimeTodo = {
  todoId?: string;
  title: string;
};

export type TimeCategory = {
  categoryId: string;
  title: string;
};

export type Time = {
  hours: number;
  minutes: number;
  seconds: number;
};

class TimeRange {
  _id: string;
  todo?: TimeTodo | null;
  category?: TimeCategory | null;
  time: Time;

  constructor(
    time: Time,
    todo: TimeTodo | null,
    category: TimeCategory | null
  ) {
    this._id = new Date().toISOString();
    this.time = { ...time };
    this.todo = todo ? { ...todo } : null;
    this.category = category ? { ...category } : null;
  }
}

export default TimeRange;
