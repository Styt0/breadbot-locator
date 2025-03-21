
import React, { useRef, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import { VendingMachine, getUserLocation } from "@/utils/vendingMachines";

// Note: This is a mockup map component that simulates a map interface
// In a real application, you would integrate with a map library like Mapbox, Google Maps, or Leaflet

interface MapProps {
  machines: VendingMachine[];
  selectedMachine?: VendingMachine | null;
  onSelectMachine?: (machine: VendingMachine) => void;
  className?: string;
}

const Map: React.FC<MapProps> = ({
  machines,
  selectedMachine,
  onSelectMachine,
  className,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  
  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Center the map on user location on component mount
  useEffect(() => {
    const initializeMap = async () => {
      try {
        const userLocation = await getUserLocation();
        console.log("User location:", userLocation);
        // In a real implementation, you would center the map on the user's location here
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };
    
    initializeMap();
  }, []);

  // Helper to generate marker positions from machine data
  const generateMarkerPosition = (machine: VendingMachine, index: number) => {
    // For this mockup, we'll position markers in a grid pattern
    const cols = Math.ceil(Math.sqrt(machines.length));
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    const mapWidth = mapRef.current?.clientWidth || 600;
    const mapHeight = mapRef.current?.clientHeight || 400;
    
    const margin = 80;
    const width = mapWidth - (margin * 2);
    const height = mapHeight - (margin * 2);
    
    const x = margin + (col * (width / (cols - 1 || 1)));
    const y = margin + (row * (height / (cols - 1 || 1)));
    
    return { x, y };
  };

  return (
    <div 
      ref={mapRef}
      className={cn(
        "relative w-full h-full min-h-[400px] bg-blue-50 rounded-xl overflow-hidden",
        className
      )}
    >
      {loading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
          <p className="text-muted-foreground">Kaart laden...</p>
        </div>
      ) : (
        <>
          {/* Map background grid (simulated map) */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzhlOWZiZiIgb3BhY2l0eT0iMC4xIiBzdHJva2Utd2lkdGg9IjEiLz48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOGU5ZmJmIiBvcGFjaXR5PSIwLjIiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50" />
          
          {/* Machine markers */}
          {machines.map((machine, index) => {
            const position = generateMarkerPosition(machine, index);
            const isSelected = selectedMachine?.id === machine.id;
            
            return (
              <div
                key={machine.id}
                className={cn(
                  "absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300",
                  isSelected ? "z-10 scale-110" : "z-0 hover:scale-105"
                )}
                style={{ 
                  left: `${position.x}px`, 
                  top: `${position.y}px` 
                }}
                onClick={() => onSelectMachine?.(machine)}
              >
                <div 
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full shadow-sm border-2 transition-colors",
                    isSelected 
                      ? "bg-blue-500 border-white" 
                      : machine.isStocked 
                        ? "bg-green-500 border-white"
                        : "bg-red-500 border-white"
                  )}
                >
                  <span className="text-white font-semibold text-xs">{index + 1}</span>
                </div>
                
                {/* Pop-up for the selected machine */}
                {isSelected && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white rounded-lg shadow-elevated p-3 border border-gray-100 animate-scale-in">
                    <h4 className="font-medium text-sm mb-1 truncate">{machine.name}</h4>
                    <p className="text-xs text-muted-foreground truncate mb-2">{machine.address}</p>
                    <StatusBadge 
                      isStocked={machine.isStocked} 
                      lastReported={machine.lastReported}
                      size="sm"
                    />
                  </div>
                )}
              </div>
            );
          })}
          
          {/* User location marker */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="relative">
              <div className="w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-md"></div>
              <div className="absolute inset-0 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
            </div>
          </div>
          
          {/* Map controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button 
              variant="secondary"
              size="icon"
              className="w-10 h-10 rounded-full bg-white shadow-sm hover:bg-gray-50"
            >
              <span className="text-xl">+</span>
            </Button>
            <Button 
              variant="secondary"
              size="icon"
              className="w-10 h-10 rounded-full bg-white shadow-sm hover:bg-gray-50"
            >
              <span className="text-xl">−</span>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Map;
