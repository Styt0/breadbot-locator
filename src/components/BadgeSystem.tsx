
import React from "react";
import { Award, Star, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: "award" | "star" | "trophy";
  earned: boolean;
  date?: Date;
}

interface BadgeSystemProps {
  badges: UserBadge[];
  className?: string;
}

const BadgeSystem: React.FC<BadgeSystemProps> = ({ badges, className }) => {
  const renderIcon = (icon: string, earned: boolean) => {
    const className = cn(
      "h-5 w-5",
      earned ? "text-bread-600" : "text-gray-300"
    );

    switch (icon) {
      case "award":
        return <Award className={className} />;
      case "star":
        return <Star className={className} />;
      case "trophy":
        return <Trophy className={className} />;
      default:
        return <Award className={className} />;
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <h3 className="text-sm font-medium text-gray-700">Badges Verdiend</h3>
      <div className="flex flex-wrap gap-2">
        {badges.map((badge) => (
          <TooltipProvider key={badge.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all",
                    badge.earned 
                      ? "border-bread-200 bg-bread-50" 
                      : "border-gray-200 bg-gray-50 opacity-60"
                  )}
                >
                  {renderIcon(badge.icon, badge.earned)}
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" align="center" className="max-w-[200px]">
                <div className="text-center">
                  <p className="font-medium">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                  {badge.earned && badge.date && (
                    <p className="text-xs mt-1 font-medium text-bread-600">
                      Verdiend op {badge.date.toLocaleDateString('nl-NL')}
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};

export default BadgeSystem;
