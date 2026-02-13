import PDFDocument from "pdfkit";
import fs from "fs";

export const generatePDF = (data, filePath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    const referenceId = "POST-" + Date.now();

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Header
    doc
      .fontSize(16)
      .text("GOVERNMENT OF INDIA", { align: "center" })
      .fontSize(14)
      .text("Department of Posts", { align: "center" })
      .moveDown(2);

    // Form Title
    doc
      .fontSize(14)
      .text("POSTAL SERVICE APPLICATION FORM", {
        align: "center",
        underline: true,
      })
      .moveDown(2);

    // Horizontal Line
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown();

    // Applicant Details
    doc.fontSize(12).text("Applicant Details", { underline: true });
    doc.moveDown();

    Object.entries(data).forEach(([key, value]) => {
      doc.font("Helvetica-Bold").text(`${key}: `, { continued: true });
      doc.font("Helvetica").text(value);
      doc.moveDown(0.5);
    });

    doc.moveDown(2);

    // Declaration
    doc.font("Helvetica-Bold").text("Declaration:");
    doc.moveDown();
    doc.font("Helvetica").text(
      "I hereby declare that the above information provided is true and correct to the best of my knowledge."
    );

    doc.moveDown(3);

    // Signature Section
    doc.text("Signature: __________________________");
    doc.moveDown();
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.image("assets/postal-logo.png", 50, 45, { width: 60 });
    doc.moveDown(2);
    doc.text(`Reference No: ${referenceId}`);

    // Footer
    doc.fontSize(10).text(
      "This is a system generated document. No physical signature required.",
      { align: "center" }
    );

    doc.end();

    stream.on("finish", resolve);
    stream.on("error", reject);
  });
};
