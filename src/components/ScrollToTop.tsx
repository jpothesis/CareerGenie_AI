import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop Component
 *
 * Scrolls the window (for public routes) or a specific content area
 * (for dashboard routes) to the top on every route change.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Attempt to find the specific scroll container used in DashboardLayout
    const dashboardScrollArea = document.getElementById("dashboard-scroll-area");

    if (dashboardScrollArea) {
      // Scroll the specific container element if we are in the dashboard
      dashboardScrollArea.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } else {
      // Scroll the global window for all other routes
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }

    // Optional: A slight delay to ensure scroll fires after lazy-loaded content
    // replaces the Suspense fallback.
    const timeoutId = setTimeout(() => {
        if (dashboardScrollArea) {
            dashboardScrollArea.scrollTo({ top: 0, left: 0, behavior: "auto" });
        } else {
             window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        }
    }, 50);

    return () => clearTimeout(timeoutId);

  }, [pathname]);

  return null;
};

export default ScrollToTop;