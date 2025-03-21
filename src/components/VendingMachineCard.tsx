
import React from "react";
import { MapPin, Navigation, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";
import { VendingMachine, formatRelativeTime, updateVendingMachineStatus } from "@/utils/vendingMachines";
import { cn } from "@/lib/utils";

interface VendingMachineCardProps {
  machine: VendingMachine;
  onStatusChange?: (machine: VendingMachine) => void;
  className?: string;
  compact?: boolean;
}

const VendingMachineCard: React.FC<VendingMachineCardProps> = ({
  machine,
  onStatusChange,
  className,
  compact = false,
}) => {
  const handleStatusChange = (newStatus: boolean) => {
    const updated = updateVendingMachineStatus(machine.id, newStatus);
    if (updated && onStatusChange) {
      onStatusChange(updated);
    }
  };

  // Formatter for the distance
  const formatDistance = (distance?: number) => {
    if (distance === undefined) return "";
    return distance < 1 
      ? `${Math.round(distance * 1000)} m` 
      : `${distance.toFixed(1)} km`;
  };

  // Decide if we should render a compact version
  if (compact) {
    return (
      <div
        className={cn(
          "group relative p-3 border rounded-xl bg-white shadow-subtle transition-all animate-in hover:shadow-card",
          className
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">{machine.name}</h3>
            <div className="flex items-center text-muted-foreground text-xs space-x-2 mt-0.5">
              {machine.distance !== undefined && (
                <span className="flex items-center">
                  <Navigation className="w-3 h-3 mr-1 inline" />
                  {formatDistance(machine.distance)}
                </span>
              )}
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1 inline" />
                {formatRelativeTime(machine.lastReported)}
              </span>
            </div>
          </div>
          
          <StatusBadge 
            isStocked={machine.isStocked}
            lastReported={machine.lastReported}
            size="sm"
            className="ml-2 shrink-0"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative p-4 border rounded-xl bg-white shadow-subtle transition-all duration-300 hover:shadow-card",
        className
      )}
    >
      <div className="flex flex-col h-full">
        <div className="mb-2 flex justify-between items-start">
          <h3 className="font-medium text-base md:text-lg">{machine.name}</h3>
          <StatusBadge 
            isStocked={machine.isStocked}
            lastReported={machine.lastReported}
            className="ml-2 shrink-0"
          />
        </div>
        
        <div className="text-muted-foreground text-sm mb-3">
          <div className="flex items-center mb-1">
            <MapPin className="w-3.5 h-3.5 mr-1.5 shrink-0" strokeWidth={2} />
            <span>{machine.address}</span>
          </div>
          
          {machine.distance !== undefined && (
            <div className="flex items-center">
              <Navigation className="w-3.5 h-3.5 mr-1.5 shrink-0" strokeWidth={2} />
              <span>Afstand: {formatDistance(machine.distance)}</span>
            </div>
          )}
        </div>
        
        <div className="mt-auto pt-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1" />
              <span>Bijgewerkt: {formatRelativeTime(machine.lastReported)}</span>
            </div>
          </div>
          
          <div className="mt-3 flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 bg-gray-50 border-gray-200 hover:bg-gray-100"
              onClick={() => handleStatusChange(false)}
            >
              <XCircle className="w-4 h-4 mr-1.5" />
              Leeg
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 bg-gray-50 border-gray-200 hover:bg-gray-100"
              onClick={() => handleStatusChange(true)}
            >
              <CheckCircle className="w-4 h-4 mr-1.5" />
              Gevuld
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add missing import
import { CheckCircle, XCircle } from "lucide-react";

export default VendingMachineCard;
