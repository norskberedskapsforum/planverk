const commsPlanPdfService = require("../services/comms-plan.pdf.service");

async function exportDocument(req, res, next) {
  try {
    const { type } = req.params;
    const payload = req.body;

    await commsPlanPdfService.generate(type, payload, res);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  exportDocument,
};
