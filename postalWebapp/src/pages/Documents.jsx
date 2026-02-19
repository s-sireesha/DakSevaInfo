import { useEffect, useState } from "react";
import API from "../api/axios";

const Documents = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    API.get("/documents")
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h1>Documents</h1>
      {categories.map((cat) => (
        <div key={cat._id}>{cat.name}</div>
      ))}
    </div>
  );
};

export default Documents;
