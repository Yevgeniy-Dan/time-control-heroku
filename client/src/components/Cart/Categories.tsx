import { useEffect } from "react";

import Category from "./Category";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchCategoriesData } from "../../store/categories/categories-actions";
import AddCategoryForm from "./AddCategoryForm";

const Categories = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategoriesData());
  }, [dispatch]);

  return (
    <div>
      <AddCategoryForm />

      {categories.items.map((c) => {
        return <Category category={c} key={c._id} />;
      })}

      {categories.items.length === 0 && <h2>Categories Not Found</h2>}
    </div>
  );
};

export default Categories;
