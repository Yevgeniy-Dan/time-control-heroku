import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import Categories from "./components/Dashboard/Category/Categories";
import NotFound from "./components/pages/NotFound";
import Todos from "./components/Dashboard/Todo/Todos";
import { fetchCategoriesData } from "./store/categories/categories-actions";
import { useAppDispatch } from "./hooks/redux";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCategoriesData());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="timer" />} />
        {/* <Route path="timer" element={<Categories />} /> */}
        <Route path="categories" element={<Categories />} />
        <Route path="to-do-list" element={<Todos />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
