import { Node, mergeAttributes } from "@tiptap/core";

export const DynamicField = Node.create({
  name: "dynamicField",
  group: "inline",
  inline: true,
  atom: true,

  addAttributes() {
    return {
      name: { default: null },
      label: { default: "Field" },
      type: { default: "text" },
      required: { default: false },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-dynamic-field]' }];
  },

  renderHTML({ HTMLAttributes }) {
    const name = HTMLAttributes.name;
    const label = HTMLAttributes.label || "Field";
    const type = (HTMLAttributes.type || "text").toLowerCase();
    const required = HTMLAttributes.required;
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-dynamic-field": name,
        "data-field-type": type,
        "data-required": required ? "true" : "false",
        contenteditable: "false",
        class: "inline-field-chip",
      }),
      ["span", { class: "inline-field-chip-label" }, label + (required ? " *" : "")],
    ];
  },
});
