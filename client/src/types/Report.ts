export type ReportDiagram = {
  categoryId: string;
  categoryTitle: string;
  color: string;
  time: number;
  percent: number;
};

export type ReportTable = {
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
};
