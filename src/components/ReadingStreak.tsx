
import React from "react";
import { useEffect, useState } from "react";
import { differenceInDays, format, isYesterday, isToday, parseISO } from "date-fns";
import { Flame, Calendar, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { ReadingActivity } from "@/types/books";

export function ReadingStreak() {
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [longestStreak, setLongestStreak] = useState<number>(0);
  const [lastReadDate, setLastReadDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [checkedInToday, setCheckedInToday] = useState<boolean>(false);
  const { session } = useAuth();

  // Calculate the next milestone
  const nextMilestone = currentStreak < 7 ? 7 : 
                       currentStreak < 30 ? 30 :
                       currentStreak < 100 ? 100 : 
                       currentStreak < 365 ? 365 : 1000;
  
  const progress = Math.min(100, (currentStreak / nextMilestone) * 100);

  useEffect(() => {
    if (session?.user?.id) {
      fetchReadingActivity();
    }
  }, [session?.user?.id]);

  const fetchReadingActivity = async () => {
    try {
      setIsLoading(true);
      const userId = session?.user?.id;
      
      if (!userId) return;

      // Get all reading activity records for the user
      const { data, error } = await supabase
        .from('reading_activity')
        .select('*')
        .eq('user_id', userId)
        .order('activity_date', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        setIsLoading(false);
        return;
      }

      // Check if user has checked in today
      const todayCheck = data.find((record: ReadingActivity) => 
        isToday(parseISO(record.activity_date))
      );
      setCheckedInToday(!!todayCheck);

      // Set the last read date
      if (data[0]) {
        setLastReadDate(parseISO(data[0].activity_date));
      }

      // Calculate current streak
      let streak = 0;
      let latestDate: Date | null = null;
      
      // Sort data by date (newest first)
      const sortedData = [...data].sort((a: ReadingActivity, b: ReadingActivity) => 
        new Date(b.activity_date).getTime() - new Date(a.activity_date).getTime()
      );
      
      // If latest record is from today or yesterday, start counting streak
      if (sortedData.length > 0) {
        latestDate = parseISO(sortedData[0].activity_date);
        
        if (isToday(latestDate) || isYesterday(latestDate)) {
          streak = 1; // Count the most recent day
          
          // Check for consecutive previous days
          for (let i = 1; i < sortedData.length; i++) {
            const currentDate = parseISO(sortedData[i].activity_date);
            const prevDate = parseISO(sortedData[i-1].activity_date);
            
            // If dates are consecutive
            if (differenceInDays(prevDate, currentDate) === 1) {
              streak++;
            } else {
              break; // Break the streak if days are not consecutive
            }
          }
        }
      }
      
      setCurrentStreak(streak);
      
      // Calculate longest streak
      if (data.length > 0) {
        let maxStreak = 1;
        let tempStreak = 1;
        
        // Sort by oldest first for longest streak calculation
        const chronological = [...data].sort((a: ReadingActivity, b: ReadingActivity) => 
          new Date(a.activity_date).getTime() - new Date(b.activity_date).getTime()
        );
        
        for (let i = 1; i < chronological.length; i++) {
          const currentDate = parseISO(chronological[i].activity_date);
          const prevDate = parseISO(chronological[i-1].activity_date);
          
          // Check if dates are consecutive
          if (differenceInDays(currentDate, prevDate) === 1) {
            tempStreak++;
            maxStreak = Math.max(maxStreak, tempStreak);
          } else {
            tempStreak = 1; // Reset streak counter
          }
        }
        
        setLongestStreak(maxStreak);
      }
      
    } catch (error) {
      console.error('Error fetching reading activity:', error);
      toast.error('Could not load reading streak data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      if (!session?.user?.id) {
        toast.error('You must be logged in to check in');
        return;
      }

      if (checkedInToday) {
        toast.info("You've already checked in today!");
        return;
      }

      setIsLoading(true);

      const { error } = await supabase
        .from('reading_activity')
        .insert({
          user_id: session.user.id,
          activity_date: new Date().toISOString().split('T')[0],
          activity_type: 'check_in'
        });

      if (error) throw error;

      toast.success("Reading activity recorded!");
      await fetchReadingActivity();
    } catch (error) {
      console.error('Error recording reading activity:', error);
      toast.error('Failed to record reading activity');
    } finally {
      setIsLoading(false);
    }
  };

  // Determine flame size based on streak
  const getFlameSize = () => {
    if (currentStreak >= 100) return "h-10 w-10";
    if (currentStreak >= 30) return "h-8 w-8";
    if (currentStreak >= 7) return "h-7 w-7";
    return "h-6 w-6";
  };

  // Determine flame color based on streak
  const getFlameColor = () => {
    if (currentStreak >= 100) return "text-orange-600";
    if (currentStreak >= 30) return "text-orange-500";
    if (currentStreak >= 7) return "text-orange-400";
    return "text-orange-300";
  };

  return (
    <Card className="mb-4 overflow-hidden border-0 shadow-md bg-gradient-to-r from-amber-50 to-orange-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              "rounded-full flex items-center justify-center p-2",
              currentStreak > 0 ? "bg-gradient-to-br from-amber-100 to-orange-200" : "bg-gray-100"
            )}>
              <Flame className={cn(getFlameSize(), getFlameColor(), "drop-shadow")} />
            </div>
            <div>
              <h3 className="font-bold text-lg">
                {currentStreak} Day{currentStreak !== 1 ? 's' : ''} 
              </h3>
              <p className="text-sm text-gray-600">Current Reading Streak</p>
            </div>
          </div>
          <Button 
            onClick={handleCheckIn}
            disabled={checkedInToday || isLoading}
            className={cn(
              "bg-gradient-to-r shadow-sm",
              checkedInToday 
                ? "from-green-500 to-emerald-600 opacity-90 hover:from-green-600 hover:to-emerald-700" 
                : "from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
            )}
          >
            {checkedInToday ? "Checked In Today ✓" : "Check In Today"}
          </Button>
        </div>

        <div className="flex items-center gap-1.5 mb-1.5 mt-4">
          <Trophy className="h-4 w-4 text-amber-600" />
          <span className="text-sm font-medium">Longest Streak: {longestStreak} days</span>
        </div>

        <div className="space-y-2 mt-2">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Progress to {nextMilestone} days</span>
            <span>{currentStreak}/{nextMilestone}</span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-200" />
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {currentStreak >= 7 && (
            <Badge 
              variant="outline" 
              className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 text-amber-700 px-2 py-1"
            >
              7 Day Streak 🔥
            </Badge>
          )}
          {currentStreak >= 30 && (
            <Badge 
              variant="outline" 
              className="bg-gradient-to-r from-amber-100 to-orange-100 border-amber-300 text-amber-800 px-2 py-1"
            >
              30 Day Streak 🔥🔥
            </Badge>
          )}
          {currentStreak >= 100 && (
            <Badge 
              variant="outline" 
              className="bg-gradient-to-r from-amber-200 to-orange-200 border-amber-400 text-amber-900 px-2 py-1"
            >
              100 Day Streak 🔥🔥🔥
            </Badge>
          )}
        </div>

        {lastReadDate && (
          <div className="flex items-center gap-1.5 mt-4 text-gray-600 text-xs">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              Last reading activity: {format(lastReadDate, 'MMM d, yyyy')}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
