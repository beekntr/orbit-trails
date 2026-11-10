/**
 * Builds the lead-magnet PDF from client/data/northIndiaRoute.ts.
 *
 *   npm run build:pdf
 *
 * Output: public/downloads/orbit-trails-14-day-north-india-route-planner.pdf
 * The file is committed, so the site build does not depend on this script.
 * Re-run it whenever the route content changes.
 */
import fs from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";
import { routePlanner } from "../client/data/northIndiaRoute";

const COLORS = {
  ink: "#1F2933",
  body: "#3E4C59",
  muted: "#7B8794",
  secondary: "#2B3D4F",
  primary: "#149E91",
  accent: "#ED691D",
  tint: "#F1F8F7",
  rule: "#D9E2EC",
};

const MARGIN = 56;
const output = path.join(process.cwd(), "public", routePlanner.file);
fs.mkdirSync(path.dirname(output), { recursive: true });

const doc = new PDFDocument({
  size: "A4",
  margins: { top: MARGIN, bottom: MARGIN + 14, left: MARGIN, right: MARGIN },
  bufferPages: true,
  info: {
    Title: routePlanner.title,
    Author: "Orbit Trails",
    Subject: "A 14-day private route through North India",
    Keywords: "India itinerary, Golden Triangle, Rajasthan, route planner",
  },
});
doc.pipe(fs.createWriteStream(output));

const pageWidth = doc.page.width;
const contentWidth = pageWidth - MARGIN * 2;
const bottomLimit = () => doc.page.height - doc.page.margins.bottom;

/** Start a new page unless `needed` points of vertical space are still free. */
function ensureSpace(needed: number) {
  if (doc.y + needed > bottomLimit()) doc.addPage();
}

function heading(text: string) {
  ensureSpace(60);
  doc.moveDown(0.6);
  doc.font("Helvetica-Bold").fontSize(16).fillColor(COLORS.secondary).text(text);
  const y = doc.y + 4;
  doc.moveTo(MARGIN, y).lineTo(MARGIN + 48, y).lineWidth(2).strokeColor(COLORS.primary).stroke();
  doc.y = y + 12;
}

// ---------------------------------------------------------------- Cover band
const bandHeight = 250;
doc.rect(0, 0, pageWidth, bandHeight).fill(COLORS.secondary);
doc
  .font("Helvetica-Bold")
  .fontSize(10)
  .fillColor("#7FE3D9")
  .text("ORBIT TRAILS  ·  FREE ROUTE PLANNER", MARGIN, 64, { characterSpacing: 1.5 });
doc
  .font("Helvetica-Bold")
  .fontSize(30)
  .fillColor("#FFFFFF")
  .text(routePlanner.title, MARGIN, 92, { width: contentWidth, lineGap: 4 });
doc
  .font("Helvetica")
  .fontSize(13)
  .fillColor("#D9E2EC")
  .text(routePlanner.route, MARGIN, doc.y + 12, { width: contentWidth });

doc.x = MARGIN;
doc.y = bandHeight + 28;
doc
  .font("Helvetica")
  .fontSize(11)
  .fillColor(COLORS.body)
  .text(routePlanner.intro, { width: contentWidth, lineGap: 3 });

// ------------------------------------------------------- Route at a glance
heading("The route at a glance");
for (const stop of routePlanner.stops) {
  const rowTop = doc.y;
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor(COLORS.ink)
    .text(stop.place, MARGIN, rowTop, { width: 100 });
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor(COLORS.accent)
    .text(`${stop.nights} ${stop.nights === 1 ? "night" : "nights"}  ·  ${stop.days}`, MARGIN + 100, rowTop + 1, {
      width: 120,
    });
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor(COLORS.body)
    .text(stop.why, MARGIN + 220, rowTop + 1, { width: contentWidth - 220, lineGap: 2 });
  const rowBottom = Math.max(doc.y, rowTop + 16) + 7;
  doc.moveTo(MARGIN, rowBottom).lineTo(pageWidth - MARGIN, rowBottom).lineWidth(0.5).strokeColor(COLORS.rule).stroke();
  doc.x = MARGIN;
  doc.y = rowBottom + 8;
}

// --------------------------------------------------------------- Day by day
doc.addPage();
heading("Day by day");

