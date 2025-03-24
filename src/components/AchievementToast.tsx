
import React from "react";
import { toast } from "sonner";
import { Award, Trophy } from "lucide-react";
import { UserBadge } from "./BadgeSystem";

interface AchievementToastProps {
  title: string;
  description: string;
  type: "badge" | "reward" | "impact";
  badge?: UserBadge;
  rewardPoints?: number;
  impactNumber?: number;
}

export const showAchievementToast = ({
  title,
  description,
  type,
  badge,
  rewardPoints,
  impactNumber,
}: AchievementToastProps) => {
  switch (type) {
    case "badge":
      toast(
        <div className="flex items-start gap-3">
          <div className="mt-1 flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-bread-100 text-bread-600">
            <Award className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>,
        {
          duration: 5000,
        }
      );
      break;
    case "reward":
      toast(
        <div className="flex items-start gap-3">
          <div className="mt-1 flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
            <Trophy className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
            {rewardPoints && (
              <p className="text-sm font-medium text-bread-600 mt-1">
                +{rewardPoints} punten!
              </p>
            )}
          </div>
        </div>,
        {
          duration: 5000,
        }
      );
      break;
    case "impact":
      toast(
        <div className="flex items-start gap-3">
          <div className="mt-1 flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-green-100 text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <div>
            <p className="font-medium">{title}</p>
            <p className="text-sm text-muted-foreground">
              {description.replace(
                "{impactNumber}",
                String(impactNumber || 0)
              )}
            </p>
          </div>
        </div>,
        {
          duration: 4000,
        }
      );
      break;
  }
};

export default showAchievementToast;
