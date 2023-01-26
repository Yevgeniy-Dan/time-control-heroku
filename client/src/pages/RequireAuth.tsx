import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";

import { fetchCategoriesData } from "../store/categories/categories-actions";
import { fetchTimeRanges } from "../store/time-control/time-control-actions";
import { fetchTodosData } from "../store/todos/todos-actions";

const RequireAuth: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      dispatch(fetchCategoriesData());
      dispatch(fetchTodosData());
      dispatch(fetchTimeRanges());
    }
  }, [user, navigate, dispatch]);

  return <>{children}</>;
};

export default RequireAuth;