for (const day of routePlanner.days) {
  const textWidth = contentWidth - 44;
  doc.font("Helvetica").fontSize(10.5);
  const planHeight = doc.heightOfString(day.plan, { width: textWidth, lineGap: 2.5 });
  const tipHeight = day.tip ? doc.heightOfString(day.tip, { width: textWidth - 20, lineGap: 2 }) + 22 : 0;
  ensureSpace(planHeight + tipHeight + (day.travel ? 34 : 0) + 34);

  const top = doc.y;
  // Day number badge
  doc.circle(MARGIN + 14, top + 12, 14).fill(COLORS.primary);
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor("#FFFFFF")
    .text(String(day.day), MARGIN, top + 7, { width: 28, align: "center" });

  const left = MARGIN + 44;
  doc.font("Helvetica-Bold").fontSize(12.5).fillColor(COLORS.ink).text(day.title, left, top + 4, { width: textWidth });
  if (day.travel) {
    doc
      .font("Helvetica-Oblique")
      .fontSize(9.5)
      .fillColor(COLORS.accent)
      .text(day.travel, left, doc.y + 3, { width: textWidth });
  }
  doc
    .font("Helvetica")
    .fontSize(10.5)
    .fillColor(COLORS.body)
    .text(day.plan, left, doc.y + 5, { width: textWidth, lineGap: 2.5 });

  if (day.tip) {
    const tipTop = doc.y + 8;
    const innerWidth = textWidth - 20;
    doc.font("Helvetica").fontSize(9.5);
    const height = doc.heightOfString(`Tip: ${day.tip}`, { width: innerWidth, lineGap: 2 }) + 14;
    doc.roundedRect(left, tipTop, textWidth, height, 4).fill(COLORS.tint);
    doc
      .fillColor(COLORS.secondary)
      .font("Helvetica-Bold")
      .text("Tip: ", left + 10, tipTop + 7, { width: innerWidth, lineGap: 2, continued: true })
      .font("Helvetica")
      .text(day.tip);
    doc.y = tipTop + height;
  }

  doc.x = MARGIN;
  doc.y += 16;
}

// ------------------------------------------------------------ Planning notes
heading("Planning notes");
for (const tip of routePlanner.tips) {
  ensureSpace(48);
  doc.font("Helvetica-Bold").fontSize(11).fillColor(COLORS.ink).text(tip.title, MARGIN, doc.y, { width: contentWidth });
  doc
    .font("Helvetica")
    .fontSize(10.5)
    .fillColor(COLORS.body)
    .text(tip.body, MARGIN, doc.y + 2, { width: contentWidth, lineGap: 2.5 });
  doc.y += 10;
}

// ---------------------------------------------------------------------- CTA
ensureSpace(130);
const ctaTop = doc.y + 10;
doc.roundedRect(MARGIN, ctaTop, contentWidth, 104, 8).fill(COLORS.secondary);
doc
  .font("Helvetica-Bold")
  .fontSize(15)
  .fillColor("#FFFFFF")
  .text("Want this route shaped around your dates and budget?", MARGIN + 20, ctaTop + 18, {
    width: contentWidth - 40,
  });
doc
  .font("Helvetica")
  .fontSize(10.5)
  .fillColor("#D9E2EC")
  .text(
    "Tell us how you like to travel and a specialist in India will send a tailor-made, private itinerary and quote within 24 hours. It is free, with no obligation.",
    MARGIN + 20,
    doc.y + 6,
    { width: contentWidth - 40, lineGap: 2 },
  );
doc
  .font("Helvetica-Bold")
  .fontSize(11)
  .fillColor("#7FE3D9")
  .text("orbittrails.com/plan-my-trip   ·   info@orbittrails.com", MARGIN + 20, doc.y + 8, {
    width: contentWidth - 40,
    link: "https://www.orbittrails.com/plan-my-trip",
  });

// ------------------------------------------------------------------ Footers
const range = doc.bufferedPageRange();
for (let index = range.start; index < range.start + range.count; index++) {
  doc.switchToPage(index);
  const y = doc.page.height - MARGIN + 6;
  // Writing below the bottom margin would otherwise trigger a new page.
  doc.page.margins.bottom = 0;
  doc
    .font("Helvetica")
    .fontSize(8.5)
    .fillColor(COLORS.muted)
    .text("Orbit Trails  ·  Private, tailor-made tours of India  ·  www.orbittrails.com", MARGIN, y, {
      width: contentWidth - 60,
      lineBreak: false,
    });
  doc.text(`${index + 1} / ${range.count}`, pageWidth - MARGIN - 60, y, { width: 60, align: "right", lineBreak: false });
}

doc.end();
process.stdout.write(`Wrote ${path.relative(process.cwd(), output)}\n`);
