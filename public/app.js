const formSelect = document.getElementById("formSelect");
const dynamicForm = document.getElementById("dynamicForm");

let currentForm = null;

async function loadForms() {
  const response = await fetch("/api/forms");
  const forms = await response.json();

  formSelect.innerHTML = "";

  for (const form of forms) {
    const option = document.createElement("option");
    option.value = form.id;
    option.textContent = form.title;
    formSelect.appendChild(option);
  }

  if (forms.length > 0) {
    await loadForm(forms[0].id);
  }
}

async function loadForm(id) {
  const response = await fetch(`/api/forms/${id}`);
  currentForm = await response.json();

  renderForm(currentForm);
}

function renderForm(form) {
  dynamicForm.innerHTML = "";

  for (const field of form.fields) {
    const wrapper = document.createElement("div");
    wrapper.className = "field";

    const label = document.createElement("label");
    label.textContent = field.label;
    wrapper.appendChild(label);

    if (field.type === "textarea") {
      const textarea = document.createElement("textarea");
      textarea.name = field.name;
      wrapper.appendChild(textarea);
    } else if (field.type === "table") {
      const textarea = document.createElement("textarea");
      textarea.name = field.name;
      textarea.placeholder = "Én rad per linje. Bruk komma mellom verdier.";
      wrapper.appendChild(textarea);
    } else {
      const input = document.createElement("input");
      input.name = field.name;
      input.type = field.type || "text";
      wrapper.appendChild(input);
    }

    dynamicForm.appendChild(wrapper);
  }

  const button = document.createElement("button");
  button.type = "submit";
  button.textContent = "Last ned PDF";
  dynamicForm.appendChild(button);
}

dynamicForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(dynamicForm);
  const payload = {};

  for (const field of currentForm.fields) {
    const value = formData.get(field.name);

    if (field.type === "table") {
      payload[field.name] = parseTableValue(field, value);
    } else {
      payload[field.name] = value;
    }
  }

  const response = await fetch(`/api/pdf/${currentForm.id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${currentForm.id}.pdf`;
  link.click();

  window.URL.revokeObjectURL(url);
});

function parseTableValue(field, value) {
  if (!value) return [];

  return value
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(",").map((part) => part.trim());
      const row = {};

      field.columns.forEach((column, index) => {
        row[column.name] = parts[index] || "";
      });

      return row;
    });
}

formSelect.addEventListener("change", async () => {
  await loadForm(formSelect.value);
});

loadForms();