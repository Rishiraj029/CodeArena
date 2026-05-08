import { Link } from "react-router";
import Navbar from "../components/Navbar";

import { PROBLEMS } from "../data/problems";
import { ChevronRightIcon, Code2Icon } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";


function ProblemsPage() {
  const problems = Object.values(PROBLEMS);

  const easyProblemsCount = problems.filter((p) => p.difficulty === "Easy").length;
  const mediumProblemsCount = problems.filter((p) => p.difficulty === "Medium").length;
  const hardProblemsCount = problems.filter((p) => p.difficulty === "Hard").length;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-[#00ff88]">Practice Problems</h1>
          <p className="text-gray-400">
            Sharpen your coding skills with these curated problems
          </p>
        </div>

        {/* PROBLEMS LIST */}
        <div className="space-y-4">
          {problems.map((problem) => (
            <Link
              key={problem.id}
              to={`/problem/${problem.id}`}
              className="card bg-[#0d0d16] border border-white/10 hover:border-[#00ff88] hover:scale-[1.01] transition-transform shadow-md"
            >
              <div className="card-body">
                <div className="flex items-center justify-between gap-4">
                  {/* LEFT SIDE */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="size-12 rounded-lg bg-[#00ff88]/10 flex items-center justify-center">
                        <Code2Icon className="size-6 text-[#00ff88]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-xl font-bold text-white">{problem.title}</h2>
                          <span
                            className={`badge ${getDifficultyBadgeClass(problem.difficulty)} text-xs px-2 py-1 border-0`}
                            style={{
                              backgroundColor:
                                problem.difficulty === "Easy"
                                  ? "#00ff88"
                                  : problem.difficulty === "Medium"
                                  ? "#facc15"
                                  : "#ef4444",
                              color: problem.difficulty === "Easy" ? "#0a0a0f" : "#fff",
                            }}
                          >
                            {problem.difficulty}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400"> {problem.category}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-3">{problem.description.text}</p>
                  </div>
                  {/* RIGHT SIDE */}

                  <div className="flex items-center gap-2 text-[#00ff88]">
                    <span className="font-medium">Solve</span>
                    <ChevronRightIcon className="size-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* STATS FOOTER */}
        <div className="mt-12 card bg-[#0d0d16] shadow-lg border border-white/10">
          <div className="card-body">
            <div className="stats stats-vertical lg:stats-horizontal">
              <div className="stat">
                <div className="stat-title text-gray-400">Total Problems</div>
                <div className="stat-value text-[#00ff88]">{problems.length}</div>
              </div>
              <div className="stat">
                <div className="stat-title text-gray-400">Easy</div>
                <div className="stat-value" style={{ color: '#00ff88' }}>{easyProblemsCount}</div>
              </div>
              <div className="stat">
                <div className="stat-title text-gray-400">Medium</div>
                <div className="stat-value" style={{ color: '#facc15' }}>{mediumProblemsCount}</div>
              </div>
              <div className="stat">
                <div className="stat-title text-gray-400">Hard</div>
                <div className="stat-value" style={{ color: '#ef4444' }}>{hardProblemsCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProblemsPage;