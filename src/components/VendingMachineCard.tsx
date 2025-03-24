
import React, { useState } from "react";
import { Camera, Clock, MapPin, MessageSquare } from "lucide-react";
import StatusBadge from "./StatusBadge";
import StatusUpdateButtons, { StockStatus } from "./StatusUpdateButtons";
import PhotoUpload from "./PhotoUpload";
import CommentInput from "./CommentInput";
import { VendingMachine, updateVendingMachineStatus, formatRelativeTime } from "@/utils/vendingMachines";
import { cn } from "@/lib/utils";
import { showAchievementToast } from "./AchievementToast";
import { Button } from "./ui/button";
import { toast } from "sonner";

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
  const [isUpdating, setIsUpdating] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);

  const getCurrentStockStatus = (): StockStatus => {
    if (!machine.stockLevel) {
      return machine.isStocked ? "full" : "empty";
    }
    
    if (machine.stockLevel === "low") return "low";
    if (machine.stockLevel === "empty") return "empty";
    return "full";
  };

  const handleStatusUpdate = async (status: StockStatus) => {
    setIsUpdating(true);
    
    try {
      // Convert the status to isStocked boolean and stockLevel
      let isStocked = status === "full" || status === "low";
      const stockLevel = status;
      
      const updatedMachine = await updateVendingMachineStatus(
        machine.id, 
        isStocked, 
        stockLevel
      );
      
      if (onStatusChange) {
        onStatusChange(updatedMachine);
      }
      
      // Show achievement toast based on the update
      if (status === "full") {
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
      } else if (status === "empty") {
        // Empty machine reported
        showAchievementToast({
          type: "impact",
          title: "Nuttige update!",
          description: "Je hebt zojuist {impactNumber} mensen een lege automaat bespaard.",
          impactNumber: Math.floor(Math.random() * 5) + 2
        });
      } else {
        // Low stock reported
        showAchievementToast({
          type: "impact",
          title: "Goed om te weten!",
          description: "Mensen kunnen nu haast maken voordat alles op is.",
          impactNumber: Math.floor(Math.random() * 4) + 1
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
      toast.error("Kon de status niet bijwerken");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePhotoUpload = (photo: File) => {
    // In a real app, this would upload the photo to a server
    toast.success("Foto geüpload!");
    setShowPhotoUpload(false);
    
    // Show achievement toast
    showAchievementToast({
      type: "badge",
      title: "Visuele Verkenner!",
      description: "Je eerste foto van een broodautomaat"
    });
  };

  const handleCommentSubmit = (comment: string) => {
    // In a real app, this would send the comment to a server
    toast.success("Opmerking toegevoegd!");
    setShowComments(false);
    
    // Show achievement toast for first comment
    if (Math.random() < 0.3) {
      showAchievementToast({
        type: "reward",
        title: "Bedankt voor je opmerking!",
        description: "Je feedback helpt anderen.",
        rewardPoints: 5
      });
    }
  };

  return (
    <div 
      className={cn(
        "border rounded-lg overflow-hidden hover:shadow-sm transition-shadow",
        "bg-white",
        className
      )}
      onClick={() => !isUpdating && onSelectMachine?.(machine)}
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
          {compact ? (
            <StatusBadge 
              isStocked={machine.isStocked} 
              lastReported={machine.lastReported}
              stockLevel={machine.stockLevel as StockStatus}
              size={compact ? "sm" : "md"}
            />
          ) : null}
        </div>
        
        <div className="flex items-start space-x-2">
          <MapPin className={cn("text-muted-foreground flex-shrink-0", compact ? "h-3.5 w-3.5 mt-0.5" : "h-4 w-4 mt-0.5")} />
          <div className={cn("text-muted-foreground leading-tight", compact ? "text-xs" : "text-sm")}>
            <div className="truncate">{machine.address}</div>
            <div className="truncate">{machine.city}</div>
          </div>
        </div>
        
        {!compact && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5 mr-1" />
                <span>
                  Laatste update: {formatRelativeTime(machine.lastReported)}
                </span>
              </div>
              
              {machine.comment && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowComments(!showComments);
                  }}
                >
                  <MessageSquare className="h-3.5 w-3.5 mr-1" />
                  <span>Opmerkingen</span>
                </Button>
              )}
            </div>
            
            {/* One-tap status update buttons */}
            <div className="pt-1">
              <StatusUpdateButtons 
                onStatusChange={handleStatusUpdate}
                currentStatus={getCurrentStockStatus()}
              />
            </div>
            
            {/* Comment section */}
            {(showComments || machine.comment) && (
              <div className="mt-2 text-sm bg-gray-50 p-2 rounded-md">
                {machine.comment ? (
                  <div className="italic text-gray-600">"{machine.comment}"</div>
                ) : (
                  <CommentInput onCommentSubmit={handleCommentSubmit} />
                )}
              </div>
            )}
            
            {/* Photo section */}
            {(showPhotoUpload || machine.image) && (
              <div className="mt-2">
                {machine.image ? (
                  <div className="relative rounded-md overflow-hidden">
                    <img 
                      src={machine.image} 
                      alt={machine.name}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ) : (
                  <PhotoUpload onPhotoUpload={handlePhotoUpload} />
                )}
              </div>
            )}
            
            {/* Action buttons */}
            {!showPhotoUpload && !showComments && (
              <div className="flex items-center justify-between mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPhotoUpload(true);
                  }}
                >
                  <Camera className="h-3.5 w-3.5 mr-1" />
                  <span>Foto toevoegen</span>
                </Button>
                
                {!machine.comment && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowComments(true);
                    }}
                  >
                    <MessageSquare className="h-3.5 w-3.5 mr-1" />
                    <span>Opmerking</span>
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VendingMachineCard;
