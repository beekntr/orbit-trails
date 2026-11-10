import { SITE, absoluteUrl } from "@/lib/site";

/**
 * Injects one JSON-LD block. Google reads JSON-LD from <head> or <body>;
 * rendering it in place keeps it in the prerendered HTML and hydration-safe.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export interface SeoProps {
  /** Full <title>. Aim for under ~60 characters. */
  title: string;
  /** Meta description. Aim for 120-160 characters. */
  description: string;
  /** Canonical path of this page, e.g. "/tour-details/land-of-kings". */
  path: string;
  /** Absolute URL or site path. Falls back to the site default. */
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  /** Keep the page out of the index (404s, admin, thank-you states). */
  noindex?: boolean;
  jsonLd?: object | object[];
  article?: { publishedTime?: string; modifiedTime?: string; author?: string };
}

/**
 * Per-page <head> management.
 *
 * React 19 hoists <title>, <meta> and <link> rendered anywhere in the tree
 * into <head> and removes them when the page unmounts, so no helmet library
 * is needed. The same tags are written into the static HTML at build time by
 * scripts/prerender.mjs, which is what crawlers and link previews read.
 */
export default function Seo({
  title,
  description,
  path,
  image,
  imageAlt,
  type = "website",
  noindex = false,
  jsonLd,
  article,
}: SeoProps) {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image || SITE.defaultOgImage);
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="robots"
        content={noindex ? "noindex, follow" : "index, follow, max-image-preview:large"}
      />
      {!noindex && <link rel="canonical" href={url} />}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={imageAlt || title} />
      {article?.publishedTime && (
        <meta property="article:published_time" content={article.publishedTime} />
      )}
      {article?.modifiedTime && (
        <meta property="article:modified_time" content={article.modifiedTime} />
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {schemas.map((schema, index) => (
        <JsonLd key={index} data={schema} />
      ))}
    </>
  );
}
