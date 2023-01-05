import React from "react";
import classes from "./ControlButtons.module.css";

const ControlButtons: React.FC<
  React.PropsWithChildren<{
    active: boolean;
    handleStart: () => void;
    handleReset: () => void;
  }>
> = ({ active, handleStart, handleReset }) => {
  const StartButton = (
    <i className="bi bi-play-circle" onClick={handleStart}></i>
  );
  const ActiveButtons = (
    <i className="bi bi-stop-circle" onClick={handleReset}></i>
  );

  return (
    <div
      className={`d-flex justify-content-center align-items-center ${classes.toggleBtnContainer}`}
    >
      {active ? ActiveButtons : StartButton}
    </div>
  );
};

export default ControlButtons;
