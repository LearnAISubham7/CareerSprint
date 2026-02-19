import React, { useEffect, useMemo, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import CategorySection from "../../components/tasks/CategorySection";
import { deleteTaskApi, updateTaskApi } from "../../api/taskApi";
import EditTaskModal from "../../components/tasks/EditTaskModal";
import {
  createTaskApi,
  getTodayTasksApi,
  startTaskTimerApi,
  stopTaskTimerApi,
  toggleTaskCompleteApi,
} from "../../api/taskApi";
import QuickAddTaskModal from "../../components/tasks/QuickAddTaskModal";

export default function Today() {
  const [tasks, setTasks] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const [error, setError] = useState("");
  const [tick, setTick] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [quickOpen, setQuickOpen] = useState(false);

  const onQuickCreate = async ({ title, category, expectedMinutes }) => {
    try {
      await createTaskApi({
        title,
        category,
        expectedMinutes,
        date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
        source: "CUSTOM",
      });

      setQuickOpen(false);
      await loadToday("sync");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to create task");
    }
  };

  const onEdit = (task) => {
    setSelectedTask(task);
    setEditOpen(true);
  };

  const onDelete = async (task) => {
    const ok = confirm("Delete this task?");
    if (!ok) return;

    // optimistic
    setTasks((prev) => prev.filter((t) => t._id !== task._id));

    try {
      await deleteTaskApi(task._id);
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed.");
      loadToday("sync"); // restore without full loading
    }
  };

  const onSaveEdit = async (payload) => {
    try {
      const updated = await updateTaskApi(selectedTask._id, payload);

      setTasks((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t)),
      );

      setEditOpen(false);
      setSelectedTask(null);
    } catch (err) {
      alert(err?.response?.data?.message || "Update failed.");
    }
  };

  useEffect(() => {
    const id = setInterval(() => setTick((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const loadToday = async (mode = "page") => {
    try {
      setError("");

      if (mode === "page") setLoadingPage(true);
      if (mode === "sync") setSyncing(true);

      const data = await getTodayTasksApi();
      setTasks(data.tasks);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load today tasks.");
    } finally {
      if (mode === "page") setLoadingPage(false);
      if (mode === "sync") setSyncing(false);
    }
  };

  useEffect(() => {
    loadToday("page");
  }, []);

  const grouped = useMemo(() => {
    const groups = {
      DSA: [],
      Aptitude: [],
      Project: [],
      Core: [],
      Other: [],
    };

    for (const t of tasks) {
      const raw = (t.category || "Other").toString().trim().toUpperCase();

      let cat = "Other";
      if (raw === "DSA") cat = "DSA";
      else if (raw === "APTITUDE") cat = "Aptitude";
      else if (raw === "PROJECT") cat = "Project";
      else if (raw === "CORE") cat = "Core";

      groups[cat].push(t);
    }

    return groups;
  }, [tasks]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status == "DONE").length;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);

    // total time spent in minutes from backend
    const spentMinutes = tasks.reduce(
      (sum, t) => sum + (t.timeSpentMinutes || 0),
      0,
    );

    const running = tasks.find((t) => t?.isRunning);

    let runningExtraSeconds = 0;
    if (running?.runningStartedAt) {
      const start = new Date(running.runningStartedAt).getTime();
      const now = Date.now();
      runningExtraSeconds = Math.max(0, Math.floor((now - start) / 1000));
    }

    return {
      total,
      done,
      percent,
      spentMinutes,
      runningExtraSeconds,
    };
  }, [tasks, tick]);

  const toggleComplete = async (task) => {
    // optimistic
    setTasks((prev) =>
      prev.map((t) =>
        t._id === task._id
          ? { ...t, status: t.status === "DONE" ? "PENDING" : "DONE" }
          : t,
      ),
    );

    try {
      const updated = await toggleTaskCompleteApi(task._id);
      setTasks((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t)),
      );
    } catch (err) {
      // rollback
      setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
    }
  };

  const startTimer = async (task) => {
    try {
      await startTaskTimerApi(task._id);
      await loadToday("sync");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to start timer");
    }
  };

  const stopTimer = async (task) => {
    try {
      await stopTaskTimerApi(task._id);
      await loadToday("sync");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to stop timer");
    }
  };

  const todayLabel = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <AppLayout>
      {/* Top Summary */}
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div
            className="text-2xl font-semibold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            Today
          </div>
          <div className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            {todayLabel} • {stats.total} tasks • {stats.done} done • Focus{" "}
            <span style={{ color: "var(--text)", fontWeight: 600 }}>
              {formatFocusTime(stats.spentMinutes, stats.runningExtraSeconds)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {syncing && (
            <span
              className="rounded-full border px-3 py-1 text-xs font-semibold"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
                color: "var(--muted)",
              }}
            >
              Syncing...
            </span>
          )}

          <button
            onClick={() => setQuickOpen(true)}
            className="rounded-2xl cursor-pointer px-4 py-3 text-sm font-semibold transition hover:opacity-90"
            style={{
              background: "var(--text)",
              color: "var(--bg)",
            }}
          >
            + Quick Add
          </button>

          <button
            onClick={() => loadToday("page")}
            className="rounded-2xl cursor-pointer border px-4 py-3 text-sm font-semibold transition hover:opacity-90"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Completed" value={stats.done} />
        <StatCard label="Pending" value={stats.total - stats.done} />
        <StatCard
          label="Progress"
          value={`${stats.total === 0 ? 0 : stats.percent}%`}
        />
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div
          className="h-2 w-full rounded-full"
          style={{ background: "var(--border)" }}
        >
          <div
            className="h-2 rounded-full transition-all"
            style={{
              width: `${stats.total === 0 ? 0 : stats.percent}%`,
              background: "var(--text)",
            }}
          />
        </div>
      </div>

      {/* Loading */}
      {loadingPage && (
        <div
          className="mt-6 rounded-3xl border p-8 text-center text-sm shadow-sm"
          style={{
            background: "var(--card)",
            borderColor: "var(--border)",
            color: "var(--muted)",
          }}
        >
          Loading today tasks...
        </div>
      )}

      {/* Error */}
      {!loadingPage && error && (
        <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Task Sections */}
      {!loadingPage && !error && (
        <div className="mt-6 space-y-8">
          {grouped.DSA.length > 0 && (
            <CategorySection
              title="DSA"
              tasks={grouped.DSA}
              onToggleComplete={toggleComplete}
              onStartTimer={startTimer}
              onStopTimer={stopTimer}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          )}

          {grouped.Aptitude.length > 0 && (
            <CategorySection
              title="Aptitude"
              tasks={grouped.Aptitude}
              onToggleComplete={toggleComplete}
              onStartTimer={startTimer}
              onStopTimer={stopTimer}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          )}

          {grouped.Project.length > 0 && (
            <CategorySection
              title="Project"
              tasks={grouped.Project}
              onToggleComplete={toggleComplete}
              onStartTimer={startTimer}
              onStopTimer={stopTimer}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          )}

          {grouped.Core.length > 0 && (
            <CategorySection
              title="Core"
              tasks={grouped.Core}
              onToggleComplete={toggleComplete}
              onStartTimer={startTimer}
              onStopTimer={stopTimer}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          )}

          {grouped.Other.length > 0 && (
            <CategorySection
              title="Other"
              tasks={grouped.Other}
              onToggleComplete={toggleComplete}
              onStartTimer={startTimer}
              onStopTimer={stopTimer}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          )}

          {tasks.length === 0 && (
            <div
              className="rounded-3xl border p-10 text-center"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
                color: "var(--muted)",
              }}
            >
              <div
                className="text-sm font-semibold"
                style={{ color: "var(--text)" }}
              >
                No tasks for today
              </div>
              <div className="mt-2 text-sm">
                Create tasks or enable recurring templates.
              </div>
            </div>
          )}
        </div>
      )}
      <EditTaskModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onSave={onSaveEdit}
      />
      <QuickAddTaskModal
        open={quickOpen}
        onClose={() => setQuickOpen(false)}
        onCreate={onQuickCreate}
      />
    </AppLayout>
  );
}
function StatCard({ label, value }) {
  return (
    <div
      className="rounded-3xl border p-4 shadow-sm"
      style={{
        background: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      <div className="text-xs font-medium" style={{ color: "var(--muted)" }}>
        {label}
      </div>
      <div
        className="mt-1 text-xl font-semibold"
        style={{ color: "var(--text)" }}
      >
        {value}
      </div>
    </div>
  );
}

function formatFocusTime(spentMinutes, extraSeconds) {
  const totalSeconds = spentMinutes * 60 + (extraSeconds || 0);

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);

  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}
