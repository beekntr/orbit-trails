import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { createQueryClient } from "./lib/queryClient";
import { matchRoute } from "./routes";

declare global {
  interface Window {
    /** Query data embedded by scripts/prerender.mjs: [queryKey, data][] */
    __ORBIT_DATA__?: Array<[readonly unknown[], unknown]>;
  }
}

async function start() {
  const container = document.getElementById("root")!;
  const queryClient = createQueryClient();

  // Data that was fetched once at build time: the page needs no API request to render.
  for (const [queryKey, data] of window.__ORBIT_DATA__ ?? []) {
    queryClient.setQueryData(queryKey, data);
  }

  // Load this page's code before React starts so hydration never shows a spinner.
  await matchRoute(window.location.pathname)?.Component.preload().catch(() => undefined);

  const app = (
    <BrowserRouter>
      <App queryClient={queryClient} />
    </BrowserRouter>
  );

  if (container.hasChildNodes()) {
    // Prerendered page: attach to the existing HTML.
    hydrateRoot(container, app);
  } else {
    // Fallback shell (admin, or a tour added since the last build): render from scratch.
    // The shell's placeholder <title> would otherwise sit next to the page's own.
    document.querySelector("head > title")?.remove();
    createRoot(container).render(app);
  }
}

start();
