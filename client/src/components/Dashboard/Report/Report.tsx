import React, { useEffect } from "react";
import { Chart, ArcElement } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import classes from "./Report.module.css";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { createDiagramObject } from "../../../store/time-control/time-control-actions";

Chart.register(ArcElement);

const Report: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const categories = useAppSelector((state) => state.categories);
  const timeRanges = useAppSelector((state) => state.timeRanges);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      categories.isReplaced &&
      timeRanges.isReplaced &&
      !timeRanges.diagramIsLoaded
    ) {
      dispatch(createDiagramObject());
    }
  }, [categories, timeRanges, dispatch]);

  return (
    <div className={classes.diagramContainer}>
      {!timeRanges.diagramIsLoaded ? (
        <p>Loading...</p>
      ) : (
        <Doughnut data={timeRanges.diagramObj} />
      )}
    </div>
  );
};

export default Report;
