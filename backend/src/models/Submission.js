import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    problemId: {
      type: String,
      required: true,
      index: true,
    },
    problemTitle: {
      type: String,
      default: "",
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      default: null,
      index: true,
    },
    battleId: {
      type: String,
      default: null,
      index: true,
    },
    sourceCode: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      enum: ["javascript", "python", "java"],
      default: "javascript",
    },
    judge0LanguageId: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: [
        "pending",
        "processing",
        "accepted",
        "wrong_answer",
        "time_limit_exceeded",
        "compilation_error",
        "runtime_error",
        "memory_limit_exceeded",
        "internal_error",
      ],
      default: "pending",
      index: true,
    },
    executionTime: {
      type: Number,
      default: null,
    },
    memoryUsage: {
      type: Number,
      default: null,
    },
    judge0Token: {
      type: String,
      default: "",
    },
    compilerOutput: {
      type: String,
      default: "",
    },
    stdout: {
      type: String,
      default: "",
    },
    stderr: {
      type: String,
      default: "",
    },
    passedTestCount: {
      type: Number,
      default: 0,
    },
    totalTestCount: {
      type: Number,
      default: 0,
    },
    submissionType: {
      type: String,
      required: true,
      enum: ["individual_practice", "session_battle", "contest", "interview"],
      default: "individual_practice",
      index: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    isOfficial: {
      type: Boolean,
      default: true,
    },
    isAccepted: {
      type: Boolean,
      default: false,
      index: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

submissionSchema.index({ user: 1, problemId: 1, isAccepted: 1 });
submissionSchema.index({ submittedAt: -1 });
submissionSchema.index({ status: 1, submissionType: 1 });

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;
