import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { DynamicField } from "./DynamicField";
import { useState, useEffect, useCallback, useRef } from "react";
import { getFormById, updateForm } from "../../services/postalApi";
import { Link, useParams } from "react-router-dom";
import "../../styles/GovFormBuilder.css";
import "../../styles/InlineFormEditor.css";

// Jotform-style field options: label shown in UI, type sent to backend
const ADD_FIELD_OPTIONS = [
  { label: "Full Name", type: "text", icon: "👤" },
  { label: "Email", type: "text", icon: "✉️" },
  { label: "Date", type: "date", icon: "📅" },
  { label: "Address", type: "textarea", icon: "📍" },
  { label: "Phone", type: "text", icon: "📞" },
  { label: "Short Text", type: "text", icon: "T" },
  { label: "Long Text", type: "textarea", icon: "¶" },
  { label: "Number", type: "number", icon: "#" },
  { label: "Dropdown", type: "select", icon: "▾" },
  { label: "Radio", type: "radio", icon: "◉" },
  { label: "File Upload", type: "file", icon: "📎" },
];

function buildInitialContent(formName, fields) {
  const intro = {
    type: "paragraph",
    content: [{ type: "text", text: "Here you can build a form dynamically. Type your text and use \"+ Add field\" to insert form fields inline." }],
  };
  const fieldNodes = (fields || []).map((f, i) => ({
    type: "paragraph",
    content: [
      {
        type: "dynamicField",
        attrs: {
          name: `field_${i}_${Date.now()}`,
          label: f.label || "Field",
          type: (f.type || "text").toLowerCase(),
          required: !!f.required,
        },
      },
    ],
  }));
  return {
    type: "doc",
    content: fieldNodes.length ? [intro, ...fieldNodes] : [intro],
  };
}

function extractFieldsFromDoc(doc) {
  if (!doc || !doc.content) return [];
  const fields = [];
  function walk(nodes) {
    if (!Array.isArray(nodes)) return;
    for (const node of nodes) {
      if (node.type === "dynamicField" && node.attrs) {
        fields.push({
          label: node.attrs.label || "Field",
          type: (node.attrs.type || "text").toLowerCase(),
          required: !!node.attrs.required,
        });
      }
      if (node.content) walk(node.content);
    }
  }
  walk(doc.content);
  return fields;
}

