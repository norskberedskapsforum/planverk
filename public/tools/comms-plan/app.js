document.getElementById("form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);

  const payload = Object.fromEntries(formData.entries());

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
