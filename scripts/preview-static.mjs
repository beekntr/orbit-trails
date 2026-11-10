/**
 * Local preview of the prerendered build with the same URL rules as
 * vercel.json, so you can check status codes and view-source before deploying.
 *
 *   npm run build:static && npm run preview:static
 *
 * Rules, in order: exact file -> <path>.html (clean URLs) -> client-only
 * rewrites to spa.html -> 404.html with a 404 status.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "dist/spa");
const port = Number(process.env.PORT || 3000);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
};

// Keep in sync with "rewrites" in vercel.json (destination "/spa" is spa.html under clean URLs).
const spaRewrites = [/^\/adm\/?$/, /^\/tour-details\/[^/]+\/?$/];

const fileAt = (relative) => {
  const file = path.join(root, relative);
  return file.startsWith(root) && fs.existsSync(file) && fs.statSync(file).isFile() ? file : null;
};

http
  .createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    const clean = pathname.replace(/\/$/, "") || "/";

    // Keep in sync with "redirects" in vercel.json.
    const legacyTour = clean.match(/^\/tours\/([^/]+)$/);
    if (legacyTour) {
      res.writeHead(308, { Location: `/tour-details/${legacyTour[1]}` }).end();
      console.log(`308 ${pathname}`);
      return;
    }

    let status = 200;
    let file =
      (clean === "/" ? fileAt("index.html") : fileAt(clean)) || fileAt(`${clean}.html`);

    if (!file && spaRewrites.some((pattern) => pattern.test(clean))) file = fileAt("spa.html");
    if (!file) {
      status = 404;
      file = fileAt("404.html");
    }
    if (!file) {
      res.writeHead(404).end("Not found. Run `npm run build:static` first.");
      return;
    }

    res.writeHead(status, {
      "Content-Type": types[path.extname(file)] || "application/octet-stream",
    });
    fs.createReadStream(file).pipe(res);
    console.log(`${status} ${pathname}`);
  })
  .listen(port, () => console.log(`Static preview: http://localhost:${port}`));
