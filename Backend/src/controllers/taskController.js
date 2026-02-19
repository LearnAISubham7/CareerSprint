import TaskTemplate from "../models/TaskTemplate.js";
import TaskInstance from "../models/TaskInstance.js";
import {
  getTodayDateString,
  isDateWithinRange,
  getDayOfWeek,
} from "../utils/dateUtils.js";

// Helper: check recurrence
const templateAppliesToDate = (template, dateStr) => {
  if (!template.isActive) return false;
  if (!isDateWithinRange(dateStr, template.startDate, template.endDate))
    return false;

  if (template.repeatType === "DAILY") return true;

  if (template.repeatType === "WEEKLY") {
    // Example: repeat weekly means it appears every week on the same weekday as startDate
    const startDay = new Date(template.startDate).getDay();
    const targetDay = getDayOfWeek(dateStr);
    return startDay === targetDay;
  }

  if (template.repeatType === "MONTHLY") {
    // appears every month on same day-of-month as startDate
    const startDateObj = new Date(template.startDate);
    const targetDateObj = new Date(dateStr);
    return startDateObj.getDate() === targetDateObj.getDate();
  }

  return false;
};

// 🔥 GET TODAY TASKS (auto-generate template instances)
export const getTodayTasks = async (req, res) => {
  try {
    const today = getTodayDateString();

    // 1) find all templates for user
    const templates = await TaskTemplate.find({
      user: req.user._id,
      isActive: true,
    });

    // 2) for each template that applies, ensure instance exists
    for (const t of templates) {
      if (!templateAppliesToDate(t, today)) continue;

      // upsert (create if missing)
      await TaskInstance.updateOne(
        { user: req.user._id, template: t._id, date: today },
        {
          $setOnInsert: {
            user: req.user._id,
            template: t._id,
            source: "TEMPLATE",
            date: today,
            title: t.title,
            description: t.description,
            category: t.category,
            expectedMinutes: t.expectedMinutes,
          },
        },
        { upsert: true },
      );
    }

    // 3) return all instances for today (template + custom)
    const tasks = await TaskInstance.find({
      user: req.user._id,
      date: today,
      isSkipped: false,
    }).sort({
      createdAt: 1,
    });

    res.json({ date: today, tasks });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET TASKS BY DATE (for calendar view)
export const getTasksByDate = async (req, res) => {
  try {
    const { date } = req.params;

    const tasks = await TaskInstance.find({
      user: req.user._id,
      date,
    }).sort({ createdAt: 1 });

    res.json({ date, tasks });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE CUSTOM TASK (date optional)
export const createCustomTask = async (req, res) => {
  try {
    const { date, title, description, category, expectedMinutes } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: "title is required" });
    }

    const today = new Date().toISOString().slice(0, 10);

    const task = await TaskInstance.create({
      user: req.user._id,
      template: null,
      source: "CUSTOM",
      date: date || today, // ✅ if date not provided, use today
      title: title.trim(),
      description: description || "",
      category: category || "OTHER",
      expectedMinutes: expectedMinutes || 0,
    });

    res.status(201).json(task);
  } catch (error) {
    console.log("createCustomTask error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// TOGGLE DONE
export const toggleTaskDone = async (req, res) => {
  try {
    const task = await TaskInstance.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    task.status = task.status === "PENDING" ? "DONE" : "PENDING";
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// TIMER START (only 1 running per user)
export const startTaskTimer = async (req, res) => {
  try {
    const userId = req.user._id;
    const taskId = req.params.id;

    // 1) Task to start
    const task = await TaskInstance.findOne({
      _id: taskId,
      user: userId,
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    // 2) If already running, just return
    if (task.isRunning) return res.json(task);

    // 3) Stop any currently running task for this user
    const runningTask = await TaskInstance.findOne({
      user: userId,
      isRunning: true,
    });

    if (runningTask) {
      const now = new Date();

      if (runningTask.runningStartedAt) {
        const diffMs = now - runningTask.runningStartedAt;
        const diffMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)));

        runningTask.timeSpentMinutes =
          (runningTask.timeSpentMinutes || 0) + diffMinutes;
      }

      runningTask.isRunning = false;
      runningTask.runningStartedAt = null;

      await runningTask.save();
    }

    // 4) Start this task
    task.isRunning = true;
    task.runningStartedAt = new Date();
    await task.save();

    res.json(task);
  } catch (error) {
    console.log("startTaskTimer error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// TIMER STOP
export const stopTaskTimer = async (req, res) => {
  try {
    const task = await TaskInstance.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    // if not running, just return (no error)
    if (!task.isRunning || !task.runningStartedAt) {
      return res.json(task);
    }

    const now = new Date();
    const diffMs = now - task.runningStartedAt;
    const diffMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)));

    task.timeSpentMinutes = (task.timeSpentMinutes || 0) + diffMinutes;
    task.isRunning = false;
    task.runningStartedAt = null;

    await task.save();

    res.json(task);
  } catch (error) {
    console.log("stopTaskTimer error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE TASK INSTANCE (edit)
export const updateTaskInstance = async (req, res) => {
  try {
    const { title, description, category, expectedMinutes } = req.body;

    const task = await TaskInstance.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    // Update only allowed fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (category !== undefined) task.category = category.toUpperCase();
    if (expectedMinutes !== undefined) task.expectedMinutes = expectedMinutes;

    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTaskInstance = async (req, res) => {
  try {
    const task = await TaskInstance.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    // ✅ recurring instance
    if (task.template) {
      task.isSkipped = true;
      task.skippedAt = new Date();
      await task.save();

      return res.json({ message: "Recurring task skipped for this day" });
    }

    // ✅ custom task
    await task.deleteOne();
    return res.json({ message: "Task deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// HISTORY (range)
export const getHistory = async (req, res) => {
  try {
    const { from, to, category } = req.query;

    if (!from || !to) {
      return res
        .status(400)
        .json({ message: "from and to are required (YYYY-MM-DD)" });
    }
    const filter = {
      user: req.user._id,
      date: { $gte: from, $lte: to },
    };

    // optional category filter
    if (category && category !== "ALL") {
      filter.category = category.toUpperCase();
    }
    const tasks = await TaskInstance.find(filter).sort({
      date: 1,
      createdAt: 1,
    });

    res.json({ from, to, category: category || "ALL", tasks });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
