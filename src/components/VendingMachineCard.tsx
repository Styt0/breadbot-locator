
import React from "react";
import { Clock, MapPin } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { VendingMachine, updateVendingMachineStatus, formatRelativeTime } from "@/utils/vendingMachines";
import { cn } from "@/lib/utils";
import { showAchievementToast } from "./AchievementToast";

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
      
      // Show achievement toast based on the update
      if (updatedMachine.isStocked) {
        // Fresh bread reported
        showAchievementToast({
          type: "impact",
          title: "Bedankt voor je bijdrage!",
          description: "Je hebt zojuist {impactNumber} mensen gered van een tevergeefse reis.",
          impactNumber: Math.floor(Math.random() * 10) + 3
        });
        
        // Randomly show reward toast (20% chance)
        if (Math.random() < 0.2) {
          showAchievementToast({
            type: "reward",
            title: "Bonus punten!",
            description: "Je hebt extra punten verdiend voor het als eerste melden van verse voorraad.",
            rewardPoints: 25
          });
        }
      } else {
        // Empty machine reported
        showAchievementToast({
          type: "impact",
          title: "Nuttige update!",
          description: "Je hebt zojuist {impactNumber} mensen een lege automaat bespaard.",
          impactNumber: Math.floor(Math.random() * 5) + 2
        });
      }
      
      // Randomly show badge toast (10% chance or first time)
      if (Math.random() < 0.1) {
        showAchievementToast({
          type: "badge",
          title: "Nieuwe badge ontgrendeld!",
          description: "Je hebt de badge 'Actieve Bijdrager' verdiend."
        });
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
            size={compact ? "sm" : "md"}
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
