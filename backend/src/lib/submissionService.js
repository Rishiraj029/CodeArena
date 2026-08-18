import axios from "axios";

const JUDGE0_API = "https://ce.judge0.com/submissions/?base64_encoded=false&wait=true";

export const LANGUAGE_IDS = {
  javascript: 63, // Node.js
  python: 71,     // Python 3
  java: 62,       // Java (OpenJDK 13)
};

/**
 * Send source code to Judge0 and wait for the result.
 * @param {string} sourceCode
 * @param {number} judge0LanguageId
 * @param {string} [stdin=""]
 * @returns {Promise<object>} Judge0 response data
 */
export async function sendToJudge0(sourceCode, judge0LanguageId, stdin = "") {
  const response = await axios.post(
    JUDGE0_API,
    {
      source_code: sourceCode,
      language_id: judge0LanguageId,
      stdin,
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
}

/**
 * Map a Judge0 response to an internal submission status.
 * Judge0 status IDs:
 *   1 = In Queue, 2 = Processing, 3 = Accepted, 4 = Wrong Answer,
 *   5 = TLE, 6 = Compilation Error, 7-12 = Runtime Errors, 13 = Internal Error
 * @param {object} judge0Data  Raw Judge0 response
 * @param {string|null} expectedOutput  Optional expected stdout to check
 * @returns {{ status, isAccepted, stdout, stderr, compilerOutput, executionTime, memoryUsage }}
 */
export function mapJudge0Status(judge0Data, expectedOutput = null) {
  const statusId = judge0Data?.status?.id;
  const stdout = judge0Data?.stdout || "";
  const stderr = judge0Data?.stderr || "";
  const compileOutput = judge0Data?.compile_output || "";
  const executionTime = judge0Data?.time ? parseFloat(judge0Data.time) * 1000 : null; // ms
  const memoryUsage = judge0Data?.memory || null; // KB

  let status;
  let isAccepted = false;

  if (statusId === 1 || statusId === 2) {
    status = "processing";
  } else if (statusId === 3) {
    // Judge0 says "Accepted" — but we also verify against expected output when available
    if (expectedOutput !== null) {
      const normalizedActual = normalizeOutput(stdout);
      const normalizedExpected = normalizeOutput(expectedOutput);
      isAccepted = normalizedActual === normalizedExpected;
      status = isAccepted ? "accepted" : "wrong_answer";
    } else {
      // No expected output provided — trust Judge0
      isAccepted = true;
      status = "accepted";
    }
  } else if (statusId === 4) {
    status = "wrong_answer";
  } else if (statusId === 5) {
    status = "time_limit_exceeded";
  } else if (statusId === 6) {
    status = "compilation_error";
  } else if (statusId >= 7 && statusId <= 12) {
    status = "runtime_error";
  } else if (statusId === 13) {
    status = "internal_error";
  } else {
    // stderr without a specific status → runtime error
    status = stderr ? "runtime_error" : "internal_error";
  }

  return {
    status,
    isAccepted,
    stdout,
    stderr,
    compilerOutput: compileOutput,
    executionTime,
    memoryUsage,
    judge0Token: judge0Data?.token || "",
  };
}

/**
 * Normalize output for comparison (trim whitespace, normalize brackets/commas).
 */
function normalizeOutput(output) {
  if (!output) return "";
  return output
    .trim()
    .split("\n")
    .map((line) =>
      line
        .trim()
        .replace(/\[\s+/g, "[")
        .replace(/\s+\]/g, "]")
        .replace(/\s*,\s*/g, ",")
    )
    .filter((line) => line.length > 0)
    .join("\n");
}
