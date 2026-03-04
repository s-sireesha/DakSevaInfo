import React from "react";
import "../styles/GovFormBuilder.css";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Forms grid for the current category. Used by Dashboard.
 * Expects: activeCategory, categoryForms (from API), onFormClick(formId), onAddForm().
 */
export default function Forms({
  activeCategory,
  categoryForms,
  onFormClick,
  onAddForm,
}) {
  return (
    <>
      <div className="section-label">Forms in this category</div>
      <div className="forms-grid">
        {(categoryForms || []).map((form) => (
          <div
            key={form._id}
            className="form-card"
            onClick={() => onFormClick(form._id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onFormClick(form._id)}
          >
            <div className="form-card-icon">📋</div>
            <h3>{form.formName}</h3>
            <p>{form.description || `Form under ${activeCategory}`}</p>
            <div className="form-card-footer">
              <span className="form-status status-active">● Active</span>
              <span className="form-date">
                Modified: {formatDate(form.updatedAt)}
              </span>
            </div>
          </div>
        ))}

        {onAddForm && (
        <div
          className="add-form-card"
          onClick={onAddForm}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onAddForm()}
        >
          <div className="plus-circle">+</div>
          <span>Create New Form</span>
        </div>
        )}
      </div>
    </>
  );
}
