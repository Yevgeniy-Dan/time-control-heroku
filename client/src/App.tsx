import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./pages/Layout";
import Categories from "./components/Dashboard/Category/Categories";
import NotFound from "./pages/NotFound";
import Todos from "./components/Dashboard/Todo/Todos";
import StopWatch from "./components/TimeControl/StopWatch/StopWatch";
import Report from "./components/Dashboard/Report/Report";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import RequireAuth from "./pages/RequireAuth";

function App() {
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
