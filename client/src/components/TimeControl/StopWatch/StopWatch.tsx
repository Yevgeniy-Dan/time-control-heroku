import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

import classes from "./StopWatch.module.css";

import AppBadge from "../../UI/AppBadge";
import AppSelectInput from "../../UI/AppSelectInput";
import {
  addTimeRange,
  fetchTimeRanges,
} from "../../../store/time-control/time-control-actions";
import ControlButtons from "../ControlButtons/ControlButtons";
import Timer from "../Timer/Timer";
import TimeRange from "../../../models/time-range";
import type { TimeCategory } from "../../../models/time-range";
import { TodoOption } from "../../../utils/select-input";
import { useAppDispatch } from "../../../hooks/redux";
import TimeRangeList from "../TimeRangeList/TimeRangeList";

const StopWatch: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [time, setTime] = useState(360000000);

  const [todo, setTodo] = useState<TodoOption | null>(null);
  const [category, setCategory] = useState<TimeCategory | null>(null);

  const dispatch = useAppDispatch();

  const [todoTitle, setTodoTitle] = useState<string>("");

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
    let timeRangeObj;

    if (!todo?.value) {
      timeRangeObj = new TimeRange(
        time,
        {
          title: todoTitle,
        },
        null
      );
    } else {
      timeRangeObj = new TimeRange(
        time,
        { title: todo!.label, todoId: todo!.value },
        category
      );
    }

    dispatch(addTimeRange(timeRangeObj));

    clearValues();
  };

  const clearValues = () => {
    setIsActive(false);
    setTime(0);
    setTodo(null);
    setCategory(null);
  };

  return (
    <>
      <Row className={classes.stopWatchContainer}>
        <Col xs="6">
          <AppSelectInput
            onSelect={(todo, category) => {
              setTodo(todo);
              setCategory(category);
            }}
            onUserManualInput={(title: string) => {
              setTodo(null);
              setCategory(null);
              setTodoTitle(title);
            }}
            todo={todo}
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

      <TimeRangeList />
    </>
  );
};

export default StopWatch;
