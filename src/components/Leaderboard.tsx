
import React from "react";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export interface LeaderboardEntry {
  id: string;
  username: string;
  points: number;
  updates: number;
  rank: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  period: "day" | "week" | "month";
  className?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries, period, className }) => {
  const getPeriodLabel = () => {
    switch (period) {
      case "day":
        return "Vandaag";
      case "week":
        return "Deze Week";
      case "month":
        return "Deze Maand";
      default:
        return "Totaal";
    }
  };

  // Helper for medal colors
  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 2:
        return "bg-gray-100 text-gray-800 border-gray-200";
      case 3:
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-100";
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Ranglijst</h3>
        <Badge variant="outline" className="text-bread-600">
          {getPeriodLabel()}
        </Badge>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Rang</TableHead>
            <TableHead>Gebruiker</TableHead>
            <TableHead className="text-right">Updates</TableHead>
            <TableHead className="text-right">Punten</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                Nog geen updates voor deze periode.
              </TableCell>
            </TableRow>
          ) : (
            entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  {entry.rank <= 3 ? (
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                      getMedalColor(entry.rank)
                    )}>
                      {entry.rank}
                    </div>
                  ) : (
                    <span className="text-muted-foreground font-medium pl-3">
                      {entry.rank}
                    </span>
                  )}
                </TableCell>
                <TableCell className="font-medium">{entry.username}</TableCell>
                <TableCell className="text-right">{entry.updates}</TableCell>
                <TableCell className="text-right font-semibold">{entry.points}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Leaderboard;
