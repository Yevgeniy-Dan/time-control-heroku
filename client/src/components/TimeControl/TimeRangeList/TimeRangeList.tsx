import React from "react";
import { Col, Form, Row } from "react-bootstrap";

import { useAppSelector } from "../../../hooks/redux";

import AppBadge from "../../UI/AppBadge";
import Timer from "../Timer/Timer";

import classes from "./TimeRangeList.module.css";

const TimeRangeList: React.FC = () => {
  const timeRanges = useAppSelector((state) => state.timeRanges);

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
              <Timer time={t.time} />
            </Col>
          </Row>
        );
      })}
    </div>
  );
};

export default TimeRangeList;
