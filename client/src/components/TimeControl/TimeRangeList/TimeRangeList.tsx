import React from "react";
import { Col, Form, Row } from "react-bootstrap";

import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import TimeRange from "../../../models/time-range";
import { removeTimeRange } from "../../../store/time-control/time-control-actions";

import AppBadge from "../../UI/AppBadge";
import Timer from "../Timer/Timer";

import classes from "./TimeRangeList.module.css";

const TimeRangeList: React.FC = () => {
  const dispatch = useAppDispatch();

  const timeRanges = useAppSelector((state) => state.timeRanges);

  const removeRange = (item: TimeRange) => {
    dispatch(removeTimeRange(item));
  };

  return (
    <div className={classes.container}>
      {timeRanges.ranges.map((t) => {
        return (
          <Row className={classes.cardContainer} key={t._id}>
            <Col xs="6">
              <Form.Control
                type="text"
                value={t.todo?.title}
                placeholder="No Title"
                onChange={(e) => {
                  e.preventDefault();
                }}
              />
            </Col>
            <Col style={{ position: "relative" }}>
              <AppBadge
                title={t.category?.title || "No Category"}
                onClick={() => {}}
              />
            </Col>
            <Col>
              <Timer time={t.time.ms} />
            </Col>
            <Col xs={1}>
              <i
                onClick={() => removeRange(t)}
                style={{ cursor: "pointer" }}
                className="bi bi-trash text-danger"
              ></i>
            </Col>
          </Row>
        );
      })}
    </div>
  );
};

export default TimeRangeList;
