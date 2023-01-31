import React, { useState, useEffect } from "react";
import { Chart, ArcElement, Title, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import classes from "./Report.module.css";
import { useAppSelector } from "../../../hooks/redux";
import AppTable from "../../UI/AppTable";
import { Col, Container, Row, Tab, Tabs } from "react-bootstrap";
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

  const [todayDiagramObj, setTodayDiagramObj] = useState(
    {} as IDoughnutDiagram
  );
  const [weekDiagramObj, setWeekDiagramObj] = useState({} as IDoughnutDiagram);

  const [todayTableData, setTodayTableData] = useState([] as ITable[]);
  const [weekTableData, setWeekTableData] = useState([] as ITable[]);

  useEffect(() => {
    if (timeRanges.isReplaced && categories.isReplaced) {
      if (
        Object.keys(todayDiagramObj).length === 0 // if diagramObj is empty
      ) {
        const todayDiagram = createDiagramObject(
          categories.items,
          timeRanges.todayRanges,
          "day"
        );
        setTodayDiagramObj(todayDiagram);
      }

      if (
        Object.keys(weekDiagramObj).length === 0 // if diagramObj is empty
      ) {
        const weekDiagram = createDiagramObject(
          categories.items,
          timeRanges.weekRanges,
          "week"
        );
        setWeekDiagramObj(weekDiagram);
      }
    }
  }, [timeRanges, categories, todayDiagramObj, weekDiagramObj]);

  useEffect(() => {
    if (timeRanges.isReplaced && categories.isReplaced) {
      if (weekTableData.length === 0) {
        const weekTableData = createTableObject(
          categories.items,
          timeRanges.weekRanges,
          "week"
        );
        setWeekTableData(weekTableData);
      }

      if (todayTableData.length === 0) {
        const todayTableData = createTableObject(
          categories.items,
          timeRanges.todayRanges,
          "day"
        );
        setTodayTableData(todayTableData);
      }
    }
  }, [timeRanges, categories, todayTableData, weekTableData]);

  return (
    <Container>
      <Tabs
        defaultActiveKey="today"
        id="justify-tab-example"
        className="mb-5"
        justify
      >
        <Tab eventKey="today" title="Today">
          <h2 className="mb-4">Today Report</h2>
          <Row className="justify-content-around">
            <Col sm={8} className="mb-sm-2">
              {todayTableData.length !== 0 && (
                <AppTable tableData={todayTableData} />
              )}
            </Col>
            <Col sm={4} className={classes.diagramContainer}>
              {Object.keys(todayDiagramObj).length === 0 ? (
                <p>Loading...</p>
              ) : (
                <Doughnut data={todayDiagramObj} />
              )}
            </Col>
          </Row>
        </Tab>
        <Tab eventKey="week" title="Week">
          <h2 className="mb-4">Week Report</h2>
          <Row className="justify-content-around">
            <Col sm={8} className="mb-sm-2">
              {weekTableData.length !== 0 && (
                <AppTable tableData={weekTableData} />
              )}
            </Col>
            <Col sm={4} className={classes.diagramContainer}>
              {Object.keys(weekDiagramObj).length === 0 ? (
                <p>Loading...</p>
              ) : (
                <Doughnut data={weekDiagramObj} />
              )}
            </Col>
          </Row>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Report;
