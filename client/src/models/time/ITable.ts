export interface ITable {
  categoryId: string;
  todos?:
    | {
        todoTitle: string;
        time: number;
        percent: number;
      }[]
    | [];
  categoryTitle: string | undefined;
  time: number;
  percent: number;
  color: string;
}
