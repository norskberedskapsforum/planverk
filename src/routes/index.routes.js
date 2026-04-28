const express = require("express");

const toolsRoutes = require("./tools.routes");
const commsPlanRoutes = require("./comms-plan.routes");

const router = express.Router();

/*
 Public pages
*/
router.use("/tools", toolsRoutes);

/*
 API
*/
router.use("/api/tools/comms-plan", commsPlanRoutes);

module.exports = router;
