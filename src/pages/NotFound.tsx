import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { clearCacheAndReload } from "@/pwa";

// List of routes that should exist in the app
const VALID_ROUTES = [
  '/community',
  '/welcome',
  '/explore',
  '/my-trips',
  '/chat',
  '/profile',
  '/create',
  '/settings',
  '/auth',
  '/favourites',
  '/approvals',
  '/feedback',
  '/install',
  '/onboarding',
  '/destinations',
  '/style',
  '/expenses',
  '/trips',
  '/trip',
  '/user',
  '/create-story',
];

const NotFound = () => {
  const location = useLocation();
  const [isAutoFixing, setIsAutoFixing] = useState(false);

  // Check if the current path should exist (stale cache issue)
  const shouldRouteExist = VALID_ROUTES.some(route => 
    location.pathname === route || location.pathname.startsWith(route + '/')
  );

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    
    // If this is a known route showing 404, it's likely a stale cache issue
    if (shouldRouteExist && !isAutoFixing) {
      setIsAutoFixing(true);
      toast("Fixing cached version...", {
        description: "This page should exist. Clearing stale cache.",
        duration: 2000,
      });
      
      // Give toast time to show, then clear cache and reload
      setTimeout(() => {
        clearCacheAndReload();
      }, 2000);
    }
  }, [location.pathname, shouldRouteExist, isAutoFixing]);

  const handleReload = () => {
    clearCacheAndReload();
  };

  // Show loading state while auto-fixing
  if (isAutoFixing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted p-4">
        <div className="text-center max-w-md">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg font-medium">Updating app...</p>
          <p className="text-sm text-muted-foreground mt-2">
            Clearing cached version and reloading.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="text-center max-w-md">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-2 text-xl text-muted-foreground">Oops! Page not found</p>
        <p className="mb-6 text-sm text-muted-foreground">
          If this keeps happening, you may be on an old cached version. Reloading usually fixes it.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={handleReload} variant="default" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Clear Cache & Reload
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <a href="/">
              <Home className="h-4 w-4" />
              Return to Home
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
