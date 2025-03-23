
import React, { useState, useEffect } from "react";
import { Loader2, MapPin, Locate, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import VendingMachineCard from "./VendingMachineCard";
import { 
  VendingMachine, 
  getVendingMachinesInRadius,
  getUserLocation
} from "@/utils/vendingMachines";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface VendingMachineListProps {
  onSelectMachine?: (machine: VendingMachine) => void;
  className?: string;
}

const VendingMachineList: React.FC<VendingMachineListProps> = ({ 
  onSelectMachine,
  className 
}) => {
  const [machines, setMachines] = useState<VendingMachine[]>([]);
  const [filteredMachines, setFilteredMachines] = useState<VendingMachine[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationName, setLocationName] = useState<string | null>(null);

  // Load machines on mount
  useEffect(() => {
    const loadMachines = async () => {
      try {
        setLoading(true);
        // Get user location
        const location = await getUserLocation();
        setUserLocation(location);
        
        // Get machines in 20km radius
        const nearbyMachines = await getVendingMachinesInRadius(20);
        setMachines(nearbyMachines);
        setFilteredMachines(nearbyMachines);
      } catch (error) {
        console.error("Error loading vending machines:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMachines();
  }, []);

  // Filter machines when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMachines(machines);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = machines.filter(
      machine => 
        machine.name.toLowerCase().includes(query) || 
        machine.address.toLowerCase().includes(query)
    );
    
    setFilteredMachines(filtered);
  }, [searchQuery, machines]);

  const handleLocateMe = async () => {
    setIsLocating(true);
    try {
      const location = await getUserLocation();
      setUserLocation(location);
      
      // Refresh machines based on new location
      const nearbyMachines = await getVendingMachinesInRadius(20, location.lat, location.lng);
      setMachines(nearbyMachines);
      setFilteredMachines(nearbyMachines);
      
      toast.success("Locatie bijgewerkt!");
    } catch (error) {
      console.error("Error getting location:", error);
      toast.error("Kon je locatie niet bepalen");
    } finally {
      setIsLocating(false);
    }
  };

  // Handle machine status update
  const handleMachineUpdate = (updatedMachine: VendingMachine) => {
    setMachines(prev => 
      prev.map(m => m.id === updatedMachine.id ? updatedMachine : m)
    );
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm py-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Zoek op naam of adres"
            className="pl-9 pr-20 bg-white/80 border-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLocateMe}
            disabled={isLocating}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 gap-1"
          >
            {isLocating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Locate className="h-3.5 w-3.5 text-bread-600" />
            )}
            <span className="text-xs text-bread-600">Update</span>
          </Button>
        </div>
        
        <div 
          className="flex items-center mt-3 px-1 text-sm text-muted-foreground cursor-pointer"
          onClick={handleLocateMe}
        >
          <MapPin className="h-3.5 w-3.5 mr-1.5" />
          <span className="truncate">
            {isLocating 
              ? "Locatie bepalen..." 
              : userLocation 
                ? `Automaten binnen 20 km van jouw locatie` 
                : "Locatie bepalen..."}
          </span>
          <span className="ml-auto font-medium">
            {filteredMachines.length} resultaten
          </span>
        </div>
      </div>
      
      <div className="py-3 space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p>Automaten laden...</p>
          </div>
        ) : filteredMachines.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="mb-1">Geen automaten gevonden</p>
            <p className="text-sm">
              {searchQuery 
                ? "Probeer een andere zoekopdracht" 
                : "Er zijn geen broodautomaten in de buurt"}
            </p>
          </div>
        ) : (
          <>
            {filteredMachines.map((machine) => (
              <VendingMachineCard
                key={machine.id}
                machine={machine}
                onStatusChange={handleMachineUpdate}
                className="cursor-pointer hover:bg-gray-50"
                onSelectMachine={onSelectMachine}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default VendingMachineList;
