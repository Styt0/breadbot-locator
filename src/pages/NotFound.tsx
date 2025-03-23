
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/NavBar";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          
          <h1 className="text-4xl font-medium mb-4">Pagina niet gevonden</h1>
          
          <p className="text-muted-foreground mb-8">
            De pagina die u probeert te bezoeken bestaat niet of is verplaatst.
            Keer terug naar de hoofdpagina om verder te gaan.
          </p>
          
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link to="/" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Terug naar homepagina
            </Link>
          </Button>
        </div>
      </div>
      
      <footer className="border-t py-6 bg-white">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 BroodBot Locator - Vind eenvoudig broodautomaten in je buurt</p>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;
