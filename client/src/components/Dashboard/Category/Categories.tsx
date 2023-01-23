import Category from "./Category";
import AddCategoryForm from "./AddCategoryForm";
import { useAppSelector } from "../../../hooks/redux";

const Categories = () => {
  const categories = useAppSelector((state) => state.categories);

  return (
    <div>
      <AddCategoryForm />
      {categories.items.map((c) => {
        return <Category category={c} key={c._id} />;
      })}

      {categories.items.length === 0 && (
        <h2 className="text-center m-5">Categories Not Found</h2>
      )}
    </div>
  );
};

export default Categories;
