function normalizePayload(payload) {
  return {
    operationName: payload.operationName || "",
    validFrom: payload.validFrom || "",
    validTo: payload.validTo || "",
    preparedBy: payload.preparedBy || "",
    fallbackPlan: payload.fallbackPlan || "",
    channels: Array.isArray(payload.channels) ? payload.channels : [],
  };
}

module.exports = {
  normalizePayload,
};
