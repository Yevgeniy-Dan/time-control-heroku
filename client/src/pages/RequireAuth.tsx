import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";

import { fetchCategoriesData } from "../store/categories/categories-actions";
import {
  createDiagramObject,
  createTableObject,
  fetchTimeRanges,
} from "../store/time-control/time-control-actions";
import { fetchTodosData } from "../store/todos/todos-actions";

const RequireAuth: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);
  const categories = useAppSelector((state) => state.categories);
  const timeRanges = useAppSelector((state) => state.timeRanges);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      dispatch(fetchCategoriesData());
      dispatch(fetchTodosData());
      dispatch(fetchTimeRanges());
    }
  }, [user, navigate, dispatch]);

  useEffect(() => {
    if (
      categories.isReplaced &&
      timeRanges.isReplaced &&
      !timeRanges.diagramIsLoaded
    ) {
      dispatch(createDiagramObject());
      dispatch(createTableObject());
    }
  }, [categories, timeRanges, dispatch]);

  return <>{children}</>;
};

export default RequireAuth;
