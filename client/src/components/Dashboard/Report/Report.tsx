import React, { useState, useEffect } from "react";
import { Chart, ArcElement, Title, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import classes from "./Report.module.css";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import {
  createDiagramObject,
  getTableData,
} from "../../../store/time-control/time-control-actions";
import AppTable from "../../UI/AppTable";
import { ReportTable } from "../../../types/Report";
import { Col, Container, Row } from "react-bootstrap";

Chart.register(ArcElement, Tooltip, Title);

const Report: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const categories = useAppSelector((state) => state.categories);
  const timeRanges = useAppSelector((state) => state.timeRanges);

  const [tableData, setTableData] = useState<ReportTable[] | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      categories.isReplaced &&
      timeRanges.isReplaced &&
      !timeRanges.diagramIsLoaded
    ) {
      dispatch(createDiagramObject());
      setTableData(getTableData(categories.items, timeRanges.ranges));
    }
  }, [categories, timeRanges, dispatch]);

  return (
    <Container>
      <Row className={classes.rowContainer}>
        <Col className="justify-content-center" sm={8}>
          {tableData && <AppTable tableData={tableData} />}
        </Col>
        <Col className="d-flex justify-content-center" sm={4}>
          <div className={classes.diagramContainer}>
            {!timeRanges.diagramIsLoaded ? (
              <p>Loading...</p>
            ) : (
              <Doughnut data={timeRanges.diagramObj} />
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Report;
