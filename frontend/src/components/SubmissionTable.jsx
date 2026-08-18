import { Link } from "react-router-dom";
import SubmissionStatusBadge from "./SubmissionStatusBadge";

function SubmissionTable({ submissions }) {
  if (!submissions || submissions.length === 0) {
    return (
      <div className="text-center py-16 text-base-content/50">
        <p className="text-lg">No submissions yet.</p>
        <p className="text-sm mt-1">Start solving problems to see your history here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr className="text-base-content/60 text-xs uppercase tracking-wider">
            <th>Problem</th>
            <th>Status</th>
            <th>Language</th>
            <th>Runtime</th>
            <th>Memory</th>
            <th>Type</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub) => (
            <tr key={sub._id} className="hover cursor-pointer">
              <td>
                <Link
                  to={`/submissions/${sub._id}`}
                  className="font-semibold text-[#00ff88] hover:underline"
                >
                  {sub.problemTitle || sub.problemId}
                </Link>
              </td>
              <td>
                <SubmissionStatusBadge status={sub.status} />
              </td>
              <td className="capitalize text-sm">{sub.language}</td>
              <td className="text-sm font-mono">
                {sub.executionTime != null ? `${Math.round(sub.executionTime)} ms` : "—"}
              </td>
              <td className="text-sm font-mono">
                {sub.memoryUsage != null ? `${sub.memoryUsage} KB` : "—"}
              </td>
              <td>
                <span className="badge badge-xs badge-ghost capitalize">
                  {sub.submissionType?.replace(/_/g, " ")}
                </span>
              </td>
              <td className="text-sm text-base-content/60">
                {new Date(sub.submittedAt || sub.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SubmissionTable;
