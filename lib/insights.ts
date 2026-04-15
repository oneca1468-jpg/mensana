import { differenceInDays, parseISO, isValid } from "date-fns";

export interface CheckinRecord {
  id: string;
  user_id: string;
  mood: number;
  event: string | null;
  context: string | null;
  thought: string | null;
  action: string | null;
  checked_in_at: string;
  checked_in_date: string;
}

export function generateInsights(checkins: CheckinRecord[]): string[] {
  if (checkins.length < 3) return [];

  const insights: string[] = [];
  const sorted = [...checkins].sort(
    (a, b) => parseISO(a.checked_in_date).getTime() - parseISO(b.checked_in_date).getTime()
  );

  // 1. Calculate Streak
  let streak = 0;
  let currentDate = new Date(); // Or map trailing exactly from newest entry
  
  if (sorted.length > 0) {
    const newestDate = parseISO(sorted[sorted.length - 1].checked_in_date);
    const daysSinceLast = differenceInDays(currentDate, newestDate);
    
    // Valid streak continues if latest checkin was today or yesterday
    if (daysSinceLast <= 1) {
      streak = 1;
      for (let i = sorted.length - 2; i >= 0; i--) {
        const d1 = parseISO(sorted[i + 1].checked_in_date);
        const d2 = parseISO(sorted[i].checked_in_date);
        const diff = differenceInDays(d1, d2);
        
        if (diff === 1) {
          streak++;
        } else if (diff > 1) {
          break; // Streak broken
        }
      }
    }
  }

  if (streak > 2) {
    insights.push(`🔥 Há ${streak} dias consecutivos com check-in`);
  }

  // 2. Base Averages Calculation
  const totalMood = sorted.reduce((sum, c) => sum + c.mood, 0);
  const overallAvg = totalMood / sorted.length;

  // 3. Day of week analysis (0 = Sun, 1 = Mon ... 6 = Sat)
  const dayLabels = ["domingos", "segundas", "terças", "quartas", "quintas", "sextas", "sábados"];
  const dayStats: Record<number, { count: number; sum: number }> = {};
  
  sorted.forEach(c => {
    const d = parseISO(c.checked_in_date);
    if (!isValid(d)) return;
    const day = d.getDay();
    if (!dayStats[day]) dayStats[day] = { count: 0, sum: 0 };
    dayStats[day].count += 1;
    dayStats[day].sum += c.mood;
  });

  for (const [dayStr, stat] of Object.entries(dayStats)) {
    const day = parseInt(dayStr);
    const avg = stat.sum / stat.count;
    if (stat.count >= 2 && (overallAvg - avg) >= 1.5) {
      insights.push(`📉 As ${dayLabels[day]} tendem a ser difíceis`);
    } else if (stat.count >= 2 && (avg - overallAvg) >= 1.5) {
      insights.push(`📈 O teu humor é significativamente melhor às ${dayLabels[day]}`);
    }
  }

  // 4. Context Synergy (O teu humor é mais alto quando estás em X)
  const contextStats: Record<string, { count: number; sum: number }> = {};
  sorted.forEach(c => {
    if (!c.context) return;
    // Context might be comma separated strings "Trabalho, Casa"
    const chips = c.context.split(',').map(s => s.trim());
    chips.forEach(chip => {
      if (!chip) return;
      if (!contextStats[chip]) contextStats[chip] = { count: 0, sum: 0 };
      contextStats[chip].count += 1;
      contextStats[chip].sum += c.mood;
    });
  });

  let bestContext = "";
  let highestAvg = 0;

  for (const [chip, stat] of Object.entries(contextStats)) {
    if (stat.count >= 3) {
      const avg = stat.sum / stat.count;
      if (avg > highestAvg && avg > overallAvg) {
        highestAvg = avg;
        bestContext = chip;
      }
    }
  }

  if (bestContext) {
    insights.push(`✨ O teu humor é mais alto quando estás: ${bestContext}`);
  }

  return insights;
}
