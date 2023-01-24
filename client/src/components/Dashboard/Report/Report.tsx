import React, { useState, useEffect } from "react";
import { Chart, ArcElement, Title, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import classes from "./Report.module.css";
import { useAppSelector } from "../../../hooks/redux";
import AppTable from "../../UI/AppTable";
import { Col, Container, Row } from "react-bootstrap";

Chart.register(ArcElement, Tooltip, Title);

const Report: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const timeRanges = useAppSelector((state) => state.timeRanges);

  return (
    <Container>
      <Row className="justify-content-around">
        <Col sm={8} className="mb-sm-2">
          {timeRanges.tableData && (
            <AppTable tableData={timeRanges.tableData} />
          )}
        </Col>
        <Col sm={4} className={classes.diagramContainer}>
          {!timeRanges.diagramIsLoaded ? (
            <p>Loading...</p>
          ) : (
            <Doughnut data={timeRanges.diagramObj} />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Report;
