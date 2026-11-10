/**
 * Build-time renderer. Bundled with `vite build --ssr` and called by
 * scripts/prerender.mjs once per public URL. Never runs in the browser or on
 * the API server.
 */
import { prerender } from "react-dom/static";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import { createQueryClient } from "./lib/queryClient";
import { matchRoute } from "./routes";
import { blogPosts } from "./data/blogData";
import { tourKeys, toTourSummary } from "./hooks/useTours";

export { tourKeys, toTourSummary };

export type QuerySeed = [readonly unknown[], unknown];

/** Renders one URL to HTML. `seeds` pre-fills the data cache so pages render with real content. */
export async function render(url: string, seeds: QuerySeed[] = []) {
  const queryClient = createQueryClient();
  for (const [queryKey, data] of seeds) queryClient.setQueryData(queryKey, data);

  const route = matchRoute(url);
  await route?.Component.preload();

  const { prelude } = await prerender(
    <StaticRouter location={url}>
      <App queryClient={queryClient} />
    </StaticRouter>,
    {
      // Write every page's content inline, in document order. By default React
      // moves large Suspense boundaries into a hidden block that an inline
      // script swaps in, which leaves non-JS crawlers looking at a spinner.
      progressiveChunkSize: Number.MAX_SAFE_INTEGER,
    },
  );
  const html = await new Response(prelude as unknown as BodyInit).text();

  // Drop the cache (and its garbage-collection timers) so the build process can exit.
  queryClient.clear();

  return { html, source: route?.source };
}

/** Public, indexable routes that do not depend on the tours API. */
export function staticPaths() {
  const today = new Date().toISOString().slice(0, 10);
  return [
    { path: "/", needsTours: true, lastmod: today },
    { path: "/tours", needsTours: true, lastmod: today },
    { path: "/luxury-private-tours-india", needsTours: true, lastmod: today },
    { path: "/india-travel-guide-first-time-visitors", needsTours: false, lastmod: today },
    { path: "/plan-my-trip", needsTours: false, lastmod: today },
    { path: "/about", needsTours: false, lastmod: today },
    { path: "/contact", needsTours: false, lastmod: today },
    { path: "/blog", needsTours: false, lastmod: today },
    ...blogPosts.map((post) => ({
      path: `/blog/${post.slug}`,
      needsTours: false,
      lastmod: post.publishDate?.slice(0, 10) || today,
    })),
    { path: "/privacy", needsTours: false, lastmod: today },
    { path: "/terms", needsTours: false, lastmod: today },
  ];
}
