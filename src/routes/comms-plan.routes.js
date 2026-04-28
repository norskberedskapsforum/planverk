const express = require("express");

const controller = require("../controllers/comms-plan.controller");

const router = express.Router();

/*
 Export documents
*/
router.post("/export/:type", controller.exportDocument);

/*
 Optional later:
 Save draft
*/
//router.post("/draft", controller.saveDraft);

/*
 Optional later:
 Validate input
*/
//router.post("/validate", controller.validateInput);

module.exports = router;
