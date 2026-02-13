import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Categories from "../pages/Categories";
import Forms from "../pages/Forms";
import FormBuilder from "../pages/FormBuilder";
import FormSubmit from "../pages/FormSubmit";
import Documents from "../pages/Documents";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/forms" element={<Forms />} />
      <Route path="/forms/new" element={<FormBuilder />} />
      <Route path="/forms/:id" element={<FormSubmit />} />
      <Route path="/documents" element={<Documents />} />
    </Routes>
  );
};

export default AppRoutes;
