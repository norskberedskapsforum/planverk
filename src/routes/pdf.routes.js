const express = require("express");
const { getFormById } = require("../services/form.service");
const { generatePdf } = require("../services/pdf.service");

const router = express.Router();

router.post("/:id", async (req, res, next) => {
  try {
    const form = await getFormById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    generatePdf(form, req.body, res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;