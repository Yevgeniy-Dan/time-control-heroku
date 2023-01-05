import React, { useEffect, useState } from "react";

import Timer from "../Timer/Timer";
import ControlButtons from "../ControlButtons/ControlButtons";

import classes from "./StopWatch.module.css";
import { Col, Form, Row } from "react-bootstrap";
import AppBadge from "../../UI/AppBadge";

const StopWatch: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [time, setTime] = useState(0);

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
    setIsActive(false);
    setTime(0);
  };

  return (
    <Row className={classes.stopWatchContainer}>
      <Col xs="6">
        <Form.Control placeholder="Desciption" style={{ padding: "0" }} />
      </Col>
      <Col style={{ position: "relative" }}>
        <AppBadge title="Select" onClick={() => {}} />
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
  );
};

export default StopWatch;
