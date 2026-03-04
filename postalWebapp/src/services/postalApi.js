import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api", // change if needed
});

// CATEGORY APIs
export const getCategories = () => API.get("/getcategories");
export const createCategory = (data) => API.post("/categories", data);
export const updateCategory = (id, data) => API.put(`/categories/${id}`, data);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

// FORM APIs
export const getForms = () => API.get("/forms");
export const getFormById = (id) => API.get(`/forms/${id}`);
export const createForm = (data) => API.post("/forms", data);
export const updateForm = (id, data) => API.put(`/forms/${id}`, data);

// FORM SUBMISSION APIs
export const submitForm = (formId, data) => API.post(`/forms/${formId}/submit`, data);
export const getSubmissionsByUser = (userId) => API.get(`/submissions/${userId}`);

// DOCUMENT APIs
export const getDocuments = () => API.get("/documents");
export const getDocumentsByCategory = (categoryId) => API.get(`/documents/${categoryId}`);
export const uploadDocument = (formData) => API.post("/documents", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});

export default API;