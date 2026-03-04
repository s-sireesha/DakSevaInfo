import { Navigate, useParams } from "react-router-dom";
import { useRole } from "../context/RoleContext";

/**
 * Renders children only for admin. Clients are redirected.
 * For /forms/:id/build we send client to fill form /forms/:id.
 */
export default function AdminRoute({ children }) {
  const { isAdmin } = useRole();
  const { id } = useParams();

  if (isAdmin) return children;
  if (id) return <Navigate to={`/forms/${id}`} replace />;
  return <Navigate to="/" replace />;
}
