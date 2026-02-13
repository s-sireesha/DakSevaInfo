import Category from "../models/Category.js";
import Form from "../models/Form.js";
import FormSubmission from "../Models/FormSubmission.js";
import Document from "../Models/ Document.js";
import path from "path";
import fs from "fs";
import { generatePDF } from "../Utils/generatePDF.js";


// ================= CATEGORY APIs =================

// Create Category
export const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Category
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Category
export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ================= FORM APIs =================

// Create Form
export const createForm = async (req, res) => {
  try {
    const form = await Form.create(req.body);
    res.status(201).json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Forms
export const getForms = async (req, res) => {
  try {
    const forms = await Form.find().populate("categoryId");
    res.json(forms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Form
export const getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ================= FORM SUBMISSION =================
export const submitForm = async (req, res) => {
  try {
    const { userId, filledData } = req.body;

    // Create PDF folder if not exists
    const pdfDir = "uploads/pdfs";
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    const fileName = `form-${Date.now()}.pdf`;
    const filePath = path.join(pdfDir, fileName);

    // Generate PDF
    await generatePDF(filledData, filePath);

    // Save submission in DB
    const submission = await FormSubmission.create({
      formId: req.params.id,
      userId,
      filledData,
      pdfUrl: `/uploads/pdfs/${fileName}`,
    });

    res.status(201).json({
      message: "Form submitted successfully",
      submission,
      downloadUrl: `/uploads/pdfs/${fileName}`,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get Submissions by User
export const getSubmissionsByUser = async (req, res) => {
  try {
    const submissions = await FormSubmission.find({
      userId: req.params.userId,
    }).populate("formId");

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ================= DOCUMENT APIs =================

// Upload Document
export const uploadDocument = async (req, res) => {
  try {
    const document = await Document.create({
      title: req.body.title,
      categoryId: req.body.categoryId,
      fileUrl: req.file.path,
    });

    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Documents
export const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find().populate("categoryId");
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Documents by Category
export const getDocumentsByCategory = async (req, res) => {
  try {
    const documents = await Document.find({
      categoryId: req.params.categoryId,
    });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
