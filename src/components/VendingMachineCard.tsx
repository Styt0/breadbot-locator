
import React from "react";
import { Clock, MapPin } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { VendingMachine, updateVendingMachineStatus, formatRelativeTime } from "@/utils/vendingMachines";
import { cn } from "@/lib/utils";

export interface VendingMachineCardProps {
  machine: VendingMachine;
  onStatusChange?: (updatedMachine: VendingMachine) => void;
  onSelectMachine?: (machine: VendingMachine) => void;
  compact?: boolean;
  className?: string;
}

const VendingMachineCard: React.FC<VendingMachineCardProps> = ({
  machine,
  onStatusChange,
  onSelectMachine,
  compact = false,
  className,
}) => {
  const handleStatusToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card selection when toggling status
    
    try {
      const updatedMachine = await updateVendingMachineStatus(machine.id, !machine.isStocked);
      if (onStatusChange) {
        onStatusChange(updatedMachine);
      }
    } catch (error) {
      console.error("Failed to update machine status:", error);
    }
  };

  return (
    <div 
      className={cn(
        "border rounded-lg overflow-hidden hover:shadow-sm transition-shadow",
        "bg-white",
        className
      )}
      onClick={() => onSelectMachine?.(machine)}
    >
      <div className={cn("p-4", compact ? "space-y-1" : "space-y-3")}>
        <div className="flex justify-between items-start">
          <h3 
            className={cn(
              "font-medium truncate mr-2", 
              compact ? "text-sm" : "text-base"
            )}
          >
            {machine.name}
          </h3>
          <StatusBadge 
            isStocked={machine.isStocked} 
            lastReported={machine.lastReported}
            size={compact ? "sm" : "default"}
            onClick={handleStatusToggle}
          />
        </div>
        
        <div className="flex items-start space-x-2">
          <MapPin className={cn("text-muted-foreground flex-shrink-0", compact ? "h-3.5 w-3.5 mt-0.5" : "h-4 w-4 mt-0.5")} />
          <div className={cn("text-muted-foreground leading-tight", compact ? "text-xs" : "text-sm")}>
            <div className="truncate">{machine.address}</div>
            <div className="truncate">{machine.city}</div>
          </div>
        </div>
        
        {!compact && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>
              Laatste update: {formatRelativeTime(machine.lastReported)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendingMachineCard;
