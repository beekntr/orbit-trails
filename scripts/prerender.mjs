/**
 * Static prerender (SSG) for the public site.
 *
 * Runs after `vite build` (client -> dist/spa) and `vite build --ssr`
 * (renderer -> dist/ssr). For every public URL it writes a complete HTML file
 * containing the page content, its <title>/meta/canonical/Open Graph tags and
 * JSON-LD, so crawlers, link previews and AI answer engines get the real page
 * without running JavaScript. The browser then hydrates it into the normal SPA.
 *
 * Tour data is fetched from the API exactly once per build. After that, tour
 * pages are served entirely from the CDN: they keep working, and keep ranking,
 * even when the home server is offline.
 *
 * Output (dist/spa):
 *   index.html, tours.html, tour-details/<slug>.html, blog/<slug>.html, ...
 *   spa.html      empty app shell for client-only routes (see vercel.json)
 *   404.html      served with a real 404 status for unknown URLs
 *   sitemap.xml   generated from the same route list, so it can never drift
 *
 * Env:
 *   VITE_API_URL            API origin (default https://api.orbittrails.com)
 *   PRERENDER_ALLOW_OFFLINE=1  build without tour pages if the API is down
 *                              (default: fail, so the last good deploy stays live)
 */
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const outDir = path.join(root, "dist/spa");
const ssrEntry = path.join(root, "dist/ssr/entry-server.js");
const SITE_URL = "https://www.orbittrails.com";
const API_URL = (process.env.VITE_API_URL || "https://api.orbittrails.com").replace(/\/$/, "");
const allowOffline = process.env.PRERENDER_ALLOW_OFFLINE === "1";

