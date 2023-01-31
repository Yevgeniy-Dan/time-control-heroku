import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

import classes from "./StopWatch.module.css";

import AppBadge from "../../UI/AppBadge";
import AppSelectInput from "../../UI/AppSelectInput";
import {
  addActiveTimeRange,
  addTimeRange,
} from "../../../store/time-control/time-control-actions";
import ControlButtons from "../ControlButtons/ControlButtons";
import Timer from "../Timer/Timer";
import TimeRange from "../../../models/time-range";
import { TodoOption } from "../../../utils/select-input";
import { TimeCategory } from "../../../types/Time";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import TimeRangeList from "../TimeRangeList/TimeRangeList";
import dayjs from "dayjs";
import { stopwatchActions } from "../../../store/stopwatch/stopwatch-slice";
import {
  editActiveTimeRange,
  timeRangesActions,
} from "../../../store/time-control/time-control-slice";
import { v4 as uuidv4, v4 } from "uuid";

const StopWatch: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const stopwatch = useAppSelector((state) => state.stopwatch);
  const categories = useAppSelector((state) => state.categories);

  const activeRange = useAppSelector((state) => state.timeRanges.activeRange);

  const [activeRangeIsSet, setActiveRangeIsSet] = useState(false);

  const [todo, setTodo] = useState<TodoOption | null>(null);
  const [category, setCategory] = useState<TimeCategory | null>(null);
  const [categoryIsChecked, setCategoryIsChecked] = useState(false);

  const [todoTitle, setTodoTitle] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    //check if user deleted or renamed category
    if (categories.isReplaced && !categoryIsChecked && activeRangeIsSet) {
      const updatedCategory = categories.items.find(
        (c) => c._id === category?.categoryId
      );
      if (updatedCategory) {
        const newCategory = {
          categoryId: updatedCategory._id,
          title: updatedCategory.title,
        };
        setCategory(newCategory);
        dispatch(
          editActiveTimeRange({
            ...activeRange,
            category: newCategory,
          })
        );
      }
      setCategoryIsChecked(true);
    }
  }, [categories, categoryIsChecked, activeRangeIsSet, dispatch]);

  useEffect(() => {
    if (activeRange && Object.keys(activeRange).length !== 0) {
      if (activeRange.category) {
        setCategory({
          categoryId: activeRange.category.categoryId,
          title: activeRange.category.title,
        });
      }
      if (activeRange?.todo?.todoId) {
        setTodo({
          value: activeRange.todo.todoId,
          label: activeRange?.todo?.title.toUpperCase(),
          categoryTitle: activeRange.category?.title || null,
          categoryId: activeRange.category?.categoryId || null,
        });
      } else {
        setUserTodoInput(activeRange.todo!.title);
      }

      if (!activeRangeIsSet) {
        handleStart(false, activeRange.startDate);
        setActiveRangeIsSet(true);
      }
    }
  }, [activeRange, activeRangeIsSet]);

  const handleStart = async (
    userClick: boolean = false,
    startDate: string = new Date().toISOString()
  ) => {
    const time = dayjs().diff(dayjs(startDate).toDate());

    dispatch(
      stopwatchActions.run({
        startDate: startDate,
        time: time,
      })
    );

    if (userClick) {
      let timeRangeObj;
      if (!todo?.value) {
        timeRangeObj = new TimeRange(
          {
            title: todoTitle || "",
          },
          null,
          startDate
        );
      } else {
        timeRangeObj = new TimeRange(
          { title: todo!.label, todoId: todo!.value },
          category,
          startDate
        );
      }
      dispatch(addActiveTimeRange(timeRangeObj));
    }
  };

  const handleReset = () => {
    let timeRangeObj = {
      ...activeRange,
    };

    if (!todo?.value) {
      timeRangeObj = {
        ...activeRange,
        endDate: dayjs().toISOString(),
        category: null,
        todo: {
          title: todoTitle || "",
        },
      };
    } else {
      timeRangeObj = {
        ...activeRange,
        endDate: dayjs().toISOString(),
        category: category,
        todo: {
          todoId: todo.value,
          title: todo.label,
        },
      };
    }

    dispatch(addTimeRange(timeRangeObj));

    clearValues();
  };

  const clearValues = () => {
    dispatch(stopwatchActions.clear());
    setTodo(null);
    setCategory(null);
  };

  const setUserTodoInput = (todoTitle: string) => {
    setTodo(null);
    setCategory(null);
    setTodoTitle(todoTitle);
  };

  return (
    <>
      <Row className={classes.stopWatchContainer}>
        <Col xs="6">
          <AppSelectInput
            onSelect={(todo, category) => {
              if (!category) {
                setTodoTitle(todo!.label);
              } else {
                setTodo(todo);
                setCategory(category);
              }

              if (stopwatch.isActive) {
                dispatch(
                  editActiveTimeRange({
                    ...activeRange,
                    category: category,
                    todo: {
                      title: todo!.label,
                      todoId: todo!.value,
                    },
                  })
                );
              }
            }}
            onUserManualInput={(title: string) => {
              setUserTodoInput(title);

              if (stopwatch.isActive) {
                dispatch(
                  editActiveTimeRange({
                    ...activeRange,
                    category: null,
                    todo: {
                      title: title,
                    },
                  })
                );
              }
            }}
            todo={todo}
            todoTitle={todoTitle}
          />
        </Col>
        <Col style={{ position: "relative" }}>
          <AppBadge
            title={category?.title || "No Category"}
            onClick={() => {}}
          />
        </Col>
        <Col>
          <Timer time={stopwatch.time} />
        </Col>
        <Col>
          <ControlButtons
            active={stopwatch.isActive}
            handleStart={() => handleStart(true)}
            handleReset={handleReset}
          />
        </Col>
      </Row>

      <TimeRangeList />
    </>
  );
};

export default StopWatch;
