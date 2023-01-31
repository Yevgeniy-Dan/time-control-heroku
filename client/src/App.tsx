import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Layout from "./pages/Layout";
import Categories from "./components/Dashboard/Category/Categories";
import NotFound from "./pages/NotFound";
import Todos from "./components/Dashboard/Todo/Todos";
import StopWatch from "./components/TimeControl/StopWatch/StopWatch";
import Report from "./components/Dashboard/Report/Report";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import RequireAuth from "./pages/RequireAuth";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import {
  stopwatchActions,
  stopwatchInterval,
} from "./store/stopwatch/stopwatch-slice";
import { fetchCategoriesData } from "./store/categories/categories-actions";
import { fetchTodosData } from "./store/todos/todos-actions";
import { fetchTimeRanges } from "./store/time-control/time-control-actions";

function App() {
  const dispatch = useAppDispatch();
  const stopwatch = useAppSelector((state) => state.stopwatch);
  const { user } = useAppSelector((state) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (user) {
      dispatch(fetchCategoriesData());
      dispatch(fetchTodosData());
      dispatch(fetchTimeRanges());
    }
  }, [user, dispatch]);

  useEffect(() => {
    let interval: any = null;

    if (stopwatch.isActive && stopwatch.isPaused === false) {
      interval = setInterval(() => {
        dispatch(stopwatchActions.setTime());
      }, stopwatchInterval);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [stopwatch.isActive, stopwatch.isPaused, dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="timer" />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route
          path="/timer"
          element={
            <RequireAuth>
              <StopWatch />
            </RequireAuth>
          }
        />

        <Route
          path="/categories"
          element={
            <RequireAuth>
              <Categories />
            </RequireAuth>
          }
        />

        <Route
          path="/to-do-list"
          element={
            <RequireAuth>
              <Todos />
            </RequireAuth>
          }
        />

        <Route
          path="/report"
          element={
            <RequireAuth>
              <Report />
            </RequireAuth>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
