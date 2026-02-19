import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import "../styles/GovFormBuilder.css";

const FormBuilder = () => {
  const [categories, setCategories] = useState([]);
    const [selectedForm, setSelectedForm] = useState("Birth Certificate");
    const [selectedRow, setSelectedRow] = useState(0);
      const [toast, setToast] = useState(null);
        const [activeTab, setActiveTab] = useState("Build");
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
  useEffect(() => {
    API.get("/forms/new")
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));
  }, []);

    const removeField = (index) => {
    setFormFields((prev) => prev.filter((_, i) => i !== index));
    setSelectedRow((prev) => (prev >= index && prev > 0 ? prev - 1 : prev));
  };


  return (
    <div className="gov-app">
      <div className="topbar">
        <div className="topbar-title">
          <Link to="/" className="back-link" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "inherit" }}>
            <span aria-hidden>←</span>
            <span>Dashboard</span>
          </Link>
        </div>
        <div className="topbar-actions">
          <span className="section-label" style={{ margin: 0 }}>Form Builder — {selectedForm}</span>
        </div>
      </div>
      <div className="builder-panel" ref={builderPanelRef}>
             <div className="builder-tabs">
              {["Build", "Preview", "Settings", "Logic"].map((tab, i) => (
                  <div
                    key={tab}
                    className={`builder-tab ${activeTab === tab ? "active" : ""}`}
                    onClick={() => setActiveTab(tab)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setActiveTab(tab)}
                  >
                    {["🔧", "👁", "⚙️", "🔗"][i]} {tab}
                  </div>
                ))}
                <div style={{ flex: 1 }} />
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 16px" }}>
                  <button type="button" className="btn-action btn-outline" style={{ border: "1px solid #d5cec0", padding: "7px 14px", fontSize: "12px" }} onClick={() => showToastMsg("💾 Draft saved")}>Save Draft</button>
                  <button type="button" className="btn-action btn-navy" style={{ padding: "7px 14px", fontSize: "12px" }} onClick={() => showToastMsg("🚀 Form published successfully!")}>Publish</button>
                </div>
              </div>

              <div className="builder-body">
                {/* Field palette */}
                <div className="field-palette">
                  <div className="palette-label">Basic</div>
                  <div className="field-chip" title="Drag to add">
                    <span className="field-chip-icon">T</span> Text Input
                  </div>
                  <div className="field-chip">
                    <span className="field-chip-icon">¶</span> Text Area
                  </div>
                  <div className="field-chip">
                    <span className="field-chip-icon">#</span> Number
                  </div>
                  <div className="field-chip">
                    <span className="field-chip-icon">📅</span> Date
                  </div>
                  <div className="field-chip">
                    <span className="field-chip-icon">📧</span> Email
                  </div>
                  <div className="field-chip">
                    <span className="field-chip-icon">📞</span> Phone
                  </div>

                  <div className="palette-label">Selection</div>
                  <div className="field-chip">
                    <span className="field-chip-icon">▾</span> Dropdown
                  </div>
                  <div className="field-chip">
                    <span className="field-chip-icon">◉</span> Radio Group
                  </div>
                  <div className="field-chip">
                    <span className="field-chip-icon">☑</span> Checkbox
                  </div>

                  <div className="palette-label">Advanced</div>
                  <div className="field-chip">
                    <span className="field-chip-icon">📎</span> File Upload
                  </div>
                  <div className="field-chip">
                    <span className="field-chip-icon">✍</span> Signature
                  </div>
                  <div className="field-chip">
                    <span className="field-chip-icon">—</span> Divider
                  </div>
                  <div className="field-chip">
                    <span className="field-chip-icon">ℹ</span> Info Block
                  </div>
                </div>

                {/* Canvas */}
                <div className="form-canvas">
                  <div className="canvas-form-title">
                    {selectedForm}
                    <span>Form ID: GOV-CIV-001</span>
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
                      <span className="field-required" style={!field.required ? { color: "transparent" } : undefined}>*</span>
                      <div className="field-actions">
                        <button type="button" className="field-btn" title="Move up">↑</button>
                        <button type="button" className="field-btn" title="Move down">↓</button>
                        <button type="button" className="field-btn" title="Duplicate">⧉</button>
                        <button type="button" className="field-btn" title="Delete" onClick={(e) => { e.stopPropagation(); removeField(index); }}>✕</button>
                      </div>
                    </div>
                  ))}

                  <div className="drop-zone">⊕ Drag a field here or click a field type from the left panel</div>
                </div>

                {/* Properties panel */}
                <div className="props-panel">
                  <div className="props-label">Field Properties</div>

                  <div className="prop-row">
                    <label>Field Label</label>
                    <input className="prop-input" defaultValue="Full Name of Child" readOnly={false} />
                  </div>

                  <div className="prop-row">
                    <label>Placeholder Text</label>
                    <input className="prop-input" defaultValue="Enter full name as per Aadhaar" readOnly={false} />
                  </div>

                  <div className="prop-row">
                    <label>Help Text</label>
                    <input className="prop-input" defaultValue="Name should match hospital records" readOnly={false} />
                  </div>

                  <div className="prop-row">
                    <label>Max Length</label>
                    <input className="prop-input" type="number" defaultValue={100} readOnly={false} />
                  </div>

                  <div style={{ height: 1, background: "var(--border)", margin: "14px 0" }} />

                  <div className="toggle-row">
                    <span>Required</span>
                    <div className="toggle on" role="button" tabIndex={0} onClick={(e) => e.currentTarget.classList.toggle("on")} onKeyDown={(e) => e.key === "Enter" && e.currentTarget.classList.toggle("on")} />
                  </div>
                  <div className="toggle-row">
                    <span>Read Only</span>
                    <div className="toggle" role="button" tabIndex={0} onClick={(e) => e.currentTarget.classList.toggle("on")} onKeyDown={(e) => e.key === "Enter" && e.currentTarget.classList.toggle("on")} />
                  </div>
                  <div className="toggle-row">
                    <span>Hidden</span>
                    <div className="toggle" role="button" tabIndex={0} onClick={(e) => e.currentTarget.classList.toggle("on")} onKeyDown={(e) => e.key === "Enter" && e.currentTarget.classList.toggle("on")} />
                  </div>
                  <div className="toggle-row">
                    <span>Print Visible</span>
                    <div className="toggle on" role="button" tabIndex={0} onClick={(e) => e.currentTarget.classList.toggle("on")} onKeyDown={(e) => e.key === "Enter" && e.currentTarget.classList.toggle("on")} />
                  </div>

                  <div style={{ height: 1, background: "var(--border)", margin: "14px 0" }} />

                  <div className="prop-row">
                    <label>Validation Pattern</label>
                    <input className="prop-input" defaultValue="[A-Za-z\\s]+" readOnly={false} />
                  </div>
                </div>
              </div>
            </div>
      </div>
  );
};

