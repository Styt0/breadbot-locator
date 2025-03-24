
import React, { useEffect, useState } from "react";
import { Navigation, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VendingMachine, getUserLocation, getClosestVendingMachines } from "@/utils/vendingMachines";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface NearbyMachineSuggestionProps {
  onSelectMachine: (machine: VendingMachine) => void;
  className?: string;
}

const NearbyMachineSuggestion: React.FC<NearbyMachineSuggestionProps> = ({
  onSelectMachine,
  className
}) => {
  const [nearestMachine, setNearestMachine] = useState<VendingMachine | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const findNearestMachine = async () => {
    try {
      setLoading(true);
      // Get closest vending machine
      const machines = await getClosestVendingMachines(1);
      if (machines.length > 0) {
        setNearestMachine(machines[0]);
      }
    } catch (error) {
      console.error("Error finding nearest machine:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    findNearestMachine();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await findNearestMachine();
      toast.success("Dichtstbijzijnde automaat bijgewerkt");
    } catch (error) {
      console.error("Error refreshing:", error);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center p-4 border rounded-lg bg-white", className)}>
        <Loader2 className="h-5 w-5 text-muted-foreground animate-spin mr-2" />
        <span className="text-muted-foreground">Dichtstbijzijnde automaat zoeken...</span>
      </div>
    );
  }

  if (!nearestMachine) {
    return (
      <div className={cn("p-4 border rounded-lg bg-white text-center", className)}>
        <p className="text-muted-foreground mb-2">Geen automaten gevonden in de buurt</p>
        <Button size="sm" variant="outline" onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Navigation className="mr-2 h-4 w-4" />}
          Opnieuw zoeken
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("p-4 border rounded-lg bg-white", className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-sm">Dichtstbijzijnde automaat</h3>
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-7 px-2 text-xs" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Navigation className="h-3 w-3" />}
          <span className="ml-1">Vernieuwen</span>
        </Button>
      </div>
      
      <div 
        className="flex items-center bg-gray-50 p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => onSelectMachine(nearestMachine)}
      >
        <div className="mr-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            nearestMachine.isStocked 
              ? (nearestMachine.stockLevel === "low" ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-600") 
              : "bg-red-100 text-red-600"
          )}>
            <span className="text-lg font-medium">{nearestMachine.name.charAt(0)}</span>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{nearestMachine.name}</p>
          <p className="text-xs text-muted-foreground truncate">{nearestMachine.address}</p>
          {nearestMachine.distance && (
            <p className="text-xs text-muted-foreground mt-0.5">
              <span className="font-medium">{nearestMachine.distance.toFixed(1)} km</span> afstand
            </p>
          )}
        </div>
        
        <Button 
          size="sm" 
          variant="default" 
          className="ml-2 shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onSelectMachine(nearestMachine);
          }}
        >
          <Navigation className="mr-1 h-3.5 w-3.5" />
          <span>Bekijk</span>
        </Button>
      </div>
    </div>
  );
};

export default NearbyMachineSuggestion;
