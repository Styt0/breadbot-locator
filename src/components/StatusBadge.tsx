import React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, Clock, CheckCircle2, XCircle } from "lucide-react";

interface StatusBadgeProps {
  isStocked: boolean;
  lastReported: Date;
  stockLevel?: "full" | "low" | "empty";
  size?: "sm" | "md" | "lg";
  onClick?: (e: React.MouseEvent) => void;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  isStocked,
  lastReported,
  stockLevel,
  size = "md",
  onClick,
}) => {
  // Determine status time
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - lastReported.getTime()) / (1000 * 60));
  
  // If it's been more than 4 hours, consider the status as "unknown"
  const isRecent = diffMinutes < 240;
  
  // Get status
  const getStatus = () => {
    // If the report is not recent enough, show unknown status
    if (!isRecent) return "unknown";
    
    // If we have a specific stock level, use that
    if (stockLevel) return stockLevel;
    
    // Otherwise, fall back to the basic stocked/not stocked status
    return isStocked ? "full" : "empty";
  };
  
  const status = getStatus();
  
  // Get badge config based on status
  const getBadgeConfig = () => {
    switch (status) {
      case "full":
        return {
          bgColor: "bg-green-500",
          textColor: "text-white",
          icon: <CheckCircle2 className={cn(
            "mr-1",
            size === "sm" ? "h-3 w-3" : size === "md" ? "h-3.5 w-3.5" : "h-4 w-4"
          )} />,
          text: "Voldoende voorraad"
        };
      case "low":
        return {
          bgColor: "bg-amber-500",
          textColor: "text-white",
          icon: <AlertTriangle className={cn(
            "mr-1",
            size === "sm" ? "h-3 w-3" : size === "md" ? "h-3.5 w-3.5" : "h-4 w-4"
          )} />,
          text: "Bijna leeg"
        };
      case "empty":
        return {
          bgColor: "bg-red-500",
          textColor: "text-white",
          icon: <XCircle className={cn(
            "mr-1",
            size === "sm" ? "h-3 w-3" : size === "md" ? "h-3.5 w-3.5" : "h-4 w-4"
          )} />,
          text: "Leeg"
        };
      case "unknown":
      default:
        return {
          bgColor: "bg-gray-400",
          textColor: "text-white",
          icon: <Clock className={cn(
            "mr-1",
            size === "sm" ? "h-3 w-3" : size === "md" ? "h-3.5 w-3.5" : "h-4 w-4"
          )} />,
          text: "Onbekend"
        };
    }
  };
  
  const { bgColor, textColor, icon, text } = getBadgeConfig();
  
  return (
    <div 
      className={cn(
        "flex items-center rounded-full px-2 py-1",
        bgColor,
        textColor,
        onClick ? "cursor-pointer hover:opacity-90" : "",
        size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"
      )}
      onClick={onClick}
    >
      {icon}
      <span className={cn(
        size === "sm" ? "text-[10px]" : size === "md" ? "text-xs" : "text-sm"
      )}>
        {size === "sm" ? (status === "full" ? "Vol" : status === "low" ? "Bijna leeg" : status === "empty" ? "Leeg" : "?") : text}
      </span>
    </div>
  );
};

export default StatusBadge;
