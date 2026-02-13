import mongoose from "mongoose";

const formSubmissionSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    filledData: {
      type: mongoose.Schema.Types.Mixed, // dynamic fields
    },
    pdfUrl: String,
  },
  { timestamps: true }
);

const FormSubmission = mongoose.model(
  "FormSubmission",
  formSubmissionSchema
);

export default FormSubmission;
