const PDFDocument = require("pdfkit");

const path = require("path");

function generatePdf(form, data, res) {
  const doc = new PDFDocument({
    size: "A4",
    margin: 10,
    layout: "landscape",
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${form.id}.pdf"`);

  doc.pipe(res);

  //const logoPath = path.join(__dirname, "../../public/assets/logo.png");

  //doc.image(logoPath, 50, 35, {
  //  width: 40,
  //});

  //doc.fontSize(22).text(form.title, 100, 45);

  /*if (form.shortTitle) {
    doc.fontSize(11).text(form.shortTitle, 100, 70);
  }*/

  //doc.moveDown(4);

  // doc.fontSize(22).text(form.title, { align: "center" });

  /*if (form.shortTitle) {
    doc.moveDown(0.5);
    doc.fontSize(12).text(form.shortTitle, { align: "center" });
  }*/

  //doc.moveDown(4);

  doc.table({
    data: [
      ["Column 1", "Column 2", "Column 3"],
      ["One value goes here", "Another one here", "OK?"],
    ],
  });

  /*for (const field of form.fields) {
    renderField(doc, field, data[field.name]);
  }*/

  doc.end();
}

function renderField(doc, field, value) {
  doc.fontSize(13).text(field.label, { underline: true });
  doc.moveDown(0.3);

  if (field.type === "table") {
    renderTable(doc, field, value || []);
  } else {
    doc.fontSize(11).text(value || "-", {
      width: 500,
    });
  }

  doc.moveDown();
}

function renderTable(doc, field, rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    doc.fontSize(11).text("-");
    return;
  }

  for (const row of rows) {
    for (const column of field.columns) {
      doc.fontSize(10).text(`${column.label}: ${row[column.name] || "-"}`);
    }

    doc.moveDown(0.5);
  }
}

module.exports = {
  generatePdf,
};
