import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getFormById } from "../services/postalApi";
import "../styles/GovFormBuilder.css";

/**
 * Page to view/fill a form. Route: /forms/:id
 */
export default function FormSubmit() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    getFormById(id)
      .then((res) => {
        setForm(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load form");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="gov-app" style={{ padding: 40 }}><p>Loading form...</p></div>;
  if (error) return <div className="gov-app" style={{ padding: 40 }}><p>{error}</p><Link to="/">Back to Dashboard</Link></div>;
  if (!form) return <div className="gov-app" style={{ padding: 40 }}><p>Form not found.</p><Link to="/">Back to Dashboard</Link></div>;

  return (
    <div className="gov-app" style={{ padding: 40 }}>
      <div style={{ marginBottom: 16 }}>
        <Link to="/" style={{ marginRight: 16 }}>← Dashboard</Link>
        <Link to={`/forms/${id}/build`}>Edit form (Builder)</Link>
      </div>
      <h1>{form.formName}</h1>
      <p>Form fill / submission UI can be added here. For now, use the Builder to edit the form.</p>
    </div>
  );
}
