const fs = require("fs/promises");
const path = require("path");

const formsPath = path.join(__dirname, "../forms");

async function getForms() {
  const files = await fs.readdir(formsPath);

  const forms = await Promise.all(
    files
      .filter((file) => file.endsWith(".json"))
      .map(async (file) => {
        const content = await fs.readFile(path.join(formsPath, file), "utf8");
        const form = JSON.parse(content);

        return {
          id: form.id,
          title: form.title,
          shortTitle: form.shortTitle,
          description: form.description
        };
      })
  );

  return forms;
}

async function getFormById(id) {
  try {
    const filePath = path.join(formsPath, `${id}.json`);
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content);
  } catch {
    return null;
  }
}

module.exports = {
  getForms,
  getFormById
};