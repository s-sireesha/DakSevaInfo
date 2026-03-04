import mongoose from "mongoose";

const formSubmissionSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
    },
    userId: {
      type: String,
      ref: "User",
    },
    // filledData: {
    //   type: mongoose.Schema.Types.Mixed, // dynamic fields
    // },
    pdfUrl: String,
    content: String,
    filledData: [
    {
        name: String,
      label: String,
      type: String,
      required: Boolean,
    },
  ],
  },
  { timestamps: true }
);

const FormSubmission = mongoose.model(
  "FormSubmission",
  formSubmissionSchema
);

export default FormSubmission;