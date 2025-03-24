
import React from "react";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type StockStatus = "full" | "low" | "empty";

interface StatusUpdateButtonsProps {
  onStatusChange: (status: StockStatus) => void;
  currentStatus?: StockStatus;
  className?: string;
}

const StatusUpdateButtons: React.FC<StatusUpdateButtonsProps> = ({
  onStatusChange,
  currentStatus,
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant={currentStatus === "full" ? "default" : "outline"}
              className={cn(
                "relative",
                currentStatus === "full" ? "bg-green-500 hover:bg-green-600" : "border-green-200 hover:border-green-300 hover:bg-green-50"
              )}
              onClick={() => onStatusChange("full")}
            >
              <CheckCircle className={cn(
                "h-4 w-4",
                currentStatus === "full" ? "text-white" : "text-green-500"
              )} />
              <span className={cn(
                "ml-1.5 text-xs",
                currentStatus === "full" ? "text-white" : ""
              )}>
                Vol
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Automaat is volledig gevuld</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant={currentStatus === "low" ? "default" : "outline"}
              className={cn(
                "relative",
                currentStatus === "low" ? "bg-amber-500 hover:bg-amber-600" : "border-amber-200 hover:border-amber-300 hover:bg-amber-50"
              )}
              onClick={() => onStatusChange("low")}
            >
              <AlertTriangle className={cn(
                "h-4 w-4",
                currentStatus === "low" ? "text-white" : "text-amber-500"
              )} />
              <span className={cn(
                "ml-1.5 text-xs",
                currentStatus === "low" ? "text-white" : ""
              )}>
                Bijna leeg
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Nog maar weinig brood beschikbaar</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant={currentStatus === "empty" ? "default" : "outline"}
              className={cn(
                "relative",
                currentStatus === "empty" ? "bg-red-500 hover:bg-red-600" : "border-red-200 hover:border-red-300 hover:bg-red-50"
              )}
              onClick={() => onStatusChange("empty")}
            >
              <XCircle className={cn(
                "h-4 w-4",
                currentStatus === "empty" ? "text-white" : "text-red-500"
              )} />
              <span className={cn(
                "ml-1.5 text-xs",
                currentStatus === "empty" ? "text-white" : ""
              )}>
                Leeg
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Automaat is helemaal leeg</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default StatusUpdateButtons;
