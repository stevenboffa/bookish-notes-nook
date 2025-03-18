import React from "react";
import { useEffect, useState } from "react";
import { differenceInDays, format, isYesterday, isToday, parseISO, startOfDay } from "date-fns";
import { Flame, Calendar, Trophy, ChevronUp, ChevronDown, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { ReadingActivity } from "@/types/books";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";

export function ReadingStreak() {
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [longestStreak, setLongestStreak] = useState<number>(0);
  const [lastReadDate, setLastReadDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [checkedInToday, setCheckedInToday] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { session } = useAuth();
  const isMobile = useIsMobile();

  const nextMilestone = currentStreak < 7 ? 7 : 
                       currentStreak < 30 ? 30 :
                       currentStreak < 100 ? 100 : 
                       currentStreak < 365 ? 365 : 1000;
  
  const progress = Math.min(100, (currentStreak / nextMilestone) * 100);

  const getTodayStart = () => startOfDay(new Date());

  const parseLocalDate = (dateString: string) => {
    const date = parseISO(dateString);
    return date;
  };

  const isDateToday = (date: Date) => {
    const localToday = getTodayStart();
    return startOfDay(date).getTime() === localToday.getTime();
  };

  const isDateYesterday = (date: Date) => {
    const localToday = getTodayStart();
    const localYesterday = new Date(localToday);
    localYesterday.setDate(localYesterday.getDate() - 1);
    return startOfDay(date).getTime() === localYesterday.getTime();
  };

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

      const todayCheck = data.find((record: ReadingActivity) => 
        isDateToday(parseLocalDate(record.activity_date))
      );
      setCheckedInToday(!!todayCheck);

      if (data[0]) {
        setLastReadDate(parseLocalDate(data[0].activity_date));
      }

      let streak = 0;
      let latestDate: Date | null = null;
      
      const sortedData = [...data].sort((a: ReadingActivity, b: ReadingActivity) => 
        new Date(b.activity_date).getTime() - new Date(a.activity_date).getTime()
      );
      
      if (sortedData.length > 0) {
        latestDate = parseLocalDate(sortedData[0].activity_date);
        
        if (isDateToday(latestDate) || isDateYesterday(latestDate)) {
          streak = 1;
          
          for (let i = 1; i < sortedData.length; i++) {
            const currentDate = parseLocalDate(sortedData[i].activity_date);
            const prevDate = parseLocalDate(sortedData[i-1].activity_date);
            
            if (differenceInDays(prevDate, currentDate) === 1) {
              streak++;
            } else {
              break;
            }
          }
        }
      }
      
      setCurrentStreak(streak);
      
      if (data.length > 0) {
        let maxStreak = 1;
        let tempStreak = 1;
        
        const chronological = [...data].sort((a: ReadingActivity, b: ReadingActivity) => 
          new Date(a.activity_date).getTime() - new Date(b.activity_date).getTime()
        );
        
        for (let i = 1; i < chronological.length; i++) {
          const currentDate = parseLocalDate(chronological[i].activity_date);
          const prevDate = parseLocalDate(chronological[i-1].activity_date);
          
          if (differenceInDays(currentDate, prevDate) === 1) {
            tempStreak++;
            maxStreak = Math.max(maxStreak, tempStreak);
          } else {
            tempStreak = 1;
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

      const today = new Date().toISOString().split('T')[0];

      const { error } = await supabase
        .from('reading_activity')
        .insert({
          user_id: session.user.id,
          activity_date: today,
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

  const getFlameSize = () => {
    if (currentStreak >= 100) return "h-8 w-8";
    if (currentStreak >= 30) return "h-7 w-7";
    if (currentStreak >= 7) return "h-6 w-6";
    return "h-5 w-5";
  };

  const getFlameColor = () => {
    if (currentStreak >= 100) return "text-orange-600";
    if (currentStreak >= 30) return "text-orange-500";
    if (currentStreak >= 7) return "text-orange-400";
    return "text-orange-300";
  };

  const CompactView = () => (
    <div className="flex items-center justify-between w-full px-3 py-1.5">
      <div className="flex items-center gap-2">
        <div className={cn(
          "rounded-full flex items-center justify-center p-1",
          currentStreak > 0 ? "bg-gradient-to-br from-amber-100 to-orange-200" : "bg-gray-100"
        )}>
          <Flame className={cn(
            "h-4 w-4", 
            getFlameColor(), 
            "drop-shadow"
          )} />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm leading-tight">
            {currentStreak} <span className="font-normal text-xs text-gray-500">day streak</span>
          </span>
          <span className="text-xs text-gray-500 leading-tight">
            {nextMilestone > currentStreak ? `${nextMilestone - currentStreak} days to milestone` : 'Milestone reached!'}
          </span>
        </div>
      </div>
      
      <div className="flex items-center">
        {longestStreak > 0 && (
          <div className="flex items-center mr-3">
            <Trophy className="h-3.5 w-3.5 text-amber-500 mr-1" />
            <span className="text-xs font-medium">{longestStreak}</span>
          </div>
        )}
        
        <Button 
          onClick={handleCheckIn}
          disabled={checkedInToday || isLoading}
          size="sm"
          className={cn(
            "shadow-sm h-7 text-xs px-2.5",
            checkedInToday 
              ? "bg-green-500 hover:bg-green-600 text-white" 
              : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
          )}
        >
          {checkedInToday ? (
            <span className="flex items-center">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Checked
            </span>
          ) : "Check In"}
        </Button>
        
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="p-1 h-7 w-7 rounded-full ml-1.5">
            <ChevronDown size={14} />
          </Button>
        </CollapsibleTrigger>
      </div>
    </div>
  );

  const FullView = () => (
    <>
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
          size={isMobile ? "sm" : "default"}
        >
          {checkedInToday ? "Complete ✓" : "Check In"}
        </Button>
      </div>

      <div className="flex items-center gap-1.5 mb-1.5 mt-3 text-sm">
        <Trophy className="h-4 w-4 text-amber-600" />
        <span className="font-medium">Longest Streak: {longestStreak} days</span>
      </div>

      <div className="space-y-2 mt-2">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Progress to {nextMilestone} days</span>
          <span>{currentStreak}/{nextMilestone}</span>
        </div>
        <Progress value={progress} className="h-2 bg-gray-200" />
      </div>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {currentStreak >= 7 && (
          <Badge 
            variant="outline" 
            className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 text-amber-700 px-2 py-1 text-xs"
          >
            7 Day Streak 🔥
          </Badge>
        )}
        {currentStreak >= 30 && (
          <Badge 
            variant="outline" 
            className="bg-gradient-to-r from-amber-100 to-orange-100 border-amber-300 text-amber-800 px-2 py-1 text-xs"
          >
            30 Day Streak 🔥🔥
          </Badge>
        )}
        {currentStreak >= 100 && (
          <Badge 
            variant="outline" 
            className="bg-gradient-to-r from-amber-200 to-orange-200 border-amber-400 text-amber-900 px-2 py-1 text-xs"
          >
            100 Day Streak 🔥🔥🔥
          </Badge>
        )}
      </div>

      {lastReadDate && (
        <div className="flex items-center gap-1.5 mt-3 text-gray-600 text-xs">
          <Calendar className="h-3.5 w-3.5" />
          <span>
            Last reading activity: {format(lastReadDate, 'MMM d, yyyy')}
          </span>
        </div>
      )}
    </>
  );

  return (
    <Card className={cn(
      "mb-4 overflow-hidden border-0 shadow-md bg-gradient-to-r from-amber-50 to-orange-50",
      !isMobile && "max-w-lg mx-auto"
    )}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        {isOpen ? (
          <div className="flex items-center justify-end pr-1 pt-1">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-1 h-7 w-7 rounded-full">
                <ChevronUp size={14} />
              </Button>
            </CollapsibleTrigger>
          </div>
        ) : (
          <CompactView />
        )}
        
        <CollapsibleContent>
          <CardContent className="p-4 pt-0">
            <FullView />
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
