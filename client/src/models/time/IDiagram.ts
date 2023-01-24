export interface IDoughnutDiagram {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    hoverBackgroundColor: string[];
    borderWidth: number;
  }[];
}

export interface IReportDiagram {
  categoryId: string;
  categoryTitle: string;
  color: string;
  time: number;
  percent: number;
}
