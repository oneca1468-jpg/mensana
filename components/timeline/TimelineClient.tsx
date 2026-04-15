"use client";

import { useState, useMemo } from "react";
import { format, parseISO, subDays } from "date-fns";
import { pt } from "date-fns/locale";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { generateInsights, type CheckinRecord } from "@/lib/insights";

interface TimelineClientProps {
  checkins: CheckinRecord[];
}

export function TimelineClient({ checkins }: TimelineClientProps) {
  const [range, setRange] = useState<7 | 14 | 30>(14);
  const [selectedCheckin, setSelectedCheckin] = useState<CheckinRecord | null>(null);

  // Filter checkins by range
  const filteredData = useMemo(() => {
    const cutoff = subDays(new Date(), range);
    return checkins.filter(c => parseISO(c.checked_in_date) >= cutoff)
      .map(c => ({
        ...c,
        displayDate: format(parseISO(c.checked_in_date), "dd MMM", { locale: pt }),
      }));
  }, [checkins, range]);

  const insights = useMemo(() => generateInsights(checkins), [checkins]);

  // Extract streak if it exists at the beginning of insights
  const streakInsightIndex = insights.findIndex(i => i.includes("consecutivos"));
  const streakText = streakInsightIndex >= 0 ? insights[streakInsightIndex] : null;
  const filteredInsights = insights.filter((_, idx) => idx !== streakInsightIndex);

  const handleChartClick = (state: any) => {
    if (state && state.activePayload && state.activePayload.length > 0) {
      setSelectedCheckin(state.activePayload[0].payload as CheckinRecord);
    }
  };

  return (
    <div className="flex flex-col flex-1 pb-20 pt-6 px-4 max-w-2xl mx-auto w-full">
      {/* Top Streak */}
      {streakText && (
        <div className="bg-primary/10 text-primary font-bold px-4 py-2 rounded-full text-center mb-8 mx-auto inline-block border border-primary/20">
          {streakText}
        </div>
      )}

      {/* Toggles */}
      <div className="flex bg-secondary p-1 rounded-xl mb-6">
        {[7, 14, 30].map(days => (
          <button
            key={days}
            onClick={() => setRange(days as any)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${range === days ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
          >
            {days} Dias
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-secondary/20 rounded-2xl p-4 mb-8 h-80 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} onClick={handleChartClick}>
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" /> {/* 10 High - Green */}
                <stop offset="30%" stopColor="#eab308" /> {/* 7 Medium - Amber */}
                <stop offset="60%" stopColor="#fb923c" /> {/* 4 Low - Coral */}
                <stop offset="100%" stopColor="#ef4444" /> {/* 1 Lowest - Red */}
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
            <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} minTickGap={20} />
            <YAxis domain={[1, 10]} ticks={[1, 5, 10]} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="url(#moodGradient)"
              strokeWidth={4}
              dot={{ r: 5, strokeWidth: 2, fill: "hsl(var(--background))", stroke: "#eab308" }}
              activeDot={{ r: 8, strokeWidth: 0, fill: "hsl(var(--primary))", style: { cursor: 'pointer' } }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Insight Cards */}
      <div className="space-y-3">
        <h3 className="font-bold text-xl mb-4">Padrões Encontrados</h3>
        {filteredInsights.length > 0 ? (
          filteredInsights.map((insight, idx) => (
            <div key={idx} className="bg-secondary/40 border border-secondary p-4 rounded-xl">
              <p className="font-medium text-lg leading-tight">{insight}</p>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-center p-6 bg-secondary/20 rounded-xl">
            Ainda não há dados suficientes para encontrar padrões além duma streak.
          </p>
        )}
      </div>

      {/* Bottom Sheet for Details */}
      <Drawer open={!!selectedCheckin} onOpenChange={(open) => !open && setSelectedCheckin(null)}>
        <DrawerContent className="max-h-[85dvh]">
          {selectedCheckin && (
            <div className="p-6 max-w-sm mx-auto w-full overflow-y-auto">
              <DrawerHeader className="px-0 pt-0">
                <DrawerTitle className="text-2xl font-black">{format(parseISO(selectedCheckin.checked_in_date), "dd 'de' MMMM", { locale: pt })}</DrawerTitle>
                <div className="text-4xl mt-2">{selectedCheckin.mood}/10</div>
              </DrawerHeader>
              
              <div className="space-y-6 mt-4 pb-12">
                {selectedCheckin.event && (
                  <div>
                    <h4 className="text-sm uppercase tracking-wider font-bold text-muted-foreground mb-1">Acontecimento</h4>
                    <p className="text-lg leading-relaxed">{selectedCheckin.event}</p>
                  </div>
                )}
                {selectedCheckin.context && (
                  <div>
                    <h4 className="text-sm uppercase tracking-wider font-bold text-muted-foreground mb-2">Contexto</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCheckin.context.split(',').map(ctx => (
                        <span key={ctx} className="bg-secondary rounded-md px-3 py-1 font-medium">{ctx.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}
                {selectedCheckin.thought && (
                  <div>
                    <h4 className="text-sm uppercase tracking-wider font-bold text-muted-foreground mb-1">Pensamentos</h4>
                    <p className="text-lg italic">&quot;{selectedCheckin.thought}&quot;</p>
                  </div>
                )}
                {selectedCheckin.action && (
                  <div>
                    <h4 className="text-sm uppercase tracking-wider font-bold text-muted-foreground mb-1">Ação</h4>
                    <p className="text-lg bg-secondary/30 p-3 rounded-lg border">{selectedCheckin.action}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}

// Minimal tooltip to not distract if drawn automatically, rely on Bottom Sheet for details
function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border shadow-xl rounded-lg p-3">
        <p className="font-bold text-lg mb-1">{payload[0].payload.displayDate}</p>
        <p className="text-sm font-medium">Toque para ver detalhes ✨</p>
      </div>
    );
  }
  return null;
}
