import { useParams, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { ArrowLeftIcon } from "lucide-react";
import Navbar from "../components/Navbar";
import SubmissionStatusBadge from "../components/SubmissionStatusBadge";
import { useSubmissionById } from "../hooks/useSubmissions";

function SubmissionDetailPage() {
  const { submissionId } = useParams();
  const { data: submission, isLoading, isError } = useSubmissionById(submissionId);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {/* Back link */}
        <Link
          to="/submissions"
          className="inline-flex items-center gap-2 text-sm text-base-content/60 hover:text-[#00ff88] mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Submissions
        </Link>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <span className="loading loading-spinner loading-lg text-[#00ff88]" />
          </div>
        ) : isError || !submission ? (
          <div className="text-center py-24 text-error">Submission not found.</div>
        ) : (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-[#10101a] border border-white/5 rounded-2xl p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-xl font-black text-white">
                    {submission.problemTitle || submission.problemId}
                  </h1>
                  <p className="text-sm text-base-content/50 mt-1">
                    {new Date(submission.submittedAt || submission.createdAt).toLocaleString()}
                  </p>
                </div>
                <SubmissionStatusBadge status={submission.status} />
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div className="bg-[#0a0a0f] rounded-xl p-3">
                  <p className="text-xs text-base-content/50 uppercase tracking-wide">Language</p>
                  <p className="text-base font-bold capitalize text-white mt-0.5">
                    {submission.language}
                  </p>
                </div>
                <div className="bg-[#0a0a0f] rounded-xl p-3">
                  <p className="text-xs text-base-content/50 uppercase tracking-wide">Runtime</p>
                  <p className="text-base font-bold text-white mt-0.5">
                    {submission.executionTime != null
                      ? `${Math.round(submission.executionTime)} ms`
                      : "—"}
                  </p>
                </div>
                <div className="bg-[#0a0a0f] rounded-xl p-3">
                  <p className="text-xs text-base-content/50 uppercase tracking-wide">Memory</p>
                  <p className="text-base font-bold text-white mt-0.5">
                    {submission.memoryUsage != null ? `${submission.memoryUsage} KB` : "—"}
                  </p>
                </div>
                <div className="bg-[#0a0a0f] rounded-xl p-3">
                  <p className="text-xs text-base-content/50 uppercase tracking-wide">Type</p>
                  <p className="text-base font-bold capitalize text-white mt-0.5">
                    {submission.submissionType?.replace(/_/g, " ")}
                  </p>
                </div>
              </div>
            </div>

            {/* Source Code */}
            <div className="bg-[#10101a] border border-white/5 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
                <span className="text-sm font-semibold text-base-content/70">Source Code</span>
                <span className="text-xs text-base-content/40 capitalize">{submission.language}</span>
              </div>
              <div style={{ height: "400px" }}>
                <Editor
                  height="100%"
                  language={submission.language === "javascript" ? "javascript" : submission.language}
                  value={submission.sourceCode}
                  theme="vs-dark"
                  options={{
                    readOnly: true,
                    fontSize: 14,
                    lineNumbers: "on",
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    wordWrap: "on",
                  }}
                />
              </div>
            </div>

            {/* Output / Error */}
            {(submission.stdout || submission.stderr || submission.compilerOutput) && (
              <div className="bg-[#10101a] border border-white/5 rounded-2xl p-5">
                <h2 className="text-sm font-semibold text-base-content/70 mb-3">Output</h2>
                {submission.stdout && (
                  <div className="mb-3">
                    <p className="text-xs text-[#00ff88] font-semibold mb-1">stdout</p>
                    <pre className="text-sm font-mono bg-[#0a0a0f] rounded-lg p-3 text-base-content/80 overflow-x-auto whitespace-pre-wrap">
                      {submission.stdout}
                    </pre>
                  </div>
                )}
                {submission.stderr && (
                  <div className="mb-3">
                    <p className="text-xs text-red-400 font-semibold mb-1">stderr</p>
                    <pre className="text-sm font-mono bg-[#0a0a0f] rounded-lg p-3 text-red-300 overflow-x-auto whitespace-pre-wrap">
                      {submission.stderr}
                    </pre>
                  </div>
                )}
                {submission.compilerOutput && (
                  <div>
                    <p className="text-xs text-yellow-400 font-semibold mb-1">Compiler Output</p>
                    <pre className="text-sm font-mono bg-[#0a0a0f] rounded-lg p-3 text-yellow-200 overflow-x-auto whitespace-pre-wrap">
                      {submission.compilerOutput}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SubmissionDetailPage;
