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
    .text("KOMMUNIKASJONSPLAN", margin + 15, boxY + 6, {
      align: "center",
    });

  doc.moveDown(1.5);

  doc.fillColor("black");
}

function renderBottomInfo(doc) {
  const margin = 20;
  const width = doc.page.width - margin * 2;

  const text = `Generert av NBF Planverk v${packageJson.version}`;

  doc
    .fillColor("gray")
    .font("Helvetica-Oblique")
    .fontSize(8)
    .text(text, margin, doc.page.height - 30, {
      align: "center",
      width,
    });
}

function renderFullPlan(doc, data) {
  /*renderInfoBox(doc, "Operation", [
    ["Name", data.operationName],
    ["Valid from", data.validFrom],
    ["Valid to", data.validTo],
    ["Prepared by", data.preparedBy],
  ]);*/

  doc.moveDown();

  //renderChannelsTable(doc, data.channels || []);
  /*let channels = [
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
  ];*/
  renderFixedChannelTable(doc, data.channels || []);

  renderAuthenticationTable(doc);

  renderSubtractionTable(doc);

  renderCodewordTable(doc, data);

  renderDocInfo(doc, data);

  doc.moveDown();

  //renderSection(doc, "Fallback / backup plan", data.fallbackPlan);
}

function renderDocInfo(doc, data) {
  const margin = 20;
  const width = 565;

  doc.rect(margin, doc.page.height - 109, width, 55).stroke();

  doc
    .fontSize(16)
    .font("Helvetica")
    .text(data.operationName || "N/A", margin + 5, doc.page.height - 100, {
      width: width - 10,
      align: "center",
    });

  const infoText = `Gyldig fra: ${data.validFrom || "N/A"} | Gyldig til: ${data.validTo || "N/A"} | Utarbeidet av: ${data.preparedBy || "N/A"}`;

  doc
    .fontSize(12)
    .font("Helvetica")
    .text(infoText, margin + 5, doc.page.height - 75, {
      align: "center",
      width: width - 10,
    });
}

function renderFixedChannelTable(doc, channels = []) {
  const startX = 20;
  let y = 70;

  const rowHeight = 20;
  const headerHeight = 16;
  const rows = 20;

  const columns = [
    { key: "type", label: "TYPE", width: 65 },
    { key: "reference", label: "REFERANSE", width: 140 },
    { key: "purpose", label: "FORMÅL", width: 200 },
    { key: "codeword", label: "KODEORD", width: 120 },
    { key: "pace", label: "PACE", width: 40 },
  ];

  const tableWidth = columns.reduce((sum, col) => sum + col.width, 0);

  // Header background/border
  doc.rect(startX, y, tableWidth, headerHeight).stroke();

  let x = startX;

  doc.fontSize(7).font("Helvetica-Bold");

  for (const col of columns) {
    doc.rect(x, y, col.width, headerHeight).stroke();
    doc.text(col.label, x + 4, y + 5, {
      width: col.width - 8,
      height: headerHeight,
    });
    x += col.width;
  }

  y += headerHeight;

  // Rows
  doc.font("Helvetica").fontSize(10);

  for (let i = 0; i < rows; i++) {
    const row = channels[i] || {};
    x = startX;

    for (const col of columns) {
      doc.rect(x, y, col.width, rowHeight).stroke();

      const value = row[col.key] || "";

      doc.text(value, x + 4, y + 6, {
        width: col.width - 8,
        height: rowHeight - 5,
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
  const tableWidth = 77;
  const startX = doc.page.width - margin - tableWidth;

  doc.rect(startX, startY, tableWidth, 416).stroke();

  const rowHeight = 15;
  const headerHeight = 16;
  const rows = 24;

  doc.rect(startX, startY, tableWidth, headerHeight).stroke();

  doc.fontSize(7).font("Helvetica-Bold");

  doc.text("SUBTRAKTORKODE", startX + 4, startY + 5, {
    width: tableWidth - 8,
    height: headerHeight,
    align: "center",
  });

  doc.fontSize(7).font("Courier");

  const columns = [
    { label: "Letter", key: "letter", width: 15 },
    { label: "Code", key: "code", width: tableWidth - 60 },
  ];

  y = startY + 20;

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  for (const letter of alphabet) {
    let x = startX + 5;

    const row = {
      letter,
      code: generateEightDigitCode(),
    };

    for (const column of columns) {
      //doc.rect(x, y, column.width, rowHeight).stroke();

      doc.text(row[column.key], x + 5, y + 6, {
        //width: column.width - 4,
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
  const startX = doc.page.width - margin - tableWidth - 77;

  doc.rect(startX, startY, tableWidth, 416).stroke();

  const rowHeight = 15;
  const headerHeight = 16;
  const rows = 24;

  doc.rect(startX, startY, tableWidth, headerHeight).stroke();

  doc.fontSize(7).font("Helvetica-Bold");

  doc.text("AUTORISASJONSTAVLE", startX + 4, startY + 5, {
    width: tableWidth - 8,
    height: headerHeight,
    align: "center",
  });

  doc.fontSize(7).font("Courier");

  const columns = [
    { label: "Letter", key: "letter", width: 15 },
    { label: "Code", key: "code", width: tableWidth - 20 },
  ];

  y = startY + 20;

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  for (const letter of alphabet) {
    let x = startX + 5;

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

function renderCodewordTable(doc, data) {
  const startY = 486;
  const margin = 20;
  const tableWidth = 237;
  const startX = doc.page.width - margin - tableWidth;

  //doc.rect(startX, startY, tableWidth, 80).stroke();

  let codewords = [
    {
      purpose: "Radiotaushet start/slutt",
      codeword: "HØNE",
    },
    {
      purpose: "Reelle meldinger",
      codeword: "NO-PLAY",
    },
    {
      purpose: "Kompromittert kommunikasjonsplan",
      codeword: "KRÅKE",
    },
  ];
}

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
