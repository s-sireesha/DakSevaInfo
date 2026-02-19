// import { useEffect, useState } from "react";
// import API from "../api/axios";

// const Forms = () => {
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     API.get("/forms")
//       .then((res) => setCategories(res.data))
//       .catch((err) => console.log(err));
//   }, []);

//   return (
//     <div>
//       <h1>Forms</h1>
//       {categories.map((cat) => (
//         <div key={cat._id}>{cat.name}</div>
//       ))}
//     </div>
//   );
// };

// export default Forms;


import React from "react";

export default function Forms({
  activeCategory,
  selectedForm,
  showBuilder,
}) {
  return (
    <>
      <div className="breadcrumb">
        🏠 <span>Dashboard</span>
        <span className="sep">›</span>
        <span>{activeCategory}</span>
        <span className="sep">›</span>
        <span className="current">{selectedForm}</span>
      </div>

      <div className="section-label">Forms in this category</div>

      <div className="forms-grid">
        <div
          className="form-card"
          onClick={showBuilder}
          role="button"
          tabIndex={0}
        >
          <div className="form-card-icon">📋</div>
          <h3>{selectedForm}</h3>
          <p>Official form description goes here.</p>
        </div>
      </div>
    </>
  );
}
