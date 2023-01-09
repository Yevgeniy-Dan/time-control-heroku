import React from "react";
import { Col, Form, Row } from "react-bootstrap";

import { useAppSelector } from "../../../hooks/redux";
import { Time } from "../../../models/time-range";

import AppBadge from "../../UI/AppBadge";
import Timer from "../Timer/Timer";

import classes from "./TimeRangeList.module.css";

const TimeRangeList: React.FC = () => {
  const timeRanges = useAppSelector((state) => state.timeRanges);

  const convertTimeToSeconds = (time: Time) => {
    return time.hours * 3600000 + time.minutes * 60000 + time.seconds * 1000;
  };

  return (
    <>
      {timeRanges.ranges.map((t) => {
        return (
          <Row className={classes.container} key={t._id}>
            <Col xs="6">
              <Form.Control
                type="text"
                value={t.todo?.title}
                onChange={() => {}}
              />
            </Col>
            <Col style={{ position: "relative" }}>
              <AppBadge
                title={t.category?.title || "No Category"}
                onClick={() => {}}
              />
            </Col>
            <Col>
              <Timer time={convertTimeToSeconds(t.time)} />
            </Col>
          </Row>
        );
      })}
    </>
  );
};

export default TimeRangeList;
