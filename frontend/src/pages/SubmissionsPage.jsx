import { useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardListIcon } from "lucide-react";
import Navbar from "../components/Navbar";
import SubmissionTable from "../components/SubmissionTable";
import { useMySubmissions } from "../hooks/useSubmissions";

const STATUS_OPTIONS = ["", "accepted", "wrong_answer", "compilation_error", "runtime_error", "time_limit_exceeded"];
const LANGUAGE_OPTIONS = ["", "javascript", "python", "java"];
const TYPE_OPTIONS = ["", "individual_practice", "session_battle"];

function SubmissionsPage() {
  const [filters, setFilters] = useState({ page: 1, limit: 20 });

  const { data, isLoading, isError } = useMySubmissions(filters);

  const submissions = data?.submissions || [];
  const pagination = data?.pagination;

  const handleFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="size-10 rounded-xl bg-[#00ff88]/10 flex items-center justify-center">
            <ClipboardListIcon className="size-5 text-[#00ff88]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">My Submissions</h1>
            <p className="text-sm text-base-content/50">Your full submission history</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            className="select select-sm bg-[#181824] border-[#00ff88]/20 text-base-content"
            value={filters.status || ""}
            onChange={(e) => handleFilter("status", e.target.value)}
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.filter(Boolean).map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>

          <select
            className="select select-sm bg-[#181824] border-[#00ff88]/20 text-base-content"
            value={filters.language || ""}
            onChange={(e) => handleFilter("language", e.target.value)}
          >
            <option value="">All Languages</option>
            {LANGUAGE_OPTIONS.filter(Boolean).map((l) => (
              <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
            ))}
          </select>

          <select
            className="select select-sm bg-[#181824] border-[#00ff88]/20 text-base-content"
            value={filters.submissionType || ""}
            onChange={(e) => handleFilter("submissionType", e.target.value)}
          >
            <option value="">All Types</option>
            {TYPE_OPTIONS.filter(Boolean).map((t) => (
              <option key={t} value={t}>{t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>
            ))}
          </select>
        </div>

        {/* Content */}
        <div className="bg-[#10101a] border border-white/5 rounded-2xl overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <span className="loading loading-spinner loading-lg text-[#00ff88]" />
            </div>
          ) : isError ? (
            <div className="text-center py-16 text-error">Failed to load submissions.</div>
          ) : (
            <SubmissionTable submissions={submissions} />
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              className="btn btn-sm btn-ghost"
              disabled={filters.page <= 1}
              onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
            >
              ← Prev
            </button>
            <span className="text-sm text-base-content/60">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              className="btn btn-sm btn-ghost"
              disabled={filters.page >= pagination.totalPages}
              onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SubmissionsPage;
