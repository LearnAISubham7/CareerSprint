import mongoose from "mongoose";

const taskInstanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // If this instance came from a recurring template
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TaskTemplate",
      default: null,
    },
    source: {
      type: String,
      enum: ["TEMPLATE", "CUSTOM"],
      default: "CUSTOM",
    },
    date: {
      type: String, // store like "2026-02-17"
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      enum: ["DSA", "APTITUDE", "PROJECT", "CORE", "OTHER"],
      default: "OTHER",
    },
    expectedMinutes: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["PENDING", "DONE"],
      default: "PENDING",
    },
    // Timer fields
    isRunning: {
      type: Boolean,
      default: false,
    },
    runningStartedAt: {
      type: Date,
      default: null,
    },
    timeSpentMinutes: {
      type: Number,
      default: 0,
    },
    // Optional: user notes after completing
    notes: {
      type: String,
      default: "",
    },
    isSkipped: {
      type: Boolean,
      default: false,
    },
    skippedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicates ONLY for template-generated tasks
taskInstanceSchema.index(
  { user: 1, template: 1, date: 1 },
  {
    unique: true,
    partialFilterExpression: { template: { $ne: null } },
  },
);

const TaskInstance = mongoose.model("TaskInstance", taskInstanceSchema);

export default TaskInstance;
