import React, { useEffect, useRef, useState } from "react";

import api from "../../http";
import classes from "./Categories.module.css";
import Category from "../../models/category";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getCategories().then((categories) => {
      setCategories(categories);
    });
  }, []);

  const getCategories = async () => {
    const result = await api.get("/admin/categories");
    if (result.status === 200) {
      const categories = result.data.categories.map((c: Category) => {
        return {
          id: c._id,
          title: c.title,
        };
      });
      return categories;
    } else {
      return [];
    }
  };

  const addCategoryHandle = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await api.post("/admin/add-category", {
      title: titleRef.current!.value,
    });

    if (response.status === 200) {
      titleRef.current!.value = "";
      setCategories([
        ...categories,
        {
          _id: response.data._id,
          title: response.data.title,
        },
      ]);
    }
  };

  const deleteCategoryHandle = async (id: string) => {
    // event.preventDefault();

    const response = await api.post("/admin/delete-category", {
      categoryId: id,
    });

    if (response.status === 200) {
      const updateCategories = categories.filter(
        (c) => c._id !== response.data._id
      );
      setCategories(updateCategories);
    }
  };

  return (
    <div>
      <div className={classes.categoryContainer}>
        <form onSubmit={addCategoryHandle} method="post">
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Category Title
            </label>
            <input
              ref={titleRef}
              type="text"
              name="title"
              id="title"
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <button className="btn btn-warning" type="submit">
              Add Category
            </button>
          </div>
        </form>
      </div>

      <ul>
        {categories.length > 0 ? (
          categories.map((c) => {
            return (
              <li key={c._id}>
                <p>{c.title}</p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    deleteCategoryHandle(c._id);
                  }}
                  method="post"
                >
                  <input type="hidden" value={c._id} />
                  <button type="submit">Delete</button>
                </form>
              </li>
            );
          })
        ) : (
          <h2>Categories No Found!</h2>
        )}
      </ul>
    </div>
  );
};

export default Categories;
