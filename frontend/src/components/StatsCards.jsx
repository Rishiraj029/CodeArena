import { TrophyIcon, UsersIcon } from "lucide-react";

function StatsCards({ activeSessionsCount, recentSessionsCount }) {
  return (
    <div className="lg:col-span-1 grid grid-cols-1 gap-6">
      {/* Active Count */}
      <div className="card bg-[#111a1a] border-2 border-[#00ff88]/30 hover:border-[#00ff88]/60">
        <div className="card-body">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-[#00ff88]/10 rounded-2xl">
              <UsersIcon className="w-7 h-7 text-[#00ff88]" />
            </div>
            <div className="badge bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/40">Live</div>
          </div>
          <div className="text-4xl font-black mb-1">{activeSessionsCount}</div>
          <div className="text-sm opacity-60">Active Sessions</div>
        </div>
      </div>

      {/* Recent Count */}
      <div className="card bg-[#111a1a] border-2 border-[#00ff88]/20 hover:border-[#00ff88]/40">
        <div className="card-body">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-[#00ff88]/10 rounded-2xl">
              <TrophyIcon className="w-7 h-7 text-[#00ff88]" />
            </div>
            <div className="badge bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30">All</div>
          </div>
          <div className="text-4xl font-black mb-1">{recentSessionsCount}</div>
          <div className="text-sm opacity-60">Total Sessions</div>
        </div>
      </div>
    </div>
  );
}

export default StatsCards;