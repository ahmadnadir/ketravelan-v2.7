import { Button } from "@/components/ui/button";
import { RefreshCw, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="text-center max-w-md">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-2 text-xl text-muted-foreground">Oops! Page not found</p>
        <p className="mb-6 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => window.location.reload()} variant="default" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Reload
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
