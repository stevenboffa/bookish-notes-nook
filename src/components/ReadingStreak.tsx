
import React from "react";
import { useEffect, useState } from "react";
import { differenceInDays, format, isYesterday, isToday, parseISO, startOfDay, addDays } from "date-fns";
import { Flame, Calendar, Trophy, ChevronUp, ChevronDown, CheckCircle2, Quote, BookOpen } from "lucide-react";
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

interface DailyQuote {
  id: number;
  quoted: string;
  qauthor: string;
  qbook: string | null;
}

interface ReadingStreakProps {
  demoQuote?: DailyQuote;
  isQuoteLoading?: boolean;
}

export function ReadingStreak({ demoQuote, isQuoteLoading }: ReadingStreakProps = {}) {
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [longestStreak, setLongestStreak] = useState<number>(0);
  const [lastReadDate, setLastReadDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [checkedInToday, setCheckedInToday] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dailyQuote, setDailyQuote] = useState<DailyQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState<boolean>(true);
  const { session } = useAuth();
  const isMobile = useIsMobile();

  const nextMilestone = currentStreak < 7 ? 7 : 
                       currentStreak < 30 ? 30 :
                       currentStreak < 100 ? 100 : 
                       currentStreak < 365 ? 365 : 1000;
  
  const progress = Math.min(100, (currentStreak / nextMilestone) * 100);

  const getTodayStart = () => startOfDay(new Date());
  const getTodayDateString = () => format(new Date(), 'yyyy-MM-dd');

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
    const localYesterday = addDays(localToday, -1);
    return startOfDay(date).getTime() === localYesterday.getTime();
  };

  useEffect(() => {
    if (demoQuote) {
      setDailyQuote(demoQuote);
      setQuoteLoading(isQuoteLoading ?? false);
      setCurrentStreak(12);
      setLongestStreak(30);
      setCheckedInToday(true);
      setIsLoading(false);
      setIsOpen(true);
      return;
    }

    if (session?.user?.id) {
      fetchReadingActivity();
      fetchDailyQuote();
    } else {
      fetchRandomQuote();
    }
  }, [session?.user?.id, demoQuote, isQuoteLoading]);

  const fetchDailyQuote = async () => {
    try {
      setQuoteLoading(true);
      const userId = session?.user?.id;
      
      if (!userId) return;

      const todayDateString = getTodayDateString();
      console.log('Fetching daily quote for date:', todayDateString);
      
      const { data: userQuotes, error: userQuotesError } = await supabase
        .from('user_seen_quotes')
        .select(`
          quote_id,
          seen_date
        `)
        .eq('user_id', userId)
        .gte('seen_date', `${todayDateString}T00:00:00`)
        .lt('seen_date', `${todayDateString}T23:59:59.999Z`);
      
      if (userQuotesError) {
        console.error('Error fetching user quotes:', userQuotesError);
        throw userQuotesError;
      }
      
      console.log('User quotes for today:', userQuotes);
      
      if (userQuotes && userQuotes.length > 0) {
        const quoteId = userQuotes[0].quote_id;
        
        const { data: quoteData, error: quoteError } = await supabase
          .from('streak_quotes')
          .select('*')
          .eq('id', quoteId)
          .single();
        
        if (quoteError) {
          console.error('Error fetching saved quote:', quoteError);
          throw quoteError;
        }
        
        console.log('Retrieved saved quote:', quoteData);
        
        if (quoteData) {
          setDailyQuote(quoteData as DailyQuote);
          setQuoteLoading(false);
          return;
        }
      }

      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
      
      const { data: recentAuthors, error: recentAuthorsError } = await supabase
        .from('user_seen_quotes')
        .select('streak_quotes!inner(qauthor)')
        .eq('user_id', userId)
        .gte('seen_date', tenDaysAgo.toISOString());

      if (recentAuthorsError) throw recentAuthorsError;
      
      const recentAuthorsList = recentAuthors?.map(item => 
        (item as any).streak_quotes?.qauthor as string
      ).filter(Boolean) || [];
      
      const { data: seenQuotes, error: seenQuotesError } = await supabase
        .from('user_seen_quotes')
        .select('quote_id')
        .eq('user_id', userId);

      if (seenQuotesError) throw seenQuotesError;
      
      const seenQuoteIds = seenQuotes?.map(item => item.quote_id) || [];

      let query = supabase
        .from('streak_quotes')
        .select('*');
      
      if (seenQuoteIds.length > 0) {
        query = query.not('id', 'in', `(${seenQuoteIds.join(',')})`);
      }
      
      if (recentAuthorsList.length > 0) {
        query = query.not('qauthor', 'in', `(${recentAuthorsList.map(a => `"${a}"`).join(',')})`);
      }
      
      query = query.limit(1).order('id', { ascending: false });
      
      const { data: quotes, error: quotesError } = await query;

      if (quotesError) throw quotesError;
      
      if (quotes && quotes.length > 0) {
        const newQuote = quotes[0] as DailyQuote;
        console.log('Assigning new quote for today:', newQuote);
        setDailyQuote(newQuote);
        
        const { error: insertError } = await supabase
          .from('user_seen_quotes')
          .insert({
            user_id: userId,
            quote_id: newQuote.id,
            seen_date: `${todayDateString}T12:00:00.000Z`
          });
          
        if (insertError) {
          console.error('Error recording seen quote:', insertError);
          throw insertError;
        }
        
        console.log('Successfully recorded new quote for today');
      } else {
        await assignRandomQuoteForToday();
      }
    } catch (error) {
      console.error('Error in fetchDailyQuote:', error);
      await assignRandomQuoteForToday();
    } finally {
      setQuoteLoading(false);
    }
  };

  const assignRandomQuoteForToday = async () => {
    try {
      const todayDateString = getTodayDateString();
      const userId = session?.user?.id;
      
      if (!userId) return;
      
      const { data: existingQuote } = await supabase
        .from('user_seen_quotes')
        .select('id, quote_id')
        .eq('user_id', userId)
        .gte('seen_date', `${todayDateString}T00:00:00`)
        .lt('seen_date', `${todayDateString}T23:59:59.999Z`);
        
      if (existingQuote && existingQuote.length > 0) {
        console.log('Found existing quote assignment, fetching quote details');
        const { data: quoteData } = await supabase
          .from('streak_quotes')
          .select('*')
          .eq('id', existingQuote[0].quote_id)
          .single();
          
        if (quoteData) {
          setDailyQuote(quoteData as DailyQuote);
          return;
        }
      }
      
      const { data, error } = await supabase
        .from('streak_quotes')
        .select('*')
        .order('id', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      if (data && data.length > 0) {
        console.log('Assigning random quote for today:', data[0]);
        setDailyQuote(data[0] as DailyQuote);
        
        const { error: insertError } = await supabase
          .from('user_seen_quotes')
          .insert({
            user_id: userId,
            quote_id: data[0].id,
            seen_date: `${todayDateString}T12:00:00.000Z`
          });
          
        if (insertError) {
          console.error('Error recording randomly assigned quote:', insertError);
        } else {
          console.log('Successfully recorded random quote for today');
        }
      }
    } catch (error) {
      console.error('Error assigning random quote:', error);
      fetchRandomQuote();
    }
  };

  const fetchRandomQuote = async () => {
    try {
      const { data, error } = await supabase
        .from('streak_quotes')
        .select('*')
        .order('id', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      if (data && data.length > 0) {
        setDailyQuote(data[0] as DailyQuote);
      }
    } catch (error) {
      console.error('Error fetching random quote:', error);
      setDailyQuote({
        id: 0,
        quoted: "The only limit to our realization of tomorrow will be our doubts of today.",
        qauthor: "Franklin D. Roosevelt",
        qbook: null
      });
    }
  };

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

      // Check if user checked in today
      const todayCheck = data?.find((record: ReadingActivity) => 
        isDateToday(parseLocalDate(record.activity_date))
      );
      setCheckedInToday(!!todayCheck);

      if (!data || data.length === 0) {
        setIsLoading(false);
        return;
      }

      if (data[0]) {
        setLastReadDate(parseLocalDate(data[0].activity_date));
      }

      // Calculate current streak
      let streak = 0;
      let latestDate: Date | null = null;
      
      // Sort data by date (most recent first)
      const sortedData = [...data].sort((a: ReadingActivity, b: ReadingActivity) => 
        new Date(b.activity_date).getTime() - new Date(a.activity_date).getTime()
      );
      
      if (sortedData.length > 0) {
        // If checked in today, start with 1
        latestDate = parseLocalDate(sortedData[0].activity_date);
        
        if (isDateToday(latestDate)) {
          streak = 1;
          
          // Check previous days
          let previousDate = addDays(getTodayStart(), -1);
          
          for (let i = 1; i < sortedData.length; i++) {
            const currentDate = parseLocalDate(sortedData[i].activity_date);
            
            // If the current date matches the expected previous day, increment streak
            if (startOfDay(currentDate).getTime() === startOfDay(previousDate).getTime()) {
              streak++;
              previousDate = addDays(previousDate, -1);
            } else {
              break;
            }
          }
        } else if (isDateYesterday(latestDate)) {
          // If last check-in was yesterday, streak is at least 1
          streak = 1;
          
          // Check previous days
          let previousDate = addDays(latestDate, -1);
          
          for (let i = 1; i < sortedData.length; i++) {
            const currentDate = parseLocalDate(sortedData[i].activity_date);
            
            if (startOfDay(currentDate).getTime() === startOfDay(previousDate).getTime()) {
              streak++;
              previousDate = addDays(previousDate, -1);
            } else {
              break;
            }
          }
        } else {
          // Last check-in was more than 1 day ago, streak is broken
          streak = 0;
        }
      }
      
      setCurrentStreak(streak);
      
      // Calculate longest streak
      if (data.length > 0) {
        let maxStreak = streak; // Start with current streak
        let tempStreak = 1;
        
        // Sort data chronologically for longest streak calculation
        const chronological = [...data].sort((a: ReadingActivity, b: ReadingActivity) => 
          new Date(a.activity_date).getTime() - new Date(b.activity_date).getTime()
        );
        
        for (let i = 1; i < chronological.length; i++) {
          const currentDate = parseLocalDate(chronological[i].activity_date);
          const prevDate = parseLocalDate(chronological[i-1].activity_date);
          
          // Check if dates are consecutive
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

      if (error) {
        if (error.code === '23505') {
          // Constraint violation - already checked in today
          setCheckedInToday(true);
          toast.info("You've already checked in today!");
        } else {
          throw error;
        }
      } else {
        toast.success("Reading activity recorded!");
        setCheckedInToday(true);
        
        // Update the streak immediately for better UX
        setCurrentStreak(prev => {
          const lastCheckWasYesterday = lastReadDate && isDateYesterday(lastReadDate);
          // If previous check was yesterday, increment streak, otherwise start at 1
          return lastCheckWasYesterday ? prev + 1 : 1;
        });
        
        // Update longest streak if needed
        setLongestStreak(prev => Math.max(prev, currentStreak + 1));
        
        // Refresh data from server to ensure everything is correct
        await fetchReadingActivity();
      }
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

  const DailyQuoteDisplay = () => {
    if (quoteLoading) {
      return (
        <div className="mt-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-md animate-pulse p-4">
          <div className="h-5 bg-amber-100/40 rounded w-5/6 mb-3"></div>
          <div className="h-5 bg-amber-100/40 rounded w-4/6 mb-3"></div>
          <div className="h-4 bg-amber-100/30 rounded w-1/3 mt-2"></div>
        </div>
      );
    }
    
    if (!dailyQuote) return null;
    
    return (
      <div className="mt-4 rounded-md border border-amber-100 overflow-hidden shadow-sm animate-fade-in bg-gradient-to-r from-amber-50/80 to-orange-50/80">
        <div className="p-4">
          <div className="flex gap-2.5">
            <Quote className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-700 font-medium italic leading-relaxed">
                {dailyQuote.quoted}
              </p>
              
              <div className="mt-2.5 text-sm text-amber-700">
                <span className="font-semibold">{dailyQuote.qauthor}</span>
                {dailyQuote.qbook && (
                  <span className="text-amber-600/80 ml-1">
                    {" • "}
                    <span className="italic">{dailyQuote.qbook}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CompactView = () => (
    <div className="flex items-center justify-between w-full px-4 py-3">
      <div className="flex items-center gap-3">
        <div className={cn(
          "rounded-full flex items-center justify-center p-1.5",
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
            {nextMilestone > currentStreak ? `${nextMilestone - currentStreak} to milestone` : 'Milestone reached!'}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {longestStreak > 0 && (
          <div className="flex items-center">
            <Trophy className="h-3.5 w-3.5 text-amber-500 mr-1" />
            <span className="text-xs font-medium">{longestStreak}</span>
          </div>
        )}
        
        <Button 
          onClick={handleCheckIn}
          disabled={checkedInToday || isLoading}
          size="sm"
          className={cn(
            "shadow-sm h-8 text-xs font-medium min-w-[5rem]",
            checkedInToday 
              ? "bg-green-500 hover:bg-green-600 text-white" 
              : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
          )}
        >
          {checkedInToday ? (
            <span className="flex items-center justify-center w-full">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Complete
            </span>
          ) : "Check In"}
        </Button>
        
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="p-1 h-8 w-8 rounded-full">
            <ChevronDown size={15} />
          </Button>
        </CollapsibleTrigger>
      </div>
    </div>
  );

  const FullView = () => (
    <>
      <div className="flex items-center justify-between mb-5">
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
            <p className="text-sm text-gray-600">Current Streak</p>
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

      <div className="flex items-center gap-1.5 mb-2 mt-3 text-sm">
        <Trophy className="h-4 w-4 text-amber-600" />
        <span className="font-medium">Longest Streak: {longestStreak} days</span>
      </div>

      <div className="space-y-2 mt-3">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Progress to {nextMilestone} days</span>
          <span>{currentStreak}/{nextMilestone}</span>
        </div>
        <Progress value={progress} className="h-2 bg-gray-200" />
      </div>

      <div className="flex flex-wrap gap-1.5 mt-4">
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

      <DailyQuoteDisplay />
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
