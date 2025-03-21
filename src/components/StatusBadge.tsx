
import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface StatusBadgeProps {
  isStocked: boolean;
  lastReported?: Date;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  isStocked,
  lastReported,
  size = "md",
  className,
  onClick,
}) => {
  // Size mappings for Tailwind classes
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-sm px-2.5 py-1 gap-1.5",
    lg: "text-base px-3 py-1.5 gap-2",
  };

  // Time since last report in minutes
  const timeSinceReport = lastReported
    ? Math.floor((Date.now() - lastReported.getTime()) / (1000 * 60))
    : null;

  // Determine if the status is stale (older than 3 hours)
  const isStale = timeSinceReport !== null && timeSinceReport > 180;

  // Adjust status colors based on stale status
  const statusColor = isStale
    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
    : isStocked
    ? "bg-green-50 text-green-700 border-green-100"
    : "bg-red-50 text-red-700 border-red-100";

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border font-medium transition-colors",
        statusColor,
        sizeClasses[size],
        onClick ? "cursor-pointer hover:opacity-80" : "",
        className
      )}
      onClick={onClick}
    >
      {isStale ? (
        <Clock className="shrink-0" size={size === "sm" ? 12 : size === "md" ? 14 : 16} />
      ) : isStocked ? (
        <CheckCircle className="shrink-0" size={size === "sm" ? 12 : size === "md" ? 14 : 16} />
      ) : (
        <XCircle className="shrink-0" size={size === "sm" ? 12 : size === "md" ? 14 : 16} />
      )}
      
      <span>
        {isStale 
          ? "Status verouderd" 
          : isStocked 
            ? "Gevuld" 
            : "Leeg"}
      </span>
    </div>
  );
};

export default StatusBadge;