async function fetchTours() {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(`${API_URL}/api/tours`, {
        signal: AbortSignal.timeout(20_000),
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const body = await response.json();
      if (!body.success || !Array.isArray(body.data?.tours)) {
        throw new Error("Unexpected response shape");
      }
      return body.data.tours;
    } catch (error) {
      lastError = error;
      console.warn(`  tours fetch attempt ${attempt}/3 failed: ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
    }
  }
  throw lastError;
}

/** JSON that is safe to embed inside a <script> tag. */
const embed = (value) => JSON.stringify(value).replace(/</g, "\\u003c");

/** React emits <title>, <meta> and <link> ahead of the markup; lift them into <head>. */
function splitHead(html) {
  const match = html.match(/^(?:<title>[\s\S]*?<\/title>|<meta\b[^>]*>|<link\b[^>]*>)+/);
  const head = match ? match[0] : "";
  return { head, body: html.slice(head.length) };
}

/** <link rel="modulepreload"> for the page's own JS chunk and its imports. */
function preloadTags(manifest, source) {
  const seen = new Set();
  const files = [];
  const visit = (key, isRoot = false) => {
    const chunk = manifest[key];
    if (!chunk || seen.has(key)) return;
    seen.add(key);
    // The entry chunk is already requested by the <script type="module"> tag.
    if (!chunk.isEntry && (isRoot || !files.includes(chunk.file))) files.push(chunk.file);
    for (const dep of chunk.imports ?? []) visit(dep);
  };
  if (source) visit(source, true);
  return files.map((file) => `<link rel="modulepreload" crossorigin href="/${file}">`).join("");
}

function buildPage(template, { head, body, seeds, preloads }) {
  const state = seeds.length ? `<script>window.__ORBIT_DATA__=${embed(seeds)}</script>` : "";

  // React emits <link rel="preload" as="image"> for the page's main image. Put it
  // before the scripts so phones on slow connections fetch the hero photo first
  // (it is usually the Largest Contentful Paint), then the JavaScript.
  const imagePreloads = (head.match(/<link rel="preload" as="image"[^>]*>/g) ?? []).sort(
    (a, b) => Number(/fetchpriority="high"/i.test(b)) - Number(/fetchpriority="high"/i.test(a)),
  );
  const restOfHead = imagePreloads.reduce((html, tag) => html.replace(tag, ""), head);

  // Vite already preloads the entry's shared chunks: don't list them twice.
  const uniquePreloads = preloads
    .split(/(?=<link )/)
    .filter((tag) => tag && !template.includes(tag.match(/href="([^"]+)"/)?.[1] ?? "\0"))
    .join("");

  return template
    .replace(/<title>[\s\S]*?<\/title>\s*/, "")
    .replace(/(<link rel="dns-prefetch"[^>]*>\s*)(?![\s\S]*<link rel="dns-prefetch")/, `$1${imagePreloads.join("")}`)
    .replace("</head>", `${restOfHead}${uniquePreloads}</head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>${state}`);
}

/** llms.txt: a plain-text map of the site for AI assistants (https://llmstxt.org). */
function llmsTxt({ tours, blogPosts }) {
  const line = (title, path, note) => `- [${title}](${SITE_URL}${path})${note ? `: ${note}` : ""}`;
  return [
    "# Orbit Trails",
    "",
    "> Orbit Trails is a tour operator based in Jaipur, India, offering private, tailor-made tours of India for international travellers: the Golden Triangle (Delhi, Agra, Jaipur), Rajasthan and beyond, with a private car and English-speaking driver, local guides and hand-picked hotels.",
    "",
    "Contact: info@orbittrails.com, +91 86199 74762 (also WhatsApp). Office: 68/52, Pratap Nagar, Jaipur, Rajasthan 302033, India. Free tailor-made quotes via the trip planner.",
    "",
    "## Plan a trip",
    line("Plan your tailor-made India trip", "/plan-my-trip", "four quick questions; a specialist replies within 24 hours"),
    line("Luxury private tours of India", "/luxury-private-tours-india", "how private, tailor-made tours work"),
    line("All India tour packages", "/tours"),
    line("Contact", "/contact"),
    "",
    "## Tours",
    ...tours.map((tour) =>
      line(tour.name.replace(/\s+/g, " ").trim(), `/tour-details/${tour.slug}`, [tour.duration, (tour.destinations || []).join(", ")].filter(Boolean).join("; ")),
    ),
    "",
    "## Travel guides",
    line("India travel guide for first-time visitors", "/india-travel-guide-first-time-visitors", "visas, safety, health, money, etiquette"),
    ...blogPosts.map((post) => line(post.title, `/blog/${post.slug}`)),
    "",
    "## About",
    line("About Orbit Trails", "/about"),
    line("Guest gallery", "/gallery"),
    "",
  ].join("\n");
}

async function writePage(route, html) {
  const file = route === "/" ? "index.html" : `${route.replace(/^\//, "")}.html`;
  const target = path.join(outDir, file);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, html, "utf8");
  return file;
}

function sitemap(entries) {
  const urls = entries
    .map(
      ({ path: route, lastmod }) =>
        `  <url>\n    <loc>${SITE_URL}${route === "/" ? "/" : route}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

async function main() {
  console.log("Prerendering static pages…");

  let template;
  let manifest;
  try {
    template = await fs.readFile(path.join(outDir, "index.html"), "utf8");
    manifest = JSON.parse(await fs.readFile(path.join(outDir, ".vite/manifest.json"), "utf8"));
  } catch {
    throw new Error("No fresh client build found. Run `npm run build:static` (it builds, then prerenders).");
  }
  const { render, staticPaths, tourKeys, toTourSummary, blogPosts } = await import(
    pathToFileURL(ssrEntry).href
  );

  let tours = [];
  try {
    tours = await fetchTours();
    console.log(`  fetched ${tours.length} tours from ${API_URL} (1 request)`);
  } catch (error) {
    if (!allowOffline) {
      throw new Error(
        `Could not load tours from ${API_URL} (${error.message}). ` +
          "Refusing to publish a build without tour pages. " +
          "Set PRERENDER_ALLOW_OFFLINE=1 to build anyway.",
      );
    }
    console.warn("  API unreachable: tour pages will fall back to client-side rendering.");
  }

  const listSeed = [tourKeys.list, tours.map(toTourSummary)];
  const pages = [
    ...staticPaths()
      // Without tour data these pages would be frozen in an empty state: leave them to the client.
      .filter((entry) => tours.length || !entry.needsTours)
      .map((entry) => ({
        path: entry.path,
        lastmod: entry.lastmod,
        seeds: entry.needsTours ? [listSeed] : [],
      })),
    ...tours.map((tour) => ({
      path: `/tour-details/${tour.slug}`,
      lastmod: (tour.updatedAt || new Date().toISOString()).slice(0, 10),
      // The list feeds the "more tours" links, so a tour page needs no API request at all.
      seeds: [listSeed, [tourKeys.detail(tour.slug), tour]],
    })),
  ];

  // The untouched shell: used for client-only routes and as the base of every page.
  await fs.writeFile(path.join(outDir, "spa.html"), template, "utf8");

  for (const page of pages) {
    const { html, source } = await render(page.path, page.seeds);
    const { head, body } = splitHead(html);
    if (!head.includes("<title>")) {
      throw new Error(`${page.path} rendered without a <title>. Does the page render <Seo />?`);
    }
    const file = await writePage(
      page.path,
      buildPage(template, {
        head,
        body,
        seeds: page.seeds,
        preloads: preloadTags(manifest, source),
      }),
    );
    console.log(`  ${page.path}  ->  ${file}`);
  }

  // Real 404 page (hosts serve 404.html with a 404 status for unknown URLs).
  {
    const { html, source } = await render("/404", []);
    const { head, body } = splitHead(html);
    await fs.writeFile(
      path.join(outDir, "404.html"),
      buildPage(template, { head, body, seeds: [], preloads: preloadTags(manifest, source) }),
      "utf8",
    );
    console.log("  (not found)  ->  404.html");
  }

  await fs.writeFile(path.join(outDir, "sitemap.xml"), sitemap(pages), "utf8");
  await fs.writeFile(path.join(outDir, "llms.txt"), llmsTxt({ tours, blogPosts }), "utf8");
  console.log("  llms.txt     ->  site summary for AI assistants");
  console.log(`  sitemap.xml  ->  ${pages.length} URLs`);

  // Build metadata is not meant to be public.
  await fs.rm(path.join(outDir, ".vite"), { recursive: true, force: true });

  console.log(`Done: ${pages.length} pages prerendered.`);
}

main()
  // Exit explicitly: a stray timer in any dependency must not hang the deploy.
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(`\nPrerender failed: ${error.message}\n`);
    process.exit(1);
  });
