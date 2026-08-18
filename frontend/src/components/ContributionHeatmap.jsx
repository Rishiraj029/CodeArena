import { useMemo } from "react";

const LEVEL_COLORS = [
  "bg-[#1a1a2e]",        // 0 — no activity
  "bg-[#00ff88]/20",    // 1 — light
  "bg-[#00ff88]/50",    // 2 — medium
  "bg-[#00ff88]",       // 3 — full
];

function ContributionHeatmap({ activity = [] }) {
  const { weeks, months } = useMemo(() => {
    // Build a lookup map by date string
    const activityMap = new Map(activity.map((a) => [a.date, a]));

    // Generate the last 52 full weeks (364 days) + extras for a full grid
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find the start: go back 52 weeks from the start of the current week
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - today.getDay() - 52 * 7);

    const totalDays = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)) + 1;

    const days = Array.from({ length: totalDays }, (_, i) => {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      const data = activityMap.get(dateStr);
      return {
        date: dateStr,
        level: data?.activityLevel ?? 0,
        count: data?.submissionCount ?? 0,
        accepted: data?.acceptedCount ?? 0,
      };
    });

    // Split into weeks (columns of 7)
    const weeksArray = [];
    for (let i = 0; i < days.length; i += 7) {
      weeksArray.push(days.slice(i, i + 7));
    }

    // Month labels — one label per unique month visible in the first row of each column
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const monthLabels = [];
    let lastMonth = -1;
    weeksArray.forEach((week, colIdx) => {
      const m = new Date(week[0]?.date).getMonth();
      if (m !== lastMonth) {
        monthLabels.push({ colIdx, label: monthNames[m] });
        lastMonth = m;
      } else {
        monthLabels.push(null);
      }
    });

    return { weeks: weeksArray, months: monthLabels };
  }, [activity]);

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex flex-col gap-1 min-w-max">
        {/* Month labels */}
        <div className="flex gap-1 pl-8">
          {months.map((m, i) =>
            m ? (
              <span key={i} className="text-[10px] text-base-content/40 w-3" style={{ minWidth: "12px" }}>
                {m.label}
              </span>
            ) : (
              <span key={i} className="w-3" style={{ minWidth: "12px" }} />
            )
          )}
        </div>

        {/* Day rows + grid */}
        <div className="flex gap-1">
          {/* Day-of-week labels */}
          <div className="flex flex-col gap-1 pr-2">
            {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
              <span key={i} className="text-[10px] text-base-content/40 h-3 leading-3">
                {d}
              </span>
            ))}
          </div>

          {/* Heatmap cells */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day, di) => (
                <div
                  key={di}
                  className={`w-3 h-3 rounded-[2px] ${LEVEL_COLORS[day.level]} border border-white/5 cursor-default group relative`}
                  title={`${day.date}: ${day.count} submissions (${day.accepted} accepted)`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 pt-2 text-[10px] text-base-content/40 justify-end">
          <span>Less</span>
          {LEVEL_COLORS.map((cls, i) => (
            <div key={i} className={`w-3 h-3 rounded-[2px] ${cls} border border-white/5`} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

export default ContributionHeatmap;