export default FormBuilder;


// import React, { forwardRef } from "react";

// const FormBuilder = forwardRef(({
//   selectedForm,
//   formFields,
//   setFormFields,
//   selectedRow,
//   setSelectedRow,
//   activeTab,
//   setActiveTab,
// }, ref) => {

//   const removeField = (index) => {
//     setFormFields((prev) => prev.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="builder-panel" ref={ref}>
//       <div className="builder-tabs">
//         {["Build", "Preview", "Settings", "Logic"].map((tab) => (
//           <div
//             key={tab}
//             className={`builder-tab ${activeTab === tab ? "active" : ""}`}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab}
//           </div>
//         ))}
//       </div>

//       <div className="form-canvas">
//         <div className="canvas-form-title">
//           {selectedForm}
//         </div>

//         {formFields.map((field, index) => (
//           <div
//             key={index}
//             className={`form-field-row ${
//               selectedRow === index ? "selected" : ""
//             }`}
//             onClick={() => setSelectedRow(index)}
//           >
//             <span>{field.type}</span>
//             <span>{field.label}</span>
//             <button onClick={() => removeField(index)}>✕</button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// });

// export default FormBuilder;




  //  <div className="section-label">Form Builder — {selectedForm}</div>
  //           <div className="builder-panel" ref={builderPanelRef}>
  //             <div className="builder-tabs">
  //               {["Build", "Preview", "Settings", "Logic"].map((tab, i) => (
  //                 <div
  //                   key={tab}
  //                   className={`builder-tab ${activeTab === tab ? "active" : ""}`}
  //                   onClick={() => setActiveTab(tab)}
  //                   role="button"
  //                   tabIndex={0}
  //                   onKeyDown={(e) => e.key === "Enter" && setActiveTab(tab)}
  //                 >
  //                   {["🔧", "👁", "⚙️", "🔗"][i]} {tab}
  //                 </div>
  //               ))}
  //               <div style={{ flex: 1 }} />
  //               <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 16px" }}>
  //                 <button type="button" className="btn-action btn-outline" style={{ border: "1px solid #d5cec0", padding: "7px 14px", fontSize: "12px" }} onClick={() => showToastMsg("💾 Draft saved")}>Save Draft</button>
  //                 <button type="button" className="btn-action btn-navy" style={{ padding: "7px 14px", fontSize: "12px" }} onClick={() => showToastMsg("🚀 Form published successfully!")}>Publish</button>
  //               </div>
  //             </div>

  //             <div className="builder-body">
  //               {/* Field palette */}
  //               <div className="field-palette">
  //                 <div className="palette-label">Basic</div>
  //                 <div className="field-chip" title="Drag to add">
  //                   <span className="field-chip-icon">T</span> Text Input
  //                 </div>
  //                 <div className="field-chip">
  //                   <span className="field-chip-icon">¶</span> Text Area
  //                 </div>
  //                 <div className="field-chip">
  //                   <span className="field-chip-icon">#</span> Number
  //                 </div>
  //                 <div className="field-chip">
  //                   <span className="field-chip-icon">📅</span> Date
  //                 </div>
  //                 <div className="field-chip">
  //                   <span className="field-chip-icon">📧</span> Email
  //                 </div>
  //                 <div className="field-chip">
  //                   <span className="field-chip-icon">📞</span> Phone
  //                 </div>

  //                 <div className="palette-label">Selection</div>
  //                 <div className="field-chip">
  //                   <span className="field-chip-icon">▾</span> Dropdown
  //                 </div>
  //                 <div className="field-chip">
  //                   <span className="field-chip-icon">◉</span> Radio Group
  //                 </div>
  //                 <div className="field-chip">
  //                   <span className="field-chip-icon">☑</span> Checkbox
  //                 </div>

  //                 <div className="palette-label">Advanced</div>
  //                 <div className="field-chip">
  //                   <span className="field-chip-icon">📎</span> File Upload
  //                 </div>
  //                 <div className="field-chip">
  //                   <span className="field-chip-icon">✍</span> Signature
  //                 </div>
  //                 <div className="field-chip">
  //                   <span className="field-chip-icon">—</span> Divider
  //                 </div>
  //                 <div className="field-chip">
  //                   <span className="field-chip-icon">ℹ</span> Info Block
  //                 </div>
  //               </div>

  //               {/* Canvas */}
  //               <div className="form-canvas">
  //                 <div className="canvas-form-title">
  //                   {selectedForm}
  //                   <span>Form ID: GOV-CIV-001</span>
  //                 </div>

  //                 {formFields.map((field, index) => (
  //                   <div
  //                     key={`${field.label}-${index}`}
  //                     className={`form-field-row ${selectedRow === index ? "selected" : ""}`}
  //                     onClick={() => setSelectedRow(index)}
  //                   >
  //                     <span className="field-drag-handle">⠿</span>
  //                     <span className="field-type-badge">{field.type}</span>
  //                     <span className="field-label">{field.label}</span>
  //                     <span className="field-required" style={!field.required ? { color: "transparent" } : undefined}>*</span>
  //                     <div className="field-actions">
  //                       <button type="button" className="field-btn" title="Move up">↑</button>
  //                       <button type="button" className="field-btn" title="Move down">↓</button>
  //                       <button type="button" className="field-btn" title="Duplicate">⧉</button>
  //                       <button type="button" className="field-btn" title="Delete" onClick={(e) => { e.stopPropagation(); removeField(index); }}>✕</button>
  //                     </div>
  //                   </div>
  //                 ))}

  //                 <div className="drop-zone">⊕ Drag a field here or click a field type from the left panel</div>
  //               </div>

  //               {/* Properties panel */}
  //               <div className="props-panel">
  //                 <div className="props-label">Field Properties</div>

  //                 <div className="prop-row">
  //                   <label>Field Label</label>
  //                   <input className="prop-input" defaultValue="Full Name of Child" readOnly={false} />
  //                 </div>

  //                 <div className="prop-row">
  //                   <label>Placeholder Text</label>
  //                   <input className="prop-input" defaultValue="Enter full name as per Aadhaar" readOnly={false} />
  //                 </div>

  //                 <div className="prop-row">
  //                   <label>Help Text</label>
  //                   <input className="prop-input" defaultValue="Name should match hospital records" readOnly={false} />
  //                 </div>

  //                 <div className="prop-row">
  //                   <label>Max Length</label>
  //                   <input className="prop-input" type="number" defaultValue={100} readOnly={false} />
  //                 </div>

  //                 <div style={{ height: 1, background: "var(--border)", margin: "14px 0" }} />

  //                 <div className="toggle-row">
  //                   <span>Required</span>
  //                   <div className="toggle on" role="button" tabIndex={0} onClick={(e) => e.currentTarget.classList.toggle("on")} onKeyDown={(e) => e.key === "Enter" && e.currentTarget.classList.toggle("on")} />
  //                 </div>
  //                 <div className="toggle-row">
  //                   <span>Read Only</span>
  //                   <div className="toggle" role="button" tabIndex={0} onClick={(e) => e.currentTarget.classList.toggle("on")} onKeyDown={(e) => e.key === "Enter" && e.currentTarget.classList.toggle("on")} />
  //                 </div>
  //                 <div className="toggle-row">
  //                   <span>Hidden</span>
  //                   <div className="toggle" role="button" tabIndex={0} onClick={(e) => e.currentTarget.classList.toggle("on")} onKeyDown={(e) => e.key === "Enter" && e.currentTarget.classList.toggle("on")} />
  //                 </div>
  //                 <div className="toggle-row">
  //                   <span>Print Visible</span>
  //                   <div className="toggle on" role="button" tabIndex={0} onClick={(e) => e.currentTarget.classList.toggle("on")} onKeyDown={(e) => e.key === "Enter" && e.currentTarget.classList.toggle("on")} />
  //                 </div>

  //                 <div style={{ height: 1, background: "var(--border)", margin: "14px 0" }} />

  //                 <div className="prop-row">
  //                   <label>Validation Pattern</label>
  //                   <input className="prop-input" defaultValue="[A-Za-z\\s]+" readOnly={false} />
  //                 </div>
  //               </div>
  //             </div>
  //           </div>