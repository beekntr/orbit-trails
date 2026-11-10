import "./global.css";

import { Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { PresenceContext } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { initializeSecurityMeasures, protectConsole } from "@/lib/security";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/Seo";
import PageTransition from "@/components/PageTransition";
import AnimatedNavbar from "@/components/AnimatedNavbar";
import Footer from "@/components/Footer";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";
import LeadMagnetHost from "@/components/lead/LeadMagnetHost";
import { routes } from "./routes";

/**
 * While the page is being prerendered and hydrated, tell framer-motion to skip
 * "animate in" effects. Otherwise the static HTML would ship with
 * `opacity: 0` on the hero and every section, hiding the content from
 * visitors until JavaScript runs and delaying the largest contentful paint.
 * Once hydrated, `initial` is released and animations behave as usual.
 *
 * The context value must never switch between an object and null: motion
 * components call different hooks in each case.
 */
const presence = (skipInitial: boolean) => ({
  id: "app",
  isPresent: true,
  initial: skipInitial ? (false as const) : undefined,
  register: () => () => {},
  onExitComplete: () => {},
});
const SKIP_INITIAL_ANIMATION = presence(true);
const NORMAL_ANIMATION = presence(false);

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);
  return null;
}

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status">
      <title>Orbit Trails</title>
      <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

/** /tours/:slug used to render the same page as /tour-details/:slug. One URL per tour avoids duplicate content. */
function LegacyTourRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/tour-details/${slug}`} replace />;
}

function AppContent() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    initializeSecurityMeasures();
    protectConsole();
  }, []);

  return (
    <PresenceContext.Provider value={hydrated ? NORMAL_ANIMATION : SKIP_INITIAL_ANIMATION}>
      <div className="min-h-screen flex flex-col">
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <ScrollToTop />
        <AnimatedNavbar />
        <main className="flex-1">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              {routes.map(({ path, Component }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <PageTransition>
                      <Component />
                    </PageTransition>
                  }
                />
              ))}
              <Route path="/tours/:slug" element={<LegacyTourRedirect />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <WhatsAppFloatingButton />
        {hydrated && <LeadMagnetHost />}
      </div>
    </PresenceContext.Provider>
  );
}

export default function App({ queryClient }: { queryClient: QueryClient }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Sonner />
      <AppContent />
    </QueryClientProvider>
  );
}
