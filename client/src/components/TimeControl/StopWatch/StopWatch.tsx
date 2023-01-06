import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

import Timer from "../Timer/Timer";
import ControlButtons from "../ControlButtons/ControlButtons";

import classes from "./StopWatch.module.css";
import type { Time, TimeCategory, TimeTodo } from "../../../models/time-range";

import AppBadge from "../../UI/AppBadge";
import AppSelectInput from "../../UI/AppSelectInput";
import {
  addTimeRange,
  fetchTimeRanges,
} from "../../../store/time-control/time-control-actions";
import TimeRange from "../../../models/time-range";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";

const StopWatch: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [time, setTime] = useState(12345678);

  const [todo, setTodo] = useState<TimeTodo | null>(null);
  const [category, setCategory] = useState<TimeCategory | null>(null);

  const dispatch = useAppDispatch();
  const timeRanges = useAppSelector((state) => state.timeRanges.ranges);

  useEffect(() => {
    dispatch(fetchTimeRanges());
  }, [dispatch]);

  useEffect(() => {
    let interval: any = null;

    if (isActive && isPaused === false) {
      interval = setInterval(() => {
        setTime((time) => time + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive, isPaused]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handleReset = () => {
    const timeObj: Time = {
      hours: Math.floor((time / 3600000) % 60),
      minutes: Math.floor((time / 60000) % 60),
      seconds: Math.floor((time / 1000) % 60),
    };

    const timeRangeObj = new TimeRange(timeObj, todo, category);

    dispatch(addTimeRange(timeRangeObj));

    setIsActive(false);
    setTime(0);
  };

  return (
    <>
      <Row className={classes.stopWatchContainer}>
        <Col xs="6">
          <AppSelectInput
            onChange={(todo, category) => {
              setTodo(todo);
              setCategory(category);
            }}
          />
        </Col>
        <Col style={{ position: "relative" }}>
          <AppBadge
            title={category?.title || "No Category"}
            onClick={() => {}}
          />
        </Col>
        <Col>
          <Timer time={time} />
        </Col>
        <Col>
          <ControlButtons
            active={isActive}
            handleStart={handleStart}
            handleReset={handleReset}
          />
        </Col>
      </Row>
      {console.log(timeRanges)}
    </>
  );
};

export default StopWatch;
