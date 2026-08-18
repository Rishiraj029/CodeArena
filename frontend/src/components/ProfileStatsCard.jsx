import {
  TrophyIcon,
  CheckCircleIcon,
  ZapIcon,
  FlameIcon,
  CodeIcon,
  TargetIcon,
} from "lucide-react";

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div
      className={`bg-[#10101a] border rounded-2xl p-5 flex flex-col gap-2 transition-transform hover:scale-105`}
      style={{ borderColor: accent ? "#00ff88" : "rgba(255,255,255,0.08)" }}
    >
      <div className="flex items-center gap-2 text-base-content/60 text-xs uppercase tracking-wide font-semibold">
        <Icon className="w-4 h-4" style={{ color: accent || "#00ff88" }} />
        {label}
      </div>
      <span className="text-3xl font-black text-white">{value ?? "—"}</span>
    </div>
  );
}

function ProfileStatsCard({ stats }) {
  if (!stats) return null;

  const {
    totalSubmissions,
    acceptedSubmissions,
    uniqueProblemsSolved,
    acceptanceRate,
    preferredLanguage,
    currentStreak,
    longestStreak,
  } = stats;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <StatCard
        icon={TrophyIcon}
        label="Problems Solved"
        value={uniqueProblemsSolved}
        accent="#00ff88"
      />
      <StatCard
        icon={CheckCircleIcon}
        label="Accepted"
        value={acceptedSubmissions}
      />
      <StatCard
        icon={TargetIcon}
        label="Acceptance Rate"
        value={`${acceptanceRate}%`}
      />
      <StatCard
        icon={ZapIcon}
        label="Total Submissions"
        value={totalSubmissions}
      />
      <StatCard
        icon={FlameIcon}
        label="Current Streak"
        value={`${currentStreak} days`}
      />
      <StatCard
        icon={FlameIcon}
        label="Longest Streak"
        value={`${longestStreak} days`}
      />
      <StatCard
        icon={CodeIcon}
        label="Preferred Language"
        value={preferredLanguage ? preferredLanguage.charAt(0).toUpperCase() + preferredLanguage.slice(1) : "N/A"}
      />
    </div>
  );
}

export default ProfileStatsCard;
