import React from "react";
import classes from "./Timer.module.css";

const Timer: React.FC<React.PropsWithChildren<{ time: number }>> = ({
  time,
}) => {
  return (
    <div className={classes.timer}>
      <span>{("0" + Math.floor((time / 3600000) % 60)).slice(-2)}:</span>
      <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
      <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}</span>
    </div>
  );
};

export default Timer;
