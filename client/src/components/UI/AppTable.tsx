import React from "react";
import BootstrapTable, {
  ColumnDescription,
  ExpandRowProps,
} from "react-bootstrap-table-next";
import { ReportTable } from "../../types/Report";
import { TimeDisplay } from "../../types/Time";
import { convertMs } from "../../utils/time-converter";

import classes from "./AppTable.module.css";

const formatTime = (time: TimeDisplay): string => {
  let formatted = "";

  if (time.hours.toString().length === 1) {
    formatted = "0";
  }
  formatted += `${time.hours}:`;

  if (time.minutes.toString().length === 1) {
    formatted += "0";
  }

  formatted += `${time.minutes}:`;

  if (time.seconds.toString().length === 1) {
    formatted += "0";
  }

  formatted += `${time.seconds}`;

  return formatted;
};

const AppTable: React.FC<
  React.PropsWithChildren<{ tableData: ReportTable[] }>
> = ({ tableData }) => {
  const records = tableData.map((data) => {
    const time = formatTime(convertMs(data.time));
    return { ...data, time: time };
  });
  console.log(records);

  const columns = [
    {
      dataField: "categoryTitle",
      text: "Title",
      sort: true,
    },
    {
      dataField: "time",
      text: "Duration",
    },
    {
      dataField: "percent",
      text: "Percentage",
      sort: true,
    },
  ];

  const expandRow: ExpandRowProps<any, number> | undefined = {
    renderer: (row: ReportTable, rowIndex) => {
      return (
        <React.Fragment>
          {row.todos?.map((todo) => {
            return (
              <div className="rowContainer">
                <p></p>
                <p>{todo.todoTitle || "No Title"}</p>
                <p>{formatTime(convertMs(todo.time))}</p>
                <p>{todo.percent}</p>
              </div>
            );
          })}
        </React.Fragment>
      );
    },
    showExpandColumn: true,
    expandHeaderColumnRenderer: ({ isAnyExpands }) => {
      return isAnyExpands ? (
        <i className="bi bi-arrow-up-circle"></i>
      ) : (
        <i className="bi bi-arrow-down-circle"></i>
      );
    },
    expandColumnRenderer: ({ expanded }) => {
      return expanded ? (
        <i className="bi bi-arrow-up-circle"></i>
      ) : (
        <i className="bi bi-arrow-down-circle"></i>
      );
    },
  };

  return (
    <BootstrapTable
      bootstrap4
      keyField="categoryId"
      bordered={false}
      data={records}
      columns={columns}
      expandRow={expandRow}
      wrapperClasses="table-responsive"
    />
  );
};

export default AppTable;
