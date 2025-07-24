import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useRouteLoading } from "@/hooks/useRouteLoading";
import Loading from "@/components/Loading";
import PageTransition from "@/components/PageTransition";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Tours from "./pages/Tours";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Admin from "./pages/Admin";
import TourDetails from "./pages/TourDetails";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import ReviewUs from "./pages/ReviewUs";
import CustomerReviews from "./pages/CustomerReviews";
import AnimatedNavbar from "./components/AnimatedNavbar";
import Footer from "./components/Footer";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";

const queryClient = new QueryClient();

function AppContent() {
  const isLoading = useRouteLoading();

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatePresence mode="wait">
        {isLoading && <Loading fullScreen message="Loading page..." />}
      </AnimatePresence>
      <AnimatedNavbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes>
            <Route
              path="/"
              element={
                <PageTransition>
                  <Index />
                </PageTransition>
              }
            />
            <Route
              path="/about"
              element={
                <PageTransition>
                  <About />
                </PageTransition>
              }
            />
            <Route
              path="/contact"
              element={
                <PageTransition>
                  <Contact />
                </PageTransition>
              }
            />
            <Route
              path="/tours"
              element={
                <PageTransition>
                  <Tours />
                </PageTransition>
              }
            />
            <Route
              path="/tours/:slug"
              element={
                <PageTransition>
                  <TourDetails />
                </PageTransition>
              }
            />
            <Route
              path="/tour-details/:slug"
              element={
                <PageTransition>
                  <TourDetails />
                </PageTransition>
              }
            />
            <Route
              path="/blog"
              element={
                <PageTransition>
                  <Blog />
                </PageTransition>
              }
            />
            <Route
              path="/blog/:slug"
              element={
                <PageTransition>
                  <BlogPost />
                </PageTransition>
              }
            />
            <Route
              path="/privacy"
              element={
                <PageTransition>
                  <Privacy />
                </PageTransition>
              }
            />
            <Route
              path="/terms"
              element={
                <PageTransition>
                  <Terms />
                </PageTransition>
              }
            />
            <Route
              path="/adm"
              element={
                <PageTransition>
                  <Admin />
                </PageTransition>
              }
            />
            <Route
              path="/review-us"
              element={
                <PageTransition>
                  <ReviewUs />
                </PageTransition>
              }
            />
            <Route
              path="/customer-reviews"
              element={
                <PageTransition>
                  <CustomerReviews />
                </PageTransition>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route
              path="*"
              element={
                <PageTransition>
                  <NotFound />
                </PageTransition>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
