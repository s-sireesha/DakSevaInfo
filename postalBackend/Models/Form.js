import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema({
  label: String,
  type: {
    type: String,
    enum: ["text", "number", "date", "textarea", "select"],
  },
  required: Boolean,
});

const formSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    formName: {
      type: String,
      required: true,
    },
    fields: [fieldSchema],
  },
  { timestamps: true }
);

const Form = mongoose.model("Form", formSchema);

export default Form;