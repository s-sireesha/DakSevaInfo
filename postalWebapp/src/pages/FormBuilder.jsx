import { useEffect, useState, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getFormById, updateForm } from "../services/postalApi";
import RichFormBuilder from "../components/editor/RichFormBuilder";
import "../styles/GovFormBuilder.css";
import "../styles/InlineFormEditor.css";

// Field types matching backend enum: text, number, date, textarea, select, radio, file
const FIELD_PALETTE = [
  { label: "Text Input", type: "text", icon: "T" },
  { label: "Text Area", type: "textarea", icon: "¶" },
  { label: "Number", type: "number", icon: "#" },
  { label: "Date", type: "date", icon: "📅" },
  { label: "Dropdown", type: "select", icon: "▾" },
  { label: "Radio Group", type: "radio", icon: "◉" },
  { label: "File Upload", type: "file", icon: "📎" },
];

const DEFAULT_LABEL_BY_TYPE = {
  text: "Text field",
  textarea: "Long text",
  number: "Number",
  date: "Date",
  select: "Dropdown",
  radio: "Radio choice",
  file: "File upload",
};

function FormBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [formName, setFormName] = useState("");
  const [formFields, setFormFields] = useState([]);
  const [selectedRow, setSelectedRow] = useState(-1);
  const [activeTab, setActiveTab] = useState("Write");
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  const [writeTabKey, setWriteTabKey] = useState(0);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadForm = useCallback(async (formId) => {
    try {
      setLoading(true);
      const res = await getFormById(formId);
      const form = res.data;
      setFormName(form.formName || "Untitled Form");
      setFormFields(Array.isArray(form.fields) && form.fields.length > 0
        ? form.fields.map((f) => ({
            label: f.label || "Field",
            type: (f.type || "text").toLowerCase(),
            required: !!f.required,
          }))
        : []);
      setSelectedRow(-1);
    } catch (err) {
      console.error(err);
      showToast("Failed to load form");
      navigate("/");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (id && id !== "new") {
      loadForm(id);
    } else if (id === "new" || !id) {
      setLoading(false);
      setFormName("New Form");
      setFormFields([]);
    }
  }, [id, loadForm]);

  const addField = (type) => {
    const label = DEFAULT_LABEL_BY_TYPE[type] || "New field";
    const newField = { label, type, required: false };
    setFormFields((prev) => [...prev, newField]);
    setSelectedRow(formFields.length);
  };

  const removeField = (index) => {
    setFormFields((prev) => prev.filter((_, i) => i !== index));
    setSelectedRow((prev) => (prev >= index && prev > 0 ? prev - 1 : prev === index ? -1 : prev));
  };

  const moveField = (index, direction) => {
    if (direction === "up" && index <= 0) return;
    if (direction === "down" && index >= formFields.length - 1) return;
    const next = [...formFields];
    const j = direction === "up" ? index - 1 : index + 1;
    [next[index], next[j]] = [next[j], next[index]];
    setFormFields(next);
    setSelectedRow(j);
  };

  const duplicateField = (index) => {
    const field = formFields[index];
    const copy = { ...field, label: `${field.label} (copy)` };
    setFormFields((prev) => [...prev.slice(0, index + 1), copy, ...prev.slice(index + 1)]);
    setSelectedRow(index + 1);
  };

  const updateField = (index, updates) => {
    setFormFields((prev) =>
      prev.map((f, i) => (i === index ? { ...f, ...updates } : f))
    );
  };

  const handleSaveDraft = async () => {
    if (!id || id === "new") {
      showToast("Save from Dashboard: create a form first.");
      return;
    }
    try {
      setSaving(true);
      await updateForm(id, { formName, fields: formFields });
      showToast("💾 Draft saved");
    } catch (err) {
      console.error(err);
      showToast("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleInlineSave = async ({ formName: name, fields }) => {
    if (!id || id === "new") return;
    setFormName(name);
    setFormFields(fields);
    setWriteTabKey((k) => k + 1);
    try {
      setSaving(true);
      await updateForm(id, { formName: name, fields });
      showToast("💾 Form saved");
    } catch (err) {
      console.error(err);
      showToast("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const selectedField = selectedRow >= 0 && formFields[selectedRow] ? formFields[selectedRow] : null;

  if (loading) {
    return (
      <div className="gov-app" style={{ padding: 40, textAlign: "center" }}>
        <p>Loading form...</p>
      </div>
    );
  }

  if (!id || id === "new") {
    return (
      <div className="gov-app" style={{ padding: 40, textAlign: "center" }}>
        <p>Create a form from the Dashboard first, then you can build it here.</p>
        <Link to="/">Go to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="gov-app">
      {toast && <div className="toast">{toast}</div>}
      <div className="topbar">
        <div className="topbar-title">
          <Link
            to="/"
            className="back-link"
            style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "inherit" }}
          >
            <span aria-hidden>←</span>
            <span>Dashboard</span>
          </Link>
        </div>
        <div className="topbar-actions">
          <span className="section-label" style={{ margin: 0 }}>
            Form Builder — {formName}
          </span>
        </div>
      </div>

      <div className="builder-panel">
        <div className="builder-tabs">
          {["Write", "Build", "Preview", "Settings", "Logic"].map((tab, i) => (
            <div
              key={tab}
              className={`builder-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setActiveTab(tab)}
            >
              {["✎", "🔧", "👁", "⚙️", "🔗"][i]} {tab}
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 16px" }}>
            <button
              type="button"
              className="btn-action btn-outline"
              style={{ border: "1px solid #d5cec0", padding: "7px 14px", fontSize: "12px" }}
              onClick={handleSaveDraft}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save Draft"}
            </button>
            <button
              type="button"
              className="btn-action btn-navy"
              style={{ padding: "7px 14px", fontSize: "12px" }}
              onClick={() => showToast("🚀 Form published successfully!")}
            >
              Publish
            </button>
          </div>
        </div>

        <div className="builder-body">
          {activeTab === "Write" ? (
            <div className="form-canvas" style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
              <RichFormBuilder
                key={writeTabKey}
                formId={id}
                formName={formName}
                initialFields={formFields}
                onSave={handleInlineSave}
                embedded
              />
            </div>
          ) : (
            <>
          {/* Field palette */}
          <div className="field-palette">
            <div className="palette-label">Add fields</div>
            {FIELD_PALETTE.map((item) => (
              <div
                key={item.type}
                className="field-chip"
                onClick={() => addField(item.type)}
                onKeyDown={(e) => e.key === "Enter" && addField(item.type)}
                role="button"
                tabIndex={0}
                title={`Add ${item.label}`}
              >
                <span className="field-chip-icon">{item.icon}</span> {item.label}
              </div>
            ))}
          </div>

          {/* Canvas */}
          <div className="form-canvas">
            <div className="canvas-form-title">
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="canvas-form-title-input"
                placeholder="Form title"
              />
              <span>Form ID: {id}</span>
            </div>

            {formFields.map((field, index) => (
              <div
                key={`${field.label}-${index}`}
                className={`form-field-row ${selectedRow === index ? "selected" : ""}`}
                onClick={() => setSelectedRow(index)}
              >
                <span className="field-drag-handle">⠿</span>
                <span className="field-type-badge">{field.type}</span>
                <span className="field-label">{field.label}</span>
                <span
                  className="field-required"
                  style={!field.required ? { color: "transparent" } : undefined}
                >
                  *
                </span>
                <div className="field-actions">
                  <button
                    type="button"
                    className="field-btn"
                    title="Move up"
                    onClick={(e) => { e.stopPropagation(); moveField(index, "up"); }}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="field-btn"
                    title="Move down"
                    onClick={(e) => { e.stopPropagation(); moveField(index, "down"); }}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="field-btn"
                    title="Duplicate"
                    onClick={(e) => { e.stopPropagation(); duplicateField(index); }}
                  >
                    ⧉
                  </button>
                  <button
                    type="button"
                    className="field-btn"
                    title="Delete"
                    onClick={(e) => { e.stopPropagation(); removeField(index); }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            <div className="drop-zone">
              ⊕ Click a field type on the left to add it here
            </div>
          </div>

          {/* Properties panel */}
          <div className="props-panel">
            <div className="props-label">Field properties</div>
            {selectedField ? (
              <>
                <div className="prop-row">
                  <label>Field label</label>
                  <input
                    className="prop-input"
                    value={selectedField.label}
                    onChange={(e) => updateField(selectedRow, { label: e.target.value })}
                  />
                </div>
                <div className="prop-row">
                  <label>Type</label>
                  <input className="prop-input" value={selectedField.type} readOnly />
                </div>
                <div style={{ height: 1, background: "var(--border)", margin: "14px 0" }} />
                <div className="toggle-row">
                  <span>Required</span>
                  <div
                    className={`toggle ${selectedField.required ? "on" : ""}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => updateField(selectedRow, { required: !selectedField.required })}
                    onKeyDown={(e) => e.key === "Enter" && updateField(selectedRow, { required: !selectedField.required })}
                    aria-pressed={selectedField.required}
                  />
                </div>
              </>
            ) : (
              <p className="prop-hint">Select a field to edit its properties.</p>
            )}
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default FormBuilder;
