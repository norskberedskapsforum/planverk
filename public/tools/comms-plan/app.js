const form = document.getElementById("form");
const channels = document.getElementById("channels");
const addChannelButton = document.getElementById("addChannel");

addChannelButton.addEventListener("click", () => {
  const firstChannel = channels.querySelector(".channel");
  const newChannel = firstChannel.cloneNode(true);

  const channelNumber = channels.querySelectorAll(".channel").length + 1;
  newChannel.querySelector("legend").textContent = `Kanal ${channelNumber}`;

  newChannel.querySelectorAll("input, textarea, select").forEach((field) => {
    field.value = "";
  });

  channels.appendChild(newChannel);
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);

  const channelTypes = formData.getAll("channelType[]");
  const channelReferences = formData.getAll("channelReference[]");
  const channelPurposes = formData.getAll("channelPurpose[]");
  const channelPaces = formData.getAll("channelPace[]");
  const channelCodewords = formData
    .getAll("channelCodeword[]")
    .map((codeword) => codeword.toUpperCase());

  const payload = {
    classification: formData.get("classification"),

    operationName: formData.get("operationName"),
    validFrom: formData.get("validFrom"),
    validTo: formData.get("validTo"),

    channels: channelTypes.map((type, index) => ({
      type,
      reference: channelReferences[index],
      purpose: channelPurposes[index],
      pace: channelPaces[index],
      codeword: channelCodewords[index],
    })),
  };

  const response = await fetch("/api/tools/comms-plan/export/full", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "communications-plan.pdf";
  a.click();

  URL.revokeObjectURL(url);
});
