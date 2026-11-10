import { lazy, type ComponentType } from "react";
import { matchPath } from "react-router-dom";

type PageModule = { default: ComponentType };

export type PageComponent = ComponentType & { preload: () => Promise<void> };

export interface AppRoute {
  path: string;
  /** Source file of the page, used at build time to preload the right JS chunk. */
  source: string;
  Component: PageComponent;
}

/**
 * React.lazy plus an explicit preload(). Each page ships as its own chunk, so
 * the first visit downloads only the layout and the page being viewed.
 * entry-client preloads the current page before hydrating, which lets React
 * attach to the prerendered HTML without ever flashing a loading state.
 */
function page(path: string, source: string, load: () => Promise<PageModule>): AppRoute {
  let Loaded: ComponentType | undefined;
  const Lazy = lazy(load);
  const Component: PageComponent = Object.assign(
    () => (Loaded ? <Loaded /> : <Lazy />),
    {
      preload: () =>
        load().then((module) => {
          Loaded = module.default;
        }),
    },
  );
  return { path, source, Component };
}

export const routes: AppRoute[] = [
  page("/", "client/pages/Index.tsx", () => import("./pages/Index")),
  page("/tours", "client/pages/Tours.tsx", () => import("./pages/Tours")),
  page("/tour-details/:slug", "client/pages/TourDetails.tsx", () => import("./pages/TourDetails")),
  page(
    "/luxury-private-tours-india",
    "client/pages/LuxuryPrivateTours.tsx",
    () => import("./pages/LuxuryPrivateTours"),
  ),
  page(
    "/india-travel-guide-first-time-visitors",
    "client/pages/FirstTimeIndiaGuide.tsx",
    () => import("./pages/FirstTimeIndiaGuide"),
  ),
  page("/plan-my-trip", "client/pages/PlanMyTrip.tsx", () => import("./pages/PlanMyTrip")),
  page("/gallery", "client/pages/Gallery.tsx", () => import("./pages/Gallery")),
  page("/about", "client/pages/About.tsx", () => import("./pages/About")),
  page("/contact", "client/pages/Contact.tsx", () => import("./pages/Contact")),
  page("/blog", "client/pages/Blog.tsx", () => import("./pages/Blog")),
  page("/blog/:slug", "client/pages/BlogPost.tsx", () => import("./pages/BlogPost")),
  page("/privacy", "client/pages/Privacy.tsx", () => import("./pages/Privacy")),
  page("/terms", "client/pages/Terms.tsx", () => import("./pages/Terms")),
  page("/adm", "client/pages/Admin.tsx", () => import("./pages/Admin")),
  // Keep the catch-all last.
  page("*", "client/pages/NotFound.tsx", () => import("./pages/NotFound")),
];

export function matchRoute(pathname: string): AppRoute | undefined {
  return routes.find((route) => matchPath({ path: route.path, end: true }, pathname));
}
