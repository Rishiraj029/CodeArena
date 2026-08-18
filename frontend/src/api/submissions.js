const BASE_URL = "/api";

/**
 * Submit a solution for official evaluation.
 * @param {{ problemId, problemTitle, language, sourceCode, submissionType, sessionId?, battleId? }} payload
 */
export async function submitSolution(payload) {
  const response = await fetch(`${BASE_URL}/submissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to submit solution");
  return data.submission;
}

/**
 * Get the current user's submissions with optional filters and pagination.
 * @param {{ page?, limit?, status?, language?, problemId?, submissionType? }} filters
 */
export async function getMySubmissions(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") params.set(k, v);
  });

  const response = await fetch(`${BASE_URL}/submissions/me?${params.toString()}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch submissions");
  return data;
}

/**
 * Get a single submission by ID (owner only).
 * @param {string} id
 */
export async function getSubmissionById(id) {
  const response = await fetch(`${BASE_URL}/submissions/${id}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Submission not found");
  return data.submission;
}

/**
 * Get public profile stats for a user (by Clerk userId).
 * @param {string} userId
 */
export async function getUserProfile(userId) {
  const response = await fetch(`${BASE_URL}/users/${userId}/profile`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "User not found");
  return data;
}

/**
 * Get daily activity data for a user's contribution heatmap.
 * @param {string} userId
 */
export async function getUserActivity(userId) {
  const response = await fetch(`${BASE_URL}/users/${userId}/activity`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch activity");
  return data.activity;
}
