const express = require("express");
const path = require("path");

const router = express.Router();

router.get("/comms-plan", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../public/tools/comms-plan/index.html"),
  );
});

module.exports = router;
