import { useUser } from "@clerk/clerk-react";
import { ArrowRightIcon, SparklesIcon, ZapIcon } from "lucide-react";

function WelcomeSection({ onCreateSession }) {
  const { user } = useUser();

  return (
    <div className="relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00ff88] to-emerald-400 flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-black" />
              </div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-[#00ff88] via-emerald-400 to-[#00ff88] bg-clip-text text-transparent leading-tight pb-1">
                Welcome back, {user?.firstName || "there"}!
              </h1>
            </div>
            <p className="text-xl text-gray-400 ml-16">
              Ready to level up your coding skills?
            </p>
          </div>
          <button
            onClick={onCreateSession}
            className="group px-8 py-4 bg-[#00ff88] hover:bg-emerald-400 rounded-2xl transition-all duration-200 hover:opacity-90 shadow-lg shadow-[#00ff88]/20"
          >
            <div className="flex items-center gap-3 text-black font-bold text-lg">
              <ZapIcon className="w-6 h-6" />
              <span>Create Session</span>
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;