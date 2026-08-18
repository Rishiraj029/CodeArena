import Submission from "../models/Submission.js";
import User from "../models/User.js";
import { LANGUAGE_IDS, sendToJudge0, mapJudge0Status } from "../lib/submissionService.js";

// ─── POST /api/submissions ────────────────────────────────────────────────────
export async function createAndExecuteSubmission(req, res) {
  try {
    const { problemId, problemTitle, language, sourceCode, submissionType, sessionId, battleId } =
      req.body;

    // Validate required fields
    if (!problemId || !language || !sourceCode?.trim()) {
      return res.status(400).json({ message: "problemId, language, and sourceCode are required." });
    }

    const judge0LanguageId = LANGUAGE_IDS[language];
    if (!judge0LanguageId) {
      return res.status(400).json({ message: `Unsupported language: ${language}` });
    }

    const type = submissionType || "individual_practice";
    const validTypes = ["individual_practice", "session_battle", "contest", "interview"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid submissionType." });
    }

    // Create a pending submission record first
    const submission = await Submission.create({
      user: req.user._id,
      problemId,
      problemTitle: problemTitle || problemId,
      session: sessionId || null,
      battleId: battleId || null,
      sourceCode,
      language,
      judge0LanguageId,
      status: "pending",
      submissionType: type,
    });

    // Send to Judge0 for execution
    let judge0Data;
    try {
      judge0Data = await sendToJudge0(sourceCode, judge0LanguageId);
    } catch (judge0Error) {
      // Judge0 failed — mark submission as internal_error and return
      submission.status = "internal_error";
      await submission.save();
      return res.status(502).json({
        message: "Code execution service unavailable. Please try again.",
        submission,
      });
    }

    // Map Judge0 result to internal status
    const result = mapJudge0Status(judge0Data);

    // Update submission with execution results
    submission.status = result.status;
    submission.isAccepted = result.isAccepted;
    submission.stdout = result.stdout;
    submission.stderr = result.stderr;
    submission.compilerOutput = result.compilerOutput;
    submission.executionTime = result.executionTime;
    submission.memoryUsage = result.memoryUsage;
    submission.judge0Token = result.judge0Token;

    await submission.save();

    return res.status(201).json({ submission });
  } catch (error) {
    console.error("Error in createAndExecuteSubmission:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// ─── GET /api/submissions/me ──────────────────────────────────────────────────
export async function getMySubmissions(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    // Build filter query
    const filter = { user: req.user._id };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.language) filter.language = req.query.language;
    if (req.query.problemId) filter.problemId = req.query.problemId;
    if (req.query.submissionType) filter.submissionType = req.query.submissionType;

    const [submissions, total] = await Promise.all([
      Submission.find(filter)
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-sourceCode") // omit source code in list view for performance
        .lean(),
      Submission.countDocuments(filter),
    ]);

    return res.json({
      submissions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error in getMySubmissions:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// ─── GET /api/submissions/:id ─────────────────────────────────────────────────
export async function getSubmissionById(req, res) {
  try {
    const submission = await Submission.findById(req.params.id).lean();

    if (!submission) {
      return res.status(404).json({ message: "Submission not found." });
    }

    // Only the owner can see private submission details
    if (submission.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden." });
    }

    return res.json({ submission });
  } catch (error) {
    console.error("Error in getSubmissionById:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// ─── GET /api/users/:userId/profile ──────────────────────────────────────────
export async function getUserProfile(req, res) {
  try {
    const { userId } = req.params; // Clerk userId

    // Find user in DB
    const user = await User.findOne({ clerkId: userId }).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const mongoUserId = user._id;

    // Run aggregations in parallel
    const [totalResult, acceptedResult, uniqueSolvedResult, langResult] = await Promise.all([
      // Total submissions
      Submission.countDocuments({ user: mongoUserId }),

      // Accepted submissions
      Submission.countDocuments({ user: mongoUserId, isAccepted: true }),

      // Unique problems solved (distinct accepted problemIds)
      Submission.distinct("problemId", { user: mongoUserId, isAccepted: true }),

      // Preferred language — most used in accepted submissions
      Submission.aggregate([
        { $match: { user: mongoUserId, isAccepted: true } },
        { $group: { _id: "$language", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 },
      ]),
    ]);

    const totalSubmissions = totalResult;
    const acceptedSubmissions = acceptedResult;
    const uniqueProblemsSolved = uniqueSolvedResult.length;
    const preferredLanguage = langResult[0]?._id || null;
    const acceptanceRate =
      totalSubmissions > 0
        ? Math.round((acceptedSubmissions / totalSubmissions) * 100)
        : 0;

    // Streak calculation (UTC days)
    const streaks = await calculateStreaks(mongoUserId);

    return res.json({
      user: {
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        clerkId: user.clerkId,
      },
      stats: {
        totalSubmissions,
        acceptedSubmissions,
        uniqueProblemsSolved,
        acceptanceRate,
        preferredLanguage,
        currentStreak: streaks.currentStreak,
        longestStreak: streaks.longestStreak,
      },
    });
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// ─── GET /api/users/:userId/activity ─────────────────────────────────────────
export async function getUserActivity(req, res) {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ clerkId: userId }).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const mongoUserId = user._id;

    // Last 365 days aggregation
    const since = new Date();
    since.setDate(since.getDate() - 365);

    const dailyActivity = await Submission.aggregate([
      {
        $match: {
          user: mongoUserId,
          submittedAt: { $gte: since },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$submittedAt", timezone: "UTC" },
          },
          submissionCount: { $sum: 1 },
          acceptedCount: {
            $sum: { $cond: [{ $eq: ["$isAccepted", true] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Map to activityLevel
    const activity = dailyActivity.map(({ _id, submissionCount, acceptedCount }) => ({
      date: _id,
      submissionCount,
      acceptedCount,
      activityLevel:
        submissionCount === 0
          ? 0
          : acceptedCount > 0 || submissionCount >= 4
            ? 3
            : submissionCount >= 2
              ? 2
              : 1,
    }));

    return res.json({ activity });
  } catch (error) {
    console.error("Error in getUserActivity:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// ─── Helper: calculate current & longest streaks ──────────────────────────────
async function calculateStreaks(mongoUserId) {
  // Get distinct active UTC dates (any submission counts)
  const activeDates = await Submission.aggregate([
    { $match: { user: mongoUserId } },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$submittedAt", timezone: "UTC" },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  if (activeDates.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const dateStrings = activeDates.map((d) => d._id);
  const dateSet = new Set(dateStrings);

  // Longest streak
  let longest = 1;
  let current = 1;
  for (let i = 1; i < dateStrings.length; i++) {
    const prev = new Date(dateStrings[i - 1]);
    const curr = new Date(dateStrings[i]);
    const diff = (curr - prev) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  // Current streak — walk back from today (or yesterday)
  const todayStr = new Date().toISOString().slice(0, 10);
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = yesterdayDate.toISOString().slice(0, 10);

  let currentStreak = 0;
  const startDate = dateSet.has(todayStr) ? new Date(todayStr) : dateSet.has(yesterdayStr) ? new Date(yesterdayStr) : null;

  if (startDate) {
    let checkDate = new Date(startDate);
    while (dateSet.has(checkDate.toISOString().slice(0, 10))) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  return { currentStreak, longestStreak: longest };
}
