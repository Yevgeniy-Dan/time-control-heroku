import React, { useState, useEffect } from "react";
import { Chart, ArcElement, Title, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import classes from "./Report.module.css";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import AppTable from "../../UI/AppTable";
import { Col, Container, Row } from "react-bootstrap";
import {
  createDiagramObject,
  createTableObject,
} from "../../../store/time-control/time-control-actions";
import { IDoughnutDiagram } from "../../../models/time/IDiagram";
import { ITable } from "../../../models/time/ITable";

Chart.register(ArcElement, Tooltip, Title);

const Report: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const timeRanges = useAppSelector((state) => state.timeRanges);
  const categories = useAppSelector((state) => state.categories);
  const [diagramObj, setDiagramObj] = useState({} as IDoughnutDiagram);
  const [tableData, setTableData] = useState([] as ITable[]);

  useEffect(() => {
    if (
      timeRanges.isReplaced &&
      categories.isReplaced &&
      Object.keys(diagramObj).length === 0 // if diagramObj is empty
    ) {
      const diagram = createDiagramObject(categories.items, timeRanges.ranges);
      setDiagramObj(diagram);
      console.log(diagram);
    }
  }, [timeRanges, categories, diagramObj]);

  useEffect(() => {
    if (
      timeRanges.isReplaced &&
      categories.isReplaced &&
      tableData.length === 0
    ) {
      const tableData = createTableObject(categories.items, timeRanges.ranges);
      setTableData(tableData);
      console.log(tableData);
    }
  }, [timeRanges, categories, tableData]);

  return (
    <Container>
      <Row className="justify-content-around">
        <Col sm={8} className="mb-sm-2">
          {tableData.length !== 0 && <AppTable tableData={tableData} />}
        </Col>
        <Col sm={4} className={classes.diagramContainer}>
          {Object.keys(diagramObj).length === 0 ? (
            <p>Loading...</p>
          ) : (
            <Doughnut data={diagramObj} />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Report;
