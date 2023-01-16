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

export type TimeDisplay = {
  hours: number;
  minutes: number;
  seconds: number;
};
