// import { useEffect, useState } from "react";
// import API from "../api/axios";

// const Categories = () => {
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     API.get("/categories")
//       .then((res) => setCategories(res.data))
//       .catch((err) => console.log(err));
//   }, []);

//   return (
//     <div>
//       <h1>Categories</h1>
//       {categories.map((cat) => (
//         <div key={cat._id}>{cat.name}</div>
//       ))}
//     </div>
//   );
// };

// export default Categories;


import React from "react";

export default function Categories({
  categories,
  activeCategory,
  setActiveCategory,
  openCategories,
  setOpenCategories,
  selectedForm,
  setSelectedForm,
}) {

  const toggleCategory = (name) => {
    if (openCategories.includes(name)) {
      setOpenCategories(openCategories.filter((c) => c !== name));
    } else {
      setOpenCategories([...openCategories, name]);
    }
    setActiveCategory(name);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span>Categories</span>
      </div>

      <div className="category-list">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className={`cat-item ${
              activeCategory === cat.name ? "active" : ""
            } ${openCategories.includes(cat.name) ? "open" : ""}`}
            onClick={() => toggleCategory(cat.name)}
          >
            <div className="cat-header">
              <div className="cat-icon">{cat.icon}</div>
              <div className="cat-info">
                <div className="cat-name">{cat.name}</div>
                <div className="cat-count">{cat.forms.length} forms</div>
              </div>
              <div className="cat-toggle">▶</div>
            </div>

            <div className="forms-list">
              {cat.forms.map((form) => (
                <div
                  key={form}
                  className={`form-item ${
                    selectedForm === form ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedForm(form);
                  }}
                >
                  {form}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
