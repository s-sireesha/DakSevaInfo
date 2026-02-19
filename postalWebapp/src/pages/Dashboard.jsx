import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/GovFormBuilder.css";
import logo from "../assets/logo.jpg"; 

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("Civil Registration");
  const [openCategories, setOpenCategories] = useState(["Civil Registration"]);
  const [selectedForm, setSelectedForm] = useState("Birth Certificate");
  const [selectedRow, setSelectedRow] = useState(0);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("Build");
  const [selectedIcon, setSelectedIcon] = useState("📋");
  const [formFields, setFormFields] = useState([
    { type: "TEXT", label: "Full Name of Child", required: true },
    { type: "DATE", label: "Date of Birth", required: true },
    { type: "RADIO", label: "Gender", required: true },
    { type: "TEXT", label: "Father's Full Name", required: true },
    { type: "TEXT", label: "Mother's Full Name", required: true },
    { type: "DROPDOWN", label: "Place of Birth (Hospital/Home)", required: false },
    { type: "FILE", label: "Hospital Discharge Certificate", required: true },
  ]);
  const builderPanelRef = useRef(null);

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
    setActiveCategory(name);
  };

  const handleCategoryClick = (e, name) => {
    if (e.target.closest(".form-item")) return;
    toggleCategory(name);
  };

  const addCategory = () => {
    setShowCategoryModal(false);
    showToastMsg("📂 Category created successfully!");
  };

  const createForm = () => {
    setShowFormModal(false);
    showToastMsg("📄 Form created! Opening builder...");
    navigate("/forms/new");
  };

  const openFormBuilder = () => {
    navigate("/forms/new");
  };

  const categories = [
    {
      name: "Civil Registration",
      icon: "📋",
      forms: [
        "Birth Certificate",
        "Death Certificate",
        "Marriage Registration",
        "Name Change Affidavit",
      ],
    },
    {
      name: "Land & Property",
      icon: "🏠",
      forms: [
        "Property Transfer",
        "Encumbrance Certificate",
        "Land Survey Request",
      ],
    },
    {
      name: "Business Licenses",
      icon: "💼",
      forms: [
        "Trade License Application",
        "GST Registration",
        "FSSAI License",
        "Renewal Request",
        "Closure Notice",
      ],
    },
  ];

  const allCategories = [
    ...categories,
    { name: "Education", icon: "🎓", forms: ["Scholarship Application", "Certificate Attestation"] },
    { name: "Health & Welfare", icon: "🏥", forms: ["Health Card Application", "Disability Certificate", "Ration Card Update"] },
  ];

  const removeField = (index) => {
    setFormFields((prev) => prev.filter((_, i) => i !== index));
    setSelectedRow((prev) => (prev >= index && prev > 0 ? prev - 1 : prev));
  };

  return (
    <div className="gov-app">
      {toast && (
        <div className="toast">{toast}</div>
      )}
      <div className="topbar">
        {/* <div className="topbar-emblem">🏛</div> */}
        {/* <div className="topbar-title">
          <h1>GovForm Builder</h1>
          <p>Official Documentation & Form Management Portal</p>
        </div> */}

            <div className="topbar-title">
                <img src={logo} alt="Postal Portal Logo" className="brand-logo" />
                <h2 className="brand-title">Postal Portal</h2>
              </div>
        <div className="topbar-actions">
          <button type="button" className="btn-ghost" onClick={() => showToastMsg("📁 Exported successfully")}>Export All</button>
          <button type="button" className="btn-primary" onClick={() => setShowCategoryModal(true)}>＋ New Category</button>
        </div>
      </div>

      {/* APP LAYOUT */}
      <div className="app-layout">
        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="sidebar-header">
            <span>Categories</span>
            <button type="button" className="add-cat-btn" onClick={() => setShowCategoryModal(true)}>+</button>
          </div>

          <div className="category-list">
            {allCategories.map((cat) => (
              <div
                key={cat.name}
                className={`cat-item ${activeCategory === cat.name ? "active" : ""} ${openCategories.includes(cat.name) ? "open" : ""}`}
                onClick={(e) => handleCategoryClick(e, cat.name)}
              >
                <div className="cat-header">
                  <div className="cat-icon">{cat.icon}</div>
                  <div className="cat-info">
                    <div className="cat-name">{cat.name}</div>
                    <div className="cat-count">{cat.forms.length} forms</div>
                  </div>
                  <div className="cat-toggle">▶</div>
                </div>
                <div className="forms-list">
                  {cat.forms.map((formName) => (
                    <div
                      key={formName}
                      className={`form-item ${selectedForm === formName ? "active" : ""}`}
                      onClick={(e) => { e.stopPropagation(); setSelectedForm(formName); }}
                    >
                      {formName}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="sidebar-footer">Gov. of India — Form Management System v2.1</div>
        </div>

        {/* MAIN */}
        <div className="main">
          <div className="breadcrumb">
            🏠 <span>Dashboard</span>
            <span className="sep">›</span>
            <span>{activeCategory}</span>
            <span className="sep">›</span>
            <span className="current">{selectedForm}</span>
          </div>

          <div className="main-inner">
            {/* Stats */}
            <div className="stats-bar">
              <div className="stat-box">
                <div className="stat-icon">📂</div>
                <div>
                  <div className="stat-value">5</div>
                  <div className="stat-label">Categories</div>
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-icon">📄</div>
                <div>
                  <div className="stat-value">17</div>
                  <div className="stat-label">Total Forms</div>
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-icon">✅</div>
                <div>
                  <div className="stat-value">12</div>
                  <div className="stat-label">Active</div>
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-icon">📝</div>
                <div>
                  <div className="stat-value">5</div>
                  <div className="stat-label">Drafts</div>
                </div>
              </div>
            </div>

            {/* Category Banner */}
            <div className="category-banner">
              <div className="category-banner-left">
                <h2>📋 {activeCategory}</h2>
                <p>Official forms for civil documentation including birth, death, and marriage records maintained by the Office of the Registrar General.</p>
                <div className="cat-meta">
                  <div className="meta-chip">📄 <strong>4</strong> Forms</div>
                  <div className="meta-chip">✅ <strong>3</strong> Active</div>
                  <div className="meta-chip">🕐 Updated <strong>12 Feb 2026</strong></div>
                </div>
              </div>
              <div className="category-banner-right">
                <button type="button" className="btn-action btn-outline" style={{ border: "1px solid #d5cec0" }} onClick={() => showToastMsg("✏️ Edit mode enabled")}>✏️ Edit Category</button>
                <button type="button" className="btn-action btn-navy" onClick={() => setShowFormModal(true)}>＋ Add Form</button>
              </div>
            </div>

            {/* Forms Grid */}
            <div className="section-label">Forms in this category</div>
            <div className="forms-grid">
              <div className="form-card" onClick={openFormBuilder} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && openFormBuilder()}>
                <div className="form-card-icon">📋</div>
                <h3>Birth Certificate Application</h3>
                <p>For registration of birth events and issuance of official birth certificate documents.</p>
                <div className="form-card-footer">
                  <span className="form-status status-active">● Active</span>
                  <span className="form-date">Modified: 10 Feb 2026</span>
                </div>
              </div>

              <div className="form-card" onClick={openFormBuilder} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && openFormBuilder()}>
                <div className="form-card-icon">🕊️</div>
                <h3>Death Certificate Request</h3>
                <p>Application for issuance of death certificate for deceased individuals registered in the state.</p>
                <div className="form-card-footer">
                  <span className="form-status status-active">● Active</span>
                  <span className="form-date">Modified: 8 Feb 2026</span>
                </div>
              </div>

              <div className="form-card" onClick={openFormBuilder} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && openFormBuilder()}>
                <div className="form-card-icon">💑</div>
                <h3>Marriage Registration</h3>
                <p>Formal registration of marriage under the Hindu Marriage Act or Special Marriage Act.</p>
                <div className="form-card-footer">
                  <span className="form-status status-draft">◑ Draft</span>
                  <span className="form-date">Modified: 1 Feb 2026</span>
                </div>
              </div>

              <div className="form-card" onClick={openFormBuilder} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && openFormBuilder()}>
                <div className="form-card-icon">📝</div>
                <h3>Name Change Affidavit</h3>
                <p>Notarized affidavit for official name change in government records and documents.</p>
                <div className="form-card-footer">
                  <span className="form-status status-active">● Active</span>
                  <span className="form-date">Modified: 5 Feb 2026</span>
                </div>
              </div>

              <div className="add-form-card" onClick={() => setShowFormModal(true)} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setShowFormModal(true)}>
                <div className="plus-circle">+</div>
                <span>Create New Form</span>
              </div>
            </div>

            {/* Form Builder */}
         
          </div>
        </div>
      </div>

      {/* ADD CATEGORY MODAL */}
      <div className={`modal-overlay ${showCategoryModal ? "open" : ""}`} onClick={(e) => e.target === e.currentTarget && setShowCategoryModal(false)}>
        <div className="modal">
          <div className="modal-header">
            <div>
              <h3>Add New Category</h3>
              <p>Create a new category to organise related forms</p>
            </div>
            <button type="button" className="modal-close" onClick={() => setShowCategoryModal(false)}>✕</button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label>CATEGORY NAME *</label>
              <input className="form-control" placeholder="e.g. Pension & Retirement" />
            </div>
            <div className="form-group">
              <label>DESCRIPTION</label>
              <textarea className="form-control" rows={3} placeholder="Brief description of what this category covers..." style={{ resize: "none" }} />
            </div>
            <div className="form-group">
              <label>DEPARTMENT / MINISTRY</label>
              <select className="form-control" style={{ cursor: "pointer" }}>
                <option>Ministry of Home Affairs</option>
                <option>Ministry of Finance</option>
                <option>Ministry of Health</option>
                <option>Ministry of Education</option>
                <option>Ministry of Agriculture</option>
                <option>State Government</option>
              </select>
            </div>
            <div className="form-group">
              <label>CHOOSE ICON</label>
              <div className="icon-grid">
                {["📋", "🏠", "💼", "🎓", "🏥", "🌾", "⚖️", "🛡", "🚆", "⚡", "💧", "🗳", "👮", "🏛", "🌐", "📊"].map((icon) => (
                  <div key={icon} className={`icon-opt ${selectedIcon === icon ? "selected" : ""}`} onClick={() => setSelectedIcon(icon)} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setSelectedIcon(icon)}>{icon}</div>
                ))}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={() => setShowCategoryModal(false)}>Cancel</button>
            <button type="button" className="btn-primary" onClick={addCategory}>Create Category</button>
          </div>
        </div>
      </div>

      {/* ADD FORM MODAL */}
      <div className={`modal-overlay ${showFormModal ? "open" : ""}`} onClick={(e) => e.target === e.currentTarget && setShowFormModal(false)}>
        <div className="modal">
          <div className="modal-header">
            <div>
              <h3>Create New Form</h3>
              <p>Add a new form under {activeCategory}</p>
            </div>
            <button type="button" className="modal-close" onClick={() => setShowFormModal(false)}>✕</button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label>FORM TITLE *</label>
              <input className="form-control" placeholder="e.g. Divorce Certificate Application" />
            </div>
            <div className="form-group">
              <label>FORM CODE</label>
              <input className="form-control" defaultValue="GOV-CIV-005" />
            </div>
            <div className="form-group">
              <label>DESCRIPTION</label>
              <textarea className="form-control" rows={3} placeholder="Purpose and usage of this form..." style={{ resize: "none" }} />
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
            <button type="button" className="btn-cancel" onClick={() => setShowFormModal(false)}>Cancel</button>
            <button type="button" className="btn-primary" onClick={createForm}>Create & Open Builder</button>
          </div>
        </div>
      </div>
    </div>
  );
}

