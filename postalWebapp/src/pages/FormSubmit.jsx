import { useEffect, useState } from "react";
import API from "../api/axios";

const FormSubmit = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    API.get("/forms/:id")
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h1>FormSubmit</h1>
      {categories.map((cat) => (
        <div key={cat._id}>{cat.name}</div>
      ))}
    </div>
  );
};

export default FormSubmit;
