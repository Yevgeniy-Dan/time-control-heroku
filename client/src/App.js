import React, { useEffect } from "react";
import axios from "axios";

function App() {
  const [categories, setCategories] = React.useState([]);

  useEffect(() => {
    axios
      .get("/admin/categories")
      .then((result) => {
        setCategories(result.data.categories);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h1>Your Categories</h1>
      <ul>
        {categories.length > 0 ? (
          categories.map((c) => {
            return (
              <li key={c._id}>
                <p>{c.title}</p>
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
