
import React from "react";
import { Compass, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface NavBarProps {
  title?: string;
  className?: string;
}

const NavBar: React.FC<NavBarProps> = ({ title = "BroodBot", className }) => {
  const [open, setOpen] = React.useState(false);
  
  return (
    <header className={cn("sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-sm", className)}>
      <div className="container flex h-16 items-center px-4 sm:px-6">
        <div className="flex items-center gap-2 mr-4">
          <div className="flex items-center justify-center h-8 w-8 rounded-md bg-bread-600 text-white">
            <Compass className="h-5 w-5" />
          </div>
          <span className="font-medium text-xl hidden sm:inline-block">{title}</span>
        </div>
        
        <nav className="flex-1 hidden md:block">
          <ul className="flex space-x-4">
            <li>
              <a 
                href="#" 
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Automaten
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                In de buurt
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Toevoegen
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Over
              </a>
            </li>
          </ul>
        </nav>
        
        <div className="flex items-center gap-2 ml-auto">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Menu"
                onClick={() => setOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <div className="px-1 py-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center h-7 w-7 rounded-md bg-bread-600 text-white">
                      <Compass className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{title}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    aria-label="Close"
                    onClick={() => setOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <nav className="flex flex-col space-y-4">
                  <a 
                    href="#" 
                    className="py-2 text-base font-medium transition-colors hover:text-primary"
                  >
                    Automaten
                  </a>
                  <a 
                    href="#" 
                    className="py-2 text-base font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    In de buurt
                  </a>
                  <a 
                    href="#" 
                    className="py-2 text-base font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    Toevoegen
                  </a>
                  <a 
                    href="#" 
                    className="py-2 text-base font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    Over
                  </a>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
