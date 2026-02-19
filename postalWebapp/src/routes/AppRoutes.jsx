import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Forms from "../pages/Forms";
import FormBuilder from "../pages/FormBuilder";
import FormSubmit from "../pages/FormSubmit";
import Documents from "../pages/Documents";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/categories" element={<Navigate to="/" replace />} />
      <Route path="/forms" element={<Forms />} />
      <Route path="/forms/new" element={<FormBuilder />} />
      <Route path="/forms/:id" element={<FormSubmit />} />
      <Route path="/documents" element={<Documents />} />
    </Routes>
  );
};

export default AppRoutes;
