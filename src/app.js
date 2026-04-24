const express = require("express");
const path = require("path");

const formsRoutes = require("./routes/forms.routes");
const pdfRoutes = require("./routes/pdf.routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../public")));

// Routes for forms API endpoints
app.use("/api/forms", formsRoutes);

// Routes for PDF generation API endpoints
app.use("/api/pdf", pdfRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = app;