import { useEffect, useState } from "react";
import API from "../api/axios";

const FormBuilder = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    API.get("/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h1>FormBuilder</h1>
      {categories.map((cat) => (
        <div key={cat._id}>{cat.name}</div>
      ))}
    </div>
  );
};

export default FormBuilder;
