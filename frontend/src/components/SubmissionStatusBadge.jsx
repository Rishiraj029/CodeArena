const STATUS_CONFIG = {
  accepted: { label: "Accepted", className: "badge-success" },
  wrong_answer: { label: "Wrong Answer", className: "badge-error" },
  compilation_error: { label: "Compile Error", className: "badge-warning" },
  runtime_error: { label: "Runtime Error", className: "badge-warning" },
  time_limit_exceeded: { label: "TLE", className: "badge-warning" },
  memory_limit_exceeded: { label: "MLE", className: "badge-warning" },
  internal_error: { label: "Internal Error", className: "badge-ghost" },
  pending: { label: "Pending", className: "badge-ghost" },
  processing: { label: "Processing", className: "badge-info" },
};

function SubmissionStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, className: "badge-ghost" };

  return (
    <span className={`badge badge-sm font-semibold ${config.className}`}>
      {config.label}
    </span>
  );
}

export default SubmissionStatusBadge;
