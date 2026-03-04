import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import FormBuilder from "../pages/FormBuilder";
import FormSubmit from "../pages/FormSubmit";
import Documents from "../pages/Documents";
import RichFormBuilder from "../components/editor/RichFormBuilder";
import AdminRoute from "../components/AdminRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/categories" element={<Navigate to="/" replace />} />
      <Route path="/forms" element={<Navigate to="/" replace />} />
      <Route
        path="/forms/new"
        element={
          <AdminRoute>
            <FormBuilder />
          </AdminRoute>
        }
      />
      <Route
        path="/forms/:id/build"
        element={
          <AdminRoute>
            <FormBuilder />
          </AdminRoute>
        }
      />
      <Route path="/forms/:id" element={<FormSubmit />} />
      <Route path="/documents" element={<Documents />} />
      <Route path="/jotform" element={<AdminRoute><RichFormBuilder /></AdminRoute>} />
      <Route path="/jotform/:id" element={<AdminRoute><RichFormBuilder /></AdminRoute>} />
    </Routes>
  );
};

export default AppRoutes;
