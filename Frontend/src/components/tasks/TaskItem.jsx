import React, { useEffect, useMemo, useState } from "react";
import { Play, Pause, CheckCircle2 } from "lucide-react";

export default function TaskItem({
  task,
  onToggleComplete,
  onStartTimer,
  onStopTimer,
  onEdit,
  onDelete,
}) {
  const isRunning = task?.isRunning;
  const runningStartedAt = task?.runningStartedAt; // must come from backend

  const [tick, setTick] = useState(0);

  // live re-render every second ONLY if running
  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setTick((x) => x + 1);
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning]);

  const liveSeconds = useMemo(() => {
    // base from DB
    const baseSeconds = (task.timeSpentMinutes || 0) * 60;

    // if not running, just show stored time
    if (!isRunning || !runningStartedAt) return baseSeconds;

    // if running, add live seconds
    const start = new Date(runningStartedAt).getTime();
    const now = Date.now();
    const diff = Math.max(0, Math.floor((now - start) / 1000));

    return baseSeconds + diff;
  }, [isRunning, runningStartedAt, tick, task.timeSpentMinutes]);

  const liveLabel = useMemo(() => {
    return formatSeconds(liveSeconds);
  }, [liveSeconds]);

  return (
    <div
      className={`rounded-3xl border p-4 shadow-sm transition ${
        task.status == "DONE" ? "opacity-70" : ""
      }`}
      style={{
        background: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <button
            onClick={() => onToggleComplete(task)}
            className="mt-0.5 cursor-pointer"
            title="Mark complete"
          >
            <CheckCircle2
              size={22}
              className={task.status == "DONE" ? "opacity-100" : "opacity-30"}
              style={{
                color: task.status == "DONE" ? "#16a34a" : "var(--muted)",
              }}
            />
          </button>

          <div>
            <div
              className={`text-sm font-semibold ${
                task.status == "DONE" ? "line-through" : ""
              }`}
              style={{ color: "var(--text)" }}
            >
              {task.title}
            </div>

            {task.description && (
              <div className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                {task.description}
              </div>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span
                className="rounded-full border px-3 py-1 font-medium"
                style={{
                  background: "var(--bg)",
                  borderColor: "var(--border)",
                  color: "var(--text)",
                }}
              >
                {task.category}
              </span>
              <span style={{ color: "var(--muted)" }}>
                Est: {task.expectedMinutes} min • Spent:{" "}
                {task.timeSpentMinutes || 0} min
              </span>

              {/* LIVE TIMER */}
              {isRunning && (
                <span
                  className="rounded-full border px-3 py-1 font-semibold"
                  style={{
                    background: "var(--text)",
                    borderColor: "var(--text)",
                    color: "var(--bg)",
                  }}
                >
                  ⏱ {liveLabel}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Timer button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => (isRunning ? onStopTimer(task) : onStartTimer(task))}
            className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition hover:opacity-90 cursor-pointer"
            style={{
              background: "var(--bg)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          >
            {isRunning ? <Pause size={16} /> : <Play size={16} />}
            {isRunning ? "Stop" : "Start"}
          </button>

          <button
            onClick={() => onEdit(task)}
            className="rounded-2xl cursor-pointer border px-4 py-2 text-sm font-semibold transition hover:opacity-90"
            style={{
              background: "var(--bg)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          >
            Edit
          </button>

          <button
            disabled={isRunning}
            onClick={() => onDelete(task)}
            className="rounded-2xl cursor-pointer px-4 py-2 text-sm font-semibold transition
             hover:opacity-90
             disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background: isRunning ? "var(--border)" : "#dc2626",
              color: isRunning ? "var(--muted)" : "white",
            }}
            title={isRunning ? "Stop timer before deleting" : "Delete task"}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- helper ---------------- */

function formatSeconds(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  if (h > 0) {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0",
    )}:${String(s).padStart(2, "0")}`;
  }

  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
