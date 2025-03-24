
import React, { useState } from "react";
import { Award, Trophy, Star, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import BadgeSystem, { UserBadge } from "./BadgeSystem";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import Leaderboard, { LeaderboardEntry } from "./Leaderboard";

interface UserProfileProps {
  username: string;
  points: number;
  contributionCount: number;
  level: number;
  badges: UserBadge[];
  className?: string;
}

const MOCK_LEADERBOARD_ENTRIES: LeaderboardEntry[] = [
  { id: "user1", username: "BroodFan", points: 520, updates: 12, rank: 1 },
  { id: "user2", username: "FreshLoaf", points: 480, updates: 10, rank: 2 },
  { id: "user3", username: "BakersPride", points: 350, updates: 8, rank: 3 },
  { id: "user4", username: "CiabattaHunter", points: 230, updates: 5, rank: 4 },
  { id: "user5", username: "BaguetteFinder", points: 190, updates: 4, rank: 5 },
];

const UserProfile: React.FC<UserProfileProps> = ({
  username,
  points,
  contributionCount,
  level,
  badges,
  className,
}) => {
  const [activeTab, setActiveTab] = useState("badges");
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<"day" | "week" | "month">("week");

  // Calculate progress to next level (simplified)
  const nextLevelPoints = level * 100;
  const progress = Math.min(Math.floor((points % nextLevelPoints) / nextLevelPoints * 100), 100);

  return (
    <div className={cn("p-4 bg-white rounded-lg border shadow-sm", className)}>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-bread-100 flex items-center justify-center text-bread-600">
          <Trophy className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-medium">{username}</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>Niveau {level}</span>
            <span className="mx-2">•</span>
            <span>{points} punten</span>
          </div>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="ml-auto" aria-label="Details bekijken">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-bread-600" />
                <span>Jouw Profiel</span>
              </SheetTitle>
              <SheetDescription>
                Je hebt in totaal {contributionCount} updates gedaan en {badges.filter(b => b.earned).length} badges verdiend.
              </SheetDescription>
            </SheetHeader>
            
            <div className="mt-6 pb-2">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium">Niveau {level}</span>
                <span className="text-sm text-muted-foreground">
                  {points % nextLevelPoints}/{nextLevelPoints} punten voor niveau {level + 1}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-bread-600 rounded-full" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            
            <Tabs defaultValue="badges" className="mt-6">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="badges">Badges</TabsTrigger>
                <TabsTrigger value="leaderboard">Ranglijst</TabsTrigger>
              </TabsList>
              
              <TabsContent value="badges" className="mt-4 space-y-6">
                <BadgeSystem badges={badges} />
              </TabsContent>
              
              <TabsContent value="leaderboard" className="mt-4">
                <div className="mb-4 flex justify-center">
                  <div className="inline-flex rounded-md shadow-sm">
                    <Button 
                      variant={leaderboardPeriod === "day" ? "default" : "outline"}
                      size="sm"
                      className="rounded-l-md rounded-r-none"
                      onClick={() => setLeaderboardPeriod("day")}
                    >
                      Dag
                    </Button>
                    <Button 
                      variant={leaderboardPeriod === "week" ? "default" : "outline"}
                      size="sm"
                      className="rounded-none border-x-0"
                      onClick={() => setLeaderboardPeriod("week")}
                    >
                      Week
                    </Button>
                    <Button 
                      variant={leaderboardPeriod === "month" ? "default" : "outline"}
                      size="sm"
                      className="rounded-r-md rounded-l-none"
                      onClick={() => setLeaderboardPeriod("month")}
                    >
                      Maand
                    </Button>
                  </div>
                </div>
                
                <Leaderboard 
                  entries={MOCK_LEADERBOARD_ENTRIES} 
                  period={leaderboardPeriod} 
                />
              </TabsContent>
            </Tabs>
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {badges.slice(0, 3).map((badge) => (
            <div
              key={badge.id}
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center border-2",
                badge.earned
                  ? "border-bread-200 bg-bread-50 text-bread-600"
                  : "border-gray-200 bg-gray-50 text-gray-400 opacity-60"
              )}
            >
              {badge.icon === "award" && <Award className="h-4 w-4" />}
              {badge.icon === "star" && <Star className="h-4 w-4" />}
              {badge.icon === "trophy" && <Trophy className="h-4 w-4" />}
            </div>
          ))}
          
          {badges.length > 3 && (
            <Badge variant="outline" className="h-8 px-2">
              +{badges.filter(b => b.earned).length - 3} meer
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
