import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./pages/Layout";
import Categories from "./components/Dashboard/Category/Categories";
import NotFound from "./pages/NotFound";
import Todos from "./components/Dashboard/Todo/Todos";
import { fetchCategoriesData } from "./store/categories/categories-actions";
import { fetchTodosData } from "./store/todos/todos-actions";
import { fetchTimeRanges } from "./store/time-control/time-control-actions";
import { useAppDispatch } from "./hooks/redux";
import StopWatch from "./components/TimeControl/StopWatch/StopWatch";
import Report from "./components/Dashboard/Report/Report";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCategoriesData());
    dispatch(fetchTodosData());
    dispatch(fetchTimeRanges());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="timer" />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="timer" element={<StopWatch />} />
        <Route path="categories" element={<Categories />} />
        <Route path="to-do-list" element={<Todos />} />
        <Route path="report" element={<Report />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
