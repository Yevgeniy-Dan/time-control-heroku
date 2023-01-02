import React, { useEffect, useRef, useState } from "react";
import api from "./http";

function App() {
  const [categories, setCategories] = useState([]);

  const titleRef = useRef(null);

  useEffect(() => {
    getCategories().then((categories) => {
      setCategories(categories);
    });
  }, []);

  const getCategories = async () => {
    const result = await api.get("/admin/categories");

    if (result.status === 200) {
      const categories = result.data.categories.map((c) => {
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

  const addCategoryHandle = async (event) => {
    event.preventDefault();

    const response = await api.post("/admin/add-category", {
      title: titleRef.current.value,
    });

    if (response.status === 200) {
      titleRef.current.value = "";
      setCategories([
        ...categories,
        {
          id: response.data._id,
          title: response.data.title,
        },
      ]);
    }
  };

  const deleteCategoryHandle = async (id) => {
    // event.preventDefault();

    const response = await api.post("/admin/delete-category", {
      categoryId: id,
    });

    if (response.status === 200) {
      const updateCategories = categories.filter(
        (c) => c.id !== response.data._id
      );
      setCategories(updateCategories);
    }
  };

  return (
    <div>
      <form onSubmit={addCategoryHandle} method="post">
        <div className="form-control">
          <label htmlFor="title">Category Title</label>
          <input ref={titleRef} type="text" name="title" id="title" />
          <button type="submit">Add Category</button>
        </div>
      </form>
      <h1>Your Categories</h1>
      <ul>
        {categories.length > 0 ? (
          categories.map((c) => {
            return (
              <li key={c.id}>
                <p>{c.title}</p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    deleteCategoryHandle(c.id);
                  }}
                  method="post"
                >
                  <input type="hidden" value={c.id} />
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
}

export default App;
