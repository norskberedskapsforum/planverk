const PDFDocument = require("pdfkit");

async function generate(type, data, res) {
  const doc = new PDFDocument({
    size: "A4",
    margin: 20,
    layout: "landscape",
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="comms-plan.pdf"`);

  doc.pipe(res);

  renderHeader(doc, data);

  renderFullPlan(doc, data);

  doc.end();
}

function renderHeader(doc, data) {
  const margin = 20;
  const width = doc.page.width - margin * 2;

  const boxY = 30;
  const boxHeight = 25;

  // Graderingsboks
  doc
    .fillColor("black")
    .font("Helvetica")
    .fontSize(10)
    .text(data.classification.toUpperCase() || "UGRADERT", margin, boxY - 10, {
      align: "left",
    });

  // Datoboks
  doc
    .fillColor("black")
    .font("Helvetica")
    .fontSize(10)
    .text("10.04.2026", margin, boxY - 10, {
      align: "right",
    });

  // Grå boks
  doc.rect(margin, boxY, width, boxHeight).fill("#666666");

  // Tittel
  doc
    .fillColor("white")
    .font("Helvetica-Bold")
    .fontSize(16)
    .text("SAMBANDSOPERASJONSINSTRUKS", margin + 15, boxY + 6, {
      align: "center",
    });

  doc.moveDown(1.5);

  doc.fillColor("black");
}

function renderFullPlan(doc/*, data*/) {
  /*renderInfoBox(doc, "Operation", [
    ["Name", data.operationName],
    ["Valid from", data.validFrom],
    ["Valid to", data.validTo],
    ["Prepared by", data.preparedBy],
  ]);*/

  doc.moveDown();

  //renderChannelsTable(doc, data.channels || []);
  let channels = [
    {
      reference: "Channel 1",
      type: "Email",
      users: "All employees",
      purpose: "General updates",
      codeword: "Alpha",
      backup: "SMS",
    },
    {
      reference: "Channel 2",
      type: "SMS",
      users: "Emergency team",
      purpose: "Critical alerts",
      codeword: "Bravo",
      backup: "Phone call",
    },
  ];
  renderFixedChannelTable(doc, /*data.*/ channels || []);

  renderAuthenticationTable(doc);

  renderSubtractionTable(doc);

  doc.moveDown();

  //renderSection(doc, "Fallback / backup plan", data.fallbackPlan);
}

/*function renderChannelSheet(doc, data) {
  renderChannelsTable(doc, data.channels || []);
}*/

/*function renderInfoBox(doc, title, rows) {
  doc.fontSize(13).text(title);
  doc.moveDown(0.3);

  for (const [label, value] of rows) {
    doc.fontSize(10).text(`${label}: ${value || "-"}`);
  }
}*/

/*function renderSection(doc, title, value) {
  doc.fontSize(13).text(title);
  doc.moveDown(0.3);
  doc.fontSize(10).text(value || "-");
}*/

function renderFixedChannelTable(doc, channels = []) {
  const startX = 20;
  let y = 70;

  const rowHeight = 14;
  const headerHeight = 16;
  const rows = 24;

  const columns = [
    { key: "reference", label: "Ref", width: 70 },
    { key: "type", label: "Type", width: 65 },
    { key: "users", label: "Bruker", width: 110 },
    { key: "purpose", label: "Purpose", width: 110 },
    { key: "codeword", label: "Kodeord", width: 80 },
    { key: "backup", label: "Backup", width: 90 },
  ];

  const tableWidth = columns.reduce((sum, col) => sum + col.width, 0);

  // Header background/border
  doc.rect(startX, y, tableWidth, headerHeight).stroke();

  let x = startX;

  doc.fontSize(8).font("Helvetica-Bold");

  for (const col of columns) {
    doc.rect(x, y, col.width, headerHeight).stroke();
    doc.text(col.label, x + 4, y + 7, {
      width: col.width - 8,
      height: headerHeight,
    });
    x += col.width;
  }

  y += headerHeight;

  // Rows
  doc.font("Helvetica").fontSize(8);

  for (let i = 0; i < rows; i++) {
    const row = channels[i] || {};
    x = startX;

    for (const col of columns) {
      doc.rect(x, y, col.width, rowHeight).stroke();

      const value = row[col.key] || "";

      doc.text(value, x + 4, y + 6, {
        width: col.width - 8,
        height: rowHeight - 4,
        ellipsis: true,
      });

      x += col.width;
    }

    y += rowHeight;
  }
}

function renderSubtractionTable(doc) {
  const startY = 70;
  const margin = 20;
  const tableWidth = 70;
  const startX = doc.page.width - margin - tableWidth;

  doc.rect(startX, startY, tableWidth, 390).stroke();

  const rowHeight = 14;
  const headerHeight = 16;
  //const rows = 24;

  doc.rect(startX, startY, tableWidth, headerHeight).stroke();

  doc.fontSize(7).font("Helvetica-Bold");

  doc.text("Subtraktorkode", startX + 4, startY + 7, {
    align: "center",
  });

  doc.fontSize(7).font("Courier");

  const columns = [
    { label: "Letter", key: "letter", width: 15 },
    { label: "Code", key: "code", width: tableWidth - 60 },
  ];

  let y = startY + 20;

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  for (const letter of alphabet) {
    let x = startX + 4;

    const row = {
      letter,
      code: generateEightDigitCode(),
    };

    for (const column of columns) {
      //doc.rect(x, y, column.width, rowHeight).stroke();

      doc.text(row[column.key], x + 5, y + 6, {
        width: column.width - 10,
      });

      x += column.width;
    }

    y += rowHeight;
  }
}

function renderAuthenticationTable(doc) {
  const startY = 70;
  const margin = 20;
  const tableWidth = 160;
  const startX = doc.page.width - margin - tableWidth - 70;

  doc.rect(startX, startY, tableWidth, 390).stroke();

  const rowHeight = 14;
  const headerHeight = 16;
  //const rows = 24;

  doc.rect(startX, startY, tableWidth, headerHeight).stroke();

  doc.fontSize(7).font("Helvetica-Bold");

  doc.text("Autorisasjonstavle", startX + 4, startY + 7, {
    align: "center",
  });

  doc.fontSize(7).font("Courier");

  const columns = [
    { label: "Letter", key: "letter", width: 15 },
    { label: "Code", key: "code", width: tableWidth - 20 },
  ];

  let y = startY + 20;

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  for (const letter of alphabet) {
    let x = startX + 4;

    const row = {
      letter,
      code: generateAuthorizationCodeRow(),
    };

    for (const column of columns) {
      //doc.rect(x, y, column.width, rowHeight).stroke();

      doc.text(row[column.key], x + 5, y + 6, {
        width: column.width - 10,
      });

      x += column.width;
    }

    y += rowHeight;
  }
}

/*function renderChannelsTable(doc, channels) {
  doc.fontSize(13).text("Channels");
  doc.moveDown(0.5);

  if (!channels.length) {
    doc.fontSize(10).text("No channels added.");
    return;
  }

  const columns = [
    "Reference",
    "Type",
    "Users",
    "Purpose",
    "Codeword",
    "Backup",
  ];

  doc.fontSize(9).text(columns.join(" | "));
  doc.moveDown(0.3);

  for (const channel of channels) {
    const row = [
      channel.reference,
      channel.type,
      channel.users,
      channel.purpose,
      channel.codeword,
      channel.backup,
    ];

    doc.fontSize(9).text(row.map((value) => value || "-").join(" | "));
  }
}*/

function generateEightDigitCode() {
  const number = Math.floor(10000000 + Math.random() * 90000000).toString();

  return `${number.slice(0, 4)} ${number.slice(4)}`;
}

function generateAuthorizationCodeRow() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";

  for (let i = 0; i < 25; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    result += alphabet[randomIndex];
  }

  return `${result.slice(0, 5)} ${result.slice(5, 10)} ${result.slice(10, 15)} ${result.slice(15, 20)} ${result.slice(20)}`;
}

module.exports = {
  generate,
};
