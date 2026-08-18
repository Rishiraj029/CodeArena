import { useParams } from "react-router-dom";
import { UserCircle2Icon } from "lucide-react";
import Navbar from "../components/Navbar";
import ProfileStatsCard from "../components/ProfileStatsCard";
import ContributionHeatmap from "../components/ContributionHeatmap";
import SubmissionTable from "../components/SubmissionTable";
import { useUserProfile, useUserActivity, useMySubmissions } from "../hooks/useSubmissions";
import { useUser } from "@clerk/clerk-react";

function UserProfilePage() {
  const { userId } = useParams();
  const { user: currentUser } = useUser();

  const { data: profileData, isLoading: loadingProfile } = useUserProfile(userId);
  const { data: activityData, isLoading: loadingActivity } = useUserActivity(userId);

  // Only show recent submissions if viewing own profile
  const isOwnProfile = currentUser?.id === userId;
  const { data: submissionsData } = useMySubmissions(
    isOwnProfile ? { limit: 5 } : null
  );

  const profile = profileData?.user;
  const stats = profileData?.stats;
  const activity = activityData || [];
  const recentSubmissions = submissionsData?.submissions || [];

  const isLoading = loadingProfile || loadingActivity;

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <span className="loading loading-spinner loading-lg text-[#00ff88]" />
          </div>
        ) : !profile ? (
          <div className="text-center py-24 text-error">User not found.</div>
        ) : (
          <div className="space-y-8">
            {/* Profile Header */}
            <div className="bg-[#10101a] border border-white/5 rounded-2xl p-6 flex items-center gap-5">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                  className="w-20 h-20 rounded-full border-2 border-[#00ff88]/40 object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full border-2 border-[#00ff88]/40 bg-[#0a0a0f] flex items-center justify-center">
                  <UserCircle2Icon className="w-12 h-12 text-[#00ff88]/60" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-black text-white">{profile.name}</h1>
                <p className="text-sm text-base-content/50 mt-0.5">{profile.email}</p>
                <span className="mt-2 inline-block badge badge-outline badge-sm text-[#00ff88] border-[#00ff88]/40">
                  CodeArena Member
                </span>
              </div>
            </div>

            {/* Stats */}
            <div>
              <h2 className="text-lg font-bold text-white mb-4">Statistics</h2>
              <ProfileStatsCard stats={stats} />
            </div>

            {/* Contribution Heatmap */}
            <div className="bg-[#10101a] border border-white/5 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Activity</h2>
              <ContributionHeatmap activity={activity} />
            </div>

            {/* Recent Submissions (own profile only) */}
            {isOwnProfile && recentSubmissions.length > 0 && (
              <div className="bg-[#10101a] border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Recent Submissions</h2>
                  <a href="/submissions" className="text-sm text-[#00ff88] hover:underline">
                    View All
                  </a>
                </div>
                <SubmissionTable submissions={recentSubmissions} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfilePage;
