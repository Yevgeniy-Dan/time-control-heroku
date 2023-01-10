export type TimeTodo = {
  todoId?: string;
  title: string;
};

export type TimeCategory = {
  categoryId: string;
  title: string;
};

export type Time = {
  ms: number;
  percent: number;
};

const dayInMs = 86400000;

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
