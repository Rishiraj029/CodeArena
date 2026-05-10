import { getDifficultyBadgeClass } from "../lib/utils";
function ProblemDescription({ problem, currentProblemId, onProblemChange, allProblems }) {
  return (
    <div className="h-full overflow-y-auto bg-base-200 scrollbar-thin scrollbar-thumb-base-300">
      {/* Header - Sticky */}
      <div className="sticky top-0 z-10 p-6 bg-base-100 border-b border-base-300 shadow-sm">
        <div className="flex items-start justify-between mb-3">
          <h1 className="text-3xl font-bold text-base-content">{problem.title}</h1>
          <span className={`badge ${getDifficultyBadgeClass(problem.difficulty)}`}>{problem.difficulty}</span>
        </div>
        <p className="text-base-content/60 text-base mb-4">{problem.category}</p>
        <select
          className="select select-bordered select-sm w-full"
          value={currentProblemId}
          onChange={(e) => onProblemChange(e.target.value)}
        >
          {allProblems.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} - {p.difficulty}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6 text-base leading-relaxed">
        {/* Description */}
        <div className="bg-base-100 rounded-lg shadow-sm p-5 border border-base-300 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-bold text-base-content mb-4">Description</h2>
          <div className="space-y-3">
            <p className="text-base-content/90">{problem.description.text}</p>
            {problem.description.notes.map((note, idx) => (
              <p key={idx} className="text-base-content/90">
                {note}
              </p>
            ))}
          </div>
        </div>

        {/* Examples */}
        <div className="bg-base-100 rounded-lg shadow-sm p-5 border border-base-300 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-bold mb-4 text-base-content">Examples</h2>
          <div className="space-y-4">
            {problem.examples.map((example, idx) => (
              <div key={idx} className="bg-base-200 rounded-md p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge badge-xs badge-primary">{idx + 1}</span>
                  <p className="font-semibold text-base text-base-content">Example {idx + 1}</p>
                </div>
                <div className="bg-base-300 rounded-md p-4 font-mono text-sm space-y-2">
                  <div className="flex gap-2">
                    <span className="text-primary font-bold min-w-fit">Input:</span>
                    <span className="text-base-content/80">{example.input}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-secondary font-bold min-w-fit">Output:</span>
                    <span className="text-base-content/80">{example.output}</span>
                  </div>
                  {example.explanation && (
                    <div className="pt-2 border-t border-base-300 mt-2">
                      <span className="text-base-content/70 font-sans text-base">
                        <span className="font-semibold">Explanation:</span> {example.explanation}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Constraints */}
        <div className="bg-base-100 rounded-lg shadow-sm p-5 border border-base-300 hover:shadow-md transition-shadow mb-4">
          <h2 className="text-xl font-bold mb-4 text-base-content">Constraints</h2>
          <ul className="space-y-3 text-base-content/85">
            {problem.constraints.map((constraint, idx) => (
              <li key={idx} className="flex gap-2 text-base">
                <span className="text-primary font-bold">▸</span>
                <code className="text-base">{constraint}</code>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProblemDescription;