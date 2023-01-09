import React from "react";
import classes from "./Timer.module.css";

type TimeDisplay = {
  hours: number;
  minutes: number;
  seconds: number;
};

const Timer: React.FC<React.PropsWithChildren<{ time: number }>> = ({
  time,
}) => {
  const convertMs = (ms: number): TimeDisplay => {
    let d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    h += d * 24;

    return {
      hours: h,
      minutes: m,
      seconds: s,
    };
  };

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
