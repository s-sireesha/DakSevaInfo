import express from "express";
import multer from "multer";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  createForm,
  getForms,
  getFormById,
  submitForm,
  getSubmissionsByUser,
  uploadDocument,
  getDocuments,
  getDocumentsByCategory,
} from "../Controller/postalController.js";

const router = express.Router();

// Multer Setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });


// CATEGORY APIs
router.post("/api/categories", createCategory);
router.get("/api/getcategories", getCategories);
router.put("/api/categories/:id", updateCategory);
router.delete("/api/categories/:id", deleteCategory);


// FORM APIs
router.post("/api/forms", createForm);
router.get("/api/forms", getForms);
router.get("/api/forms/:id", getFormById);


// FORM SUBMISSION APIs
router.post("/api/forms/:id/submit", submitForm);
router.get("/api/submissions/:userId", getSubmissionsByUser);


// DOCUMENT APIs
router.post("/api/documents", upload.single("file"), uploadDocument);
router.get("/api/documents", getDocuments);
router.get("/api/documents/:categoryId", getDocumentsByCategory);

export default router;