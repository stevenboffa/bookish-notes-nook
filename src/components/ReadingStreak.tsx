
import React from "react";
import { useEffect, useState } from "react";
import { differenceInDays, format, isYesterday, isToday, parseISO, startOfDay } from "date-fns";
import { Flame, Calendar, Trophy, ChevronUp, ChevronDown, CheckCircle2, Quote } from "lucide-react";
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

export function ReadingStreak() {
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [longestStreak, setLongestStreak] = useState<number>(0);
  const [lastReadDate, setLastReadDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [checkedInToday, setCheckedInToday] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(true);
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
    const localYesterday = new Date(localToday);
    localYesterday.setDate(localYesterday.getDate() - 1);
    return startOfDay(date).getTime() === localYesterday.getTime();
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchReadingActivity();
      fetchDailyQuote();
    } else {
      // If no authenticated user, just fetch a random quote without tracking
      fetchRandomQuote();
    }
  }, [session?.user?.id]);

  const fetchDailyQuote = async () => {
    try {
      setQuoteLoading(true);
      const userId = session?.user?.id;
      
      if (!userId) return;

      const todayDateString = getTodayDateString();
      
      // First check if user already has a quote assigned for today
      const { data: todaysQuote, error: todaysQuoteError } = await supabase
        .from('user_seen_quotes')
        .select('quote_id, streak_quotes(*)')
        .eq('user_id', userId)
        .gte('seen_date', `${todayDateString}T00:00:00`)
        .lt('seen_date', `${todayDateString}T23:59:59.999`)
        .limit(1);
      
      if (todaysQuoteError) throw todaysQuoteError;
      
      // If user already has a quote for today, use it
      if (todaysQuote && todaysQuote.length > 0 && todaysQuote[0].streak_quotes) {
        setDailyQuote(todaysQuote[0].streak_quotes as DailyQuote);
        setQuoteLoading(false);
        return;
      }

      // Get a list of authors that have been seen in the last 10 days
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
      
      const { data: recentAuthors, error: recentAuthorsError } = await supabase
        .from('user_seen_quotes')
        .select('streak_quotes!inner(qauthor)')
        .eq('user_id', userId)
        .gte('seen_date', tenDaysAgo.toISOString());

      if (recentAuthorsError) throw recentAuthorsError;
      
      // Extract unique authors from recent quotes
      const recentAuthorsList = recentAuthors?.map(item => 
        (item as any).streak_quotes?.qauthor as string
      ).filter(Boolean) || [];
      
      // Get all quotes the user has already seen
      const { data: seenQuotes, error: seenQuotesError } = await supabase
        .from('user_seen_quotes')
        .select('quote_id')
        .eq('user_id', userId);

      if (seenQuotesError) throw seenQuotesError;
      
      const seenQuoteIds = seenQuotes?.map(item => item.quote_id) || [];

      // Query that excludes quotes from recently seen authors and already seen quotes
      let query = supabase
        .from('streak_quotes')
        .select('*');
      
      // Add filter for unseen quotes if the user has seen any
      if (seenQuoteIds.length > 0) {
        query = query.not('id', 'in', `(${seenQuoteIds.join(',')})`);
      }
      
      // Add filter for authors if there are recent authors
      if (recentAuthorsList.length > 0) {
        query = query.not('qauthor', 'in', `(${recentAuthorsList.map(a => `"${a}"`).join(',')})`);
      }
      
      // Limit to 1 random quote
      query = query.limit(1).order('id', { ascending: false });
      
      const { data: quotes, error: quotesError } = await query;

      if (quotesError) throw quotesError;
      
      // If we found a suitable quote
      if (quotes && quotes.length > 0) {
        const newQuote = quotes[0] as DailyQuote;
        setDailyQuote(newQuote);
        
        // Record this quote as seen by the user
        const { error: insertError } = await supabase
          .from('user_seen_quotes')
          .insert({
            user_id: userId,
            quote_id: newQuote.id,
            seen_date: new Date().toISOString() // Ensure we store the current date
          });
          
        if (insertError) throw insertError;
      } else {
        // If no suitable quote found (all quotes seen or all by recent authors),
        // get a random quote without constraints
        await fetchRandomQuote();
      }
    } catch (error) {
      console.error('Error fetching daily quote:', error);
      // Fallback to any random quote
      await fetchRandomQuote();
    } finally {
      setQuoteLoading(false);
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
        
        // If user is authenticated, record this quote as seen
        if (session?.user?.id) {
          const { error: insertError } = await supabase
            .from('user_seen_quotes')
            .insert({
              user_id: session.user.id,
              quote_id: data[0].id,
              seen_date: new Date().toISOString()
            });
            
          if (insertError) {
            console.error('Error recording seen quote:', insertError);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching random quote:', error);
      // Fallback to a static quote
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

  const DailyQuoteDisplay = () => {
    if (quoteLoading) {
      return (
        <div className="mt-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-md animate-pulse">
          <div className="h-5 bg-amber-100 rounded w-4/5 mb-2"></div>
          <div className="h-4 bg-amber-100/70 rounded w-1/3"></div>
        </div>
      );
    }
    
    if (!dailyQuote) return null;
    
    return (
      <div className="mt-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-md">
        <div className="flex gap-2">
          <Quote className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-900 font-medium italic">{dailyQuote.quoted}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-amber-700">— {dailyQuote.qauthor}</p>
              {dailyQuote.qbook && (
                <p className="text-xs text-amber-600 italic">{dailyQuote.qbook}</p>
              )}
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
