import React from "react";
import { convertMs } from "../../../utils/time-converter";
import classes from "./Timer.module.css";

const Timer: React.FC<React.PropsWithChildren<{ time: number }>> = ({
  time,
}) => {
  return (
    <div className={classes.timer}>
      <span>
        {("0" + convertMs(time).hours).slice(
          -convertMs(time).hours.toString().length
        )}
        :
      </span>
      <span>{("0" + convertMs(time).minutes).slice(-2)}:</span>
      <span>{("0" + convertMs(time).seconds).slice(-2)}</span>
    </div>
  );
};

export default Timer;
