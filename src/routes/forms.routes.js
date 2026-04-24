const express = require("express");

const {
  getForms,
  getFormById
} = require("../services/form.service");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const forms = await getForms();
    res.json(forms);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const form = await getFormById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.json(form);
  } catch (error) {
    next(error);
  }
});

module.exports = router;