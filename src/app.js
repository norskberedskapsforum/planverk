const express = require("express");
const path = require("path");

const routes = require("./routes/index.routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../public")));

app.use(routes);

app.get("/", (req, res) => {
  res.redirect("/tools/comms-plan");
});

module.exports = app;