export default function RichFormBuilder({ formId: propFormId, formName: propFormName, initialFields, onSave, embedded }) {
  const { id: routeId } = useParams();
  const formId = propFormId || routeId;

  const [formName, setFormName] = useState(propFormName || "Untitled Form");
  const [loadedForm, setLoadedForm] = useState(null);
  const [loading, setLoading] = useState(
    embedded ? false : !!(formId && formId !== "new")
  );
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [addFieldOpen, setAddFieldOpen] = useState(false);
  const insertPosRef = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const editor = useEditor({
    extensions: [StarterKit, DynamicField],
    content: buildInitialContent(formName, initialFields || []),
    editorProps: {
      attributes: {
        class: "inline-form-editable",
        "data-placeholder": "Type here… Use \"+ Add field\" to insert a form field.",
      },
    },
  });

  const loadForm = useCallback(async (id) => {
    if (!id || id === "new") return;
    try {
      setLoading(true);
      const res = await getFormById(id);
      const form = res.data;
      setFormName(form.formName || "Untitled Form");
      setLoadedForm({ formName: form.formName, fields: form.fields || [] });
    } catch (err) {
      console.error(err);
      showToast("Failed to load form");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (formId && formId !== "new" && !initialFields && !propFormName) {
      loadForm(formId);
    }
    if (propFormName) setFormName(propFormName);
  }, [formId, propFormName]);

  useEffect(() => {
    if (editor && loadedForm) {
      try {
        const content = buildInitialContent(loadedForm.formName, loadedForm.fields);
        editor.commands.setContent(content);
      } catch (err) {
        console.error("Failed to set form content:", err);
        editor.commands.setContent({
          type: "doc",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Form content could not be loaded. You can add fields using + Add field." }] }],
        });
      }
      setLoadedForm(null);
    }
  }, [editor, loadedForm]);

  const insertFieldAtPos = (pos, type, label) => {
    if (!editor) return;
    const node = editor.state.doc.resolve(pos);
    const posToInsert = node.pos;
    editor
      .chain()
      .focus()
      .insertContentAt(posToInsert, {
        type: "dynamicField",
        attrs: {
          name: `field_${Date.now()}`,
          label: label || type,
          type: type.toLowerCase(),
          required: false,
        },
      })
      .run();
  };

  const openAddField = () => {
    if (editor) {
      insertPosRef.current = editor.state.selection.from;
    }
    setAddFieldOpen(true);
  };

  const onSelectField = (option) => {
    const pos = insertPosRef.current;
    if (editor && pos != null) {
      insertFieldAtPos(pos, option.type, option.label);
    } else if (editor) {
      editor.chain().focus().insertContent({
        type: "dynamicField",
        attrs: {
          name: `field_${Date.now()}`,
          label: option.label,
          type: option.type.toLowerCase(),
          required: false,
        },
      }).run();
    }
    setAddFieldOpen(false);
  };

  const handleSave = async () => {
    if (!editor) return;
    if (!formId || formId === "new") {
      showToast("Create a form from the Dashboard first.");
      return;
    }
    const doc = editor.getJSON();
    const fields = extractFieldsFromDoc(doc);
    try {
      setSaving(true);
      if (onSave) {
        onSave({ formName, fields });
      } else {
        await updateForm(formId, { formName, fields });
        showToast("Form saved.");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="gov-app inline-form-builder-wrap">
        <p className="inline-editor-loading">Loading form…</p>
      </div>
    );
  }

  if (!formId || formId === "new") {
    return (
      <div className="gov-app inline-form-builder-wrap">
        <div className="inline-editor-empty">
          <p>Create a form from the Dashboard first, then open it to use the inline editor.</p>
          <Link to="/" className="btn-action btn-navy">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="gov-app inline-form-builder-wrap">
      {toast && <div className="toast">{toast}</div>}
      {!embedded && (
        <div className="topbar">
          <div className="topbar-title">
            <Link to="/" className="back-link" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "inherit" }}>
              <span aria-hidden>←</span>
              <span>Dashboard</span>
            </Link>
          </div>
          <div className="topbar-actions">
            <span className="section-label" style={{ margin: 0 }}>Inline form builder</span>
          </div>
        </div>
      )}

      <div className="inline-form-editor-panel">
        <div className="inline-form-doc">
          <input
            type="text"
            className="inline-form-title-input"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Form title"
          />
          <p className="inline-form-description">
            Add instructions or description. Type in the box below and use <strong>+ Add field</strong> to insert form fields inline, like in a document.
          </p>

          {/* Inline toolbar: A + Add field ▼ (Jotform style) */}
          <div className="inline-form-toolbar">
            <span className="inline-toolbar-icon" title="Formatting">A</span>
            <div className="inline-toolbar-add-field">
              <button
                type="button"
                className="inline-toolbar-add-btn"
                onClick={openAddField}
                onMouseDown={(e) => { e.preventDefault(); if (editor) insertPosRef.current = editor.state.selection.from; }}
              >
                + Add field <span className="inline-toolbar-arrow">▼</span>
              </button>
              {addFieldOpen && (
                <>
                  <div className="inline-toolbar-dropdown-backdrop" onClick={() => setAddFieldOpen(false)} aria-hidden />
                  <div className="inline-toolbar-dropdown" role="listbox">
                    {ADD_FIELD_OPTIONS.map((opt) => (
                      <button
                        key={`${opt.type}-${opt.label}`}
                        type="button"
                        className="inline-toolbar-dropdown-item"
                        role="option"
                        onClick={() => onSelectField(opt)}
                      >
                        <span className="inline-toolbar-dropdown-icon">{opt.icon}</span>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Editable content block (blue-bordered area like screenshot) */}
          <div className="inline-form-content-wrap">
            <EditorContent editor={editor} />
          </div>

          <div className="inline-form-actions">
            <button type="button" className="btn-action btn-navy" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save form"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
