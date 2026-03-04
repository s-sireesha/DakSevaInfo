import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/GovFormBuilder.css";
import logo from "../assets/logo.jpg";
import {
  getCategories,
  createCategory,
  getForms,
  createForm as createFormAPI,
} from "../services/postalApi";
import { useRole } from "../context/RoleContext";
import Categories from "./Categories";
import Forms from "./Forms";

export default function Dashboard() {
  const navigate = useNavigate();
  const { role, setRole, isAdmin } = useRole();

  const [categories, setCategories] = useState([]);
  const [forms, setForms] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [openCategories, setOpenCategories] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState("📋");
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const categoryForms =
    activeCategoryId
      ? forms.filter(
          (f) =>
            f.categoryId?._id === activeCategoryId ||
            f.categoryId === activeCategoryId
        )
      : [];
  const activeCategoryObj = categories.find((c) => c._id === activeCategoryId);

  const showToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const toggleCategory = (name) => {
    if (openCategories.includes(name)) {
      setOpenCategories(openCategories.filter((c) => c !== name));
    } else {
      setOpenCategories([...openCategories, name]);
    }
  };

  const handleCategoryClick = (e, cat) => {
    if (e.target.closest(".form-item")) return;
    setActiveCategory(cat.name);
    setActiveCategoryId(cat._id);
    toggleCategory(cat.name);
  };

  const addCategory = async () => {
    try {
      await createCategory({
        name: categoryName,
        description: categoryDescription,
      });
      showToastMsg("📂 Category created successfully!");
      setShowCategoryModal(false);
      setCategoryName("");
      setCategoryDescription("");
      fetchCategories();
    } catch (error) {
      console.error(error);
      showToastMsg("Failed to create category");
    }
  };

  const createFormHandler = async () => {
    try {
      const { data } = await createFormAPI({
        formName: formTitle,
        categoryId: activeCategoryId,
      });
      showToastMsg("📄 Form created! Opening builder...");
      setShowFormModal(false);
      setFormTitle("");
      setFormDescription("");
      fetchForms();
      navigate(`/forms/${data._id}/build`);
    } catch (error) {
      console.error(error);
      showToastMsg("Failed to create form");
    }
  };

  const openFormBuilder = (formId) => {
    if (formId) navigate(`/forms/${formId}/build`);
    else setShowFormModal(true);
  };

  const openFormFill = (formId) => {
    if (formId) navigate(`/forms/${formId}`);
  };

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchForms = async () => {
    try {
      const res = await getForms();
      setForms(res.data);
    } catch (error) {
      console.error("Error fetching forms:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchForms();
  }, []);

  useEffect(() => {
    if (categories.length > 0 && !activeCategoryId) {
      setActiveCategory(categories[0].name);
      setActiveCategoryId(categories[0]._id);
      setOpenCategories([categories[0].name]);
    }
  }, [categories]);

  const formatUpdated = () => {
    if (!categoryForms.length || !categoryForms.some((f) => f.updatedAt))
      return "—";
    return new Date(
      Math.max(...categoryForms.map((f) => new Date(f.updatedAt).getTime()))
    ).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="gov-app">
      {toast && <div className="toast">{toast}</div>}

      <div className="topbar">
        <div className="topbar-title">
          <img src={logo} alt="India Post - Dak Sewa, Jan Sewa" className="brand-logo" />
          <h2 className="brand-title">Postal Portal</h2>
        </div>
        <div className="topbar-actions">
          <div className="role-switcher">
            <span className="role-label">View as:</span>
            <button
              type="button"
              className={`btn-role ${role === "admin" ? "active" : ""}`}
              onClick={() => setRole("admin")}
            >
              Admin
            </button>
            <button
              type="button"
              className={`btn-role ${role === "client" ? "active" : ""}`}
              onClick={() => setRole("client")}
            >
              Client
            </button>
          </div>
          {isAdmin && (
            <>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => showToastMsg("📁 Exported successfully")}
              >
                Export All
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setShowCategoryModal(true)}
              >
                ＋ New Category
              </button>
            </>
          )}
        </div>
      </div>

      <div className="app-layout">
        <Categories
          categories={categories}
          forms={forms}
          activeCategory={activeCategory}
          openCategories={openCategories}
          selectedForm={selectedForm}
          onCategoryClick={handleCategoryClick}
          onFormSelect={setSelectedForm}
          onNewCategory={isAdmin ? () => setShowCategoryModal(true) : undefined}
        />

        <div className="main">
          <div className="breadcrumb">
            🏠 <span>Dashboard</span>
            {activeCategory && (
              <>
                <span className="sep">›</span>
                <span>{activeCategory}</span>
              </>
            )}
            {selectedForm && (
              <>
                <span className="sep">›</span>
                <span className="current">{selectedForm}</span>
              </>
            )}
          </div>

          <div className="main-inner">
            <div className="stats-bar">
              <div className="stat-box">
                <div className="stat-icon">📂</div>
                <div>
                  <div className="stat-value">{categories.length}</div>
                  <div className="stat-label">Categories</div>
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-icon">📄</div>
                <div>
                  <div className="stat-value">{forms.length}</div>
                  <div className="stat-label">Total Forms</div>
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-icon">✅</div>
                <div>
                  <div className="stat-value">{forms.length}</div>
                  <div className="stat-label">Active</div>
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-icon">📝</div>
                <div>
                  <div className="stat-value">{categoryForms.length}</div>
                  <div className="stat-label">In this category</div>
                </div>
              </div>
            </div>

            <div className="category-banner">
              <div className="category-banner-left">
                <h2>📋 {activeCategory || "Select a category"}</h2>
                <p>
                  {activeCategoryObj?.description ||
                    "Select a category from the sidebar to view its forms."}
                </p>
                <div className="cat-meta">
                  <div className="meta-chip">
                    📄 <strong>{categoryForms.length}</strong> Forms
                  </div>
                  <div className="meta-chip">
                    ✅ <strong>{categoryForms.length}</strong> Active
                  </div>
                  <div className="meta-chip">
                    🕐 Updated <strong>{formatUpdated()}</strong>
                  </div>
                </div>
              </div>
              <div className="category-banner-right">
                {isAdmin && (
                  <>
                    <button
                      type="button"
                      className="btn-action btn-outline"
                      style={{ border: "1px solid #d5cec0" }}
                      onClick={() => showToastMsg("✏️ Edit mode enabled")}
                    >
                      ✏️ Edit Category
                    </button>
                    <button
                      type="button"
                      className="btn-action btn-navy"
                      onClick={() => setShowFormModal(true)}
                      disabled={!activeCategoryId}
                    >
                      ＋ Add Form
                    </button>
                  </>
                )}
              </div>
            </div>

            <Forms
              activeCategory={activeCategory}
              categoryForms={categoryForms}
              onFormClick={isAdmin ? openFormBuilder : openFormFill}
              onAddForm={isAdmin ? () => setShowFormModal(true) : undefined}
            />
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      <div
        className={`modal-overlay ${showCategoryModal ? "open" : ""}`}
        onClick={(e) =>
          e.target === e.currentTarget && setShowCategoryModal(false)
        }
      >
        <div className="modal">
          <div className="modal-header">
            <div>
              <h3>Add New Category</h3>
              <p>Create a new category to organise related forms</p>
            </div>
            <button
              type="button"
              className="modal-close"
              onClick={() => setShowCategoryModal(false)}
            >
              ✕
            </button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label>CATEGORY NAME *</label>
              <input
                className="form-control"
                placeholder="e.g. Pension & Retirement"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>DESCRIPTION</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Brief description of what this category covers..."
                style={{ resize: "none" }}
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>CHOOSE ICON</label>
              <div className="icon-grid">
                {["📋", "🏠", "💼", "🎓", "🏥", "🌾", "⚖️", "🛡", "🚆", "⚡", "💧", "🗳", "👮", "🏛", "🌐", "📊"].map(
                  (icon) => (
                    <div
                      key={icon}
                      className={`icon-opt ${selectedIcon === icon ? "selected" : ""}`}
                      onClick={() => setSelectedIcon(icon)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === "Enter" && setSelectedIcon(icon)
                      }
                    >
                      {icon}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setShowCategoryModal(false)}
            >
              Cancel
            </button>
            <button type="button" className="btn-primary" onClick={addCategory}>
              Create Category
            </button>
          </div>
        </div>
      </div>

      {/* Add Form Modal */}
      <div
        className={`modal-overlay ${showFormModal ? "open" : ""}`}
        onClick={(e) =>
          e.target === e.currentTarget && setShowFormModal(false)
        }
      >
        <div className="modal">
          <div className="modal-header">
            <div>
              <h3>Create New Form</h3>
              <p>Add a new form under {activeCategory}</p>
            </div>
            <button
              type="button"
              className="modal-close"
              onClick={() => setShowFormModal(false)}
            >
              ✕
            </button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label>FORM TITLE *</label>
              <input
                className="form-control"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Birth Certificate Application"
              />
            </div>
            <div className="form-group">
              <label>FORM CODE</label>
              <input
                className="form-control"
                defaultValue="GOV-CIV-005"
                placeholder="Optional"
              />
            </div>
            <div className="form-group">
              <label>DESCRIPTION</label>
              <textarea
                className="form-control"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Brief description of this form..."
              />
            </div>
            <div className="form-group">
              <label>START FROM</label>
              <select className="form-control" style={{ cursor: "pointer" }}>
                <option>Blank form</option>
                <option>Copy from existing form</option>
                <option>Import from template</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setShowFormModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={createFormHandler}
            >
              Create Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
