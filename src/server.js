require("dotenv").config();

const app = require("./app");

const packageJson = require("../package.json");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Planverk v${packageJson.version} running on http://localhost:${PORT}`);
});