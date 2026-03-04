import React from "react";
import "../styles/GovFormBuilder.css";

/**
 * Sidebar listing categories and their forms. Used by Dashboard.
 * Expects API data: categories (from getCategories), forms (from getForms).
 */
export default function Categories({
  categories,
  forms,
  activeCategory,
  openCategories,
  selectedForm,
  onCategoryClick,
  onFormSelect,
  onNewCategory,
}) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span>Categories</span>
        {onNewCategory && (
          <button type="button" className="add-cat-btn" onClick={onNewCategory}>
            +
          </button>
        )}
      </div>

      <div className="category-list">
        {categories.map((cat) => {
          const categoryFormsList = forms.filter(
            (form) =>
              form.categoryId?._id === cat._id || form.categoryId === cat._id
          );

          return (
            <div
              key={cat._id}
              className={`cat-item ${activeCategory === cat.name ? "active" : ""} ${openCategories.includes(cat.name) ? "open" : ""}`}
              onClick={(e) => onCategoryClick(e, cat)}
            >
              <div className="cat-header">
                <div className="cat-icon">{cat.icon || "📋"}</div>
                <div className="cat-info">
                  <div className="cat-name">{cat.name}</div>
                  <div className="cat-count">{categoryFormsList.length} forms</div>
                </div>
                <div className="cat-toggle">▶</div>
              </div>
              <div className="forms-list">
                {categoryFormsList.map((form) => (
                  <div
                    key={form._id}
                    className={`form-item ${selectedForm === form.formName ? "active" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onFormSelect(form.formName);
                    }}
                  >
                    {form.formName}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="sidebar-footer">
        Gov. of India — Form Management System v2.1
      </div>
    </div>
  );
}
