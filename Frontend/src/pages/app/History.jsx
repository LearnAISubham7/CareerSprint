import React, { useEffect, useMemo, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import { getHistoryTasksApi } from "../../api/taskApi";

const CATEGORIES = ["ALL", "DSA", "Aptitude", "Project", "Core", "Other"];
const STATUS_FILTERS = ["ALL", "COMPLETED", "NOT_COMPLETED", "SKIPPED"];

export default function History() {
  const [filters, setFilters] = useState({
    from: getDateDaysAgo(7),
    to: getTodayDateInput(),
    category: "ALL",
  });

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadHistory = async () => {
    try {
      setError("");
      setLoading(true);

      const data = await getHistoryTasksApi(filters);
      setTasks(data.tasks);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const onChange = (e) => {
    setFilters((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter(
      (t) => t.status === "DONE" && !t.isSkipped,
    ).length;
    const skipped = tasks.filter((t) => t.isSkipped).length;
    const notDone = total - done - skipped;

    return { total, done, notDone, skipped };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (statusFilter === "ALL") return tasks;

    if (statusFilter === "COMPLETED") {
      return tasks.filter((t) => t.status === "DONE" && !t.isSkipped);
    }

    if (statusFilter === "NOT_COMPLETED") {
      return tasks.filter((t) => t.status === "PENDING" && !t.isSkipped);
    }

    if (statusFilter === "SKIPPED") {
      return tasks.filter((t) => t.isSkipped);
    }

    return tasks;
  }, [tasks, statusFilter]);

  return (
    <AppLayout>
      {/* Header */}
      <div
        className="rounded-3xl border p-6 shadow-sm"
        style={{
          background: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div
              className="text-lg font-semibold tracking-tight"
              style={{ color: "var(--text)" }}
            >
              History
            </div>
            <div className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              Review what you did — and what you skipped.
            </div>
          </div>

          <button
            onClick={loadHistory}
            className="rounded-2xl cursor-pointer border px-4 py-3 text-sm font-semibold transition hover:opacity-90"
            style={{
              background: "var(--bg)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          >
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <FilterField label="From">
            <input
              type="date"
              name="from"
              value={filters.from}
              onChange={onChange}
              className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
              style={inputStyle()}
            />
          </FilterField>

          <FilterField label="To">
            <input
              type="date"
              name="to"
              value={filters.to}
              onChange={onChange}
              className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
              style={inputStyle()}
            />
          </FilterField>

          <FilterField label="Category">
            <select
              name="category"
              value={filters.category}
              onChange={onChange}
              className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
              style={inputStyle()}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </FilterField>

          <div className="flex items-end">
            <button
              onClick={loadHistory}
              className="w-full cursor-pointer rounded-2xl px-4 py-3 text-sm font-semibold transition hover:opacity-90"
              style={{
                background: "var(--text)",
                color: "var(--bg)",
              }}
            >
              Apply filters
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard label="Total tasks" value={stats.total} />
          <StatCard label="Completed" value={stats.done} />
          <StatCard label="Not completed" value={stats.notDone} />
        </div>
        {/* Status Filter */}
        <div className="mt-6 flex flex-wrap gap-2">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="rounded-full cursor-pointer border px-4 py-2 text-xs font-semibold transition hover:opacity-90"
              style={{
                background: statusFilter === s ? "var(--text)" : "var(--bg)",
                borderColor: "var(--border)",
                color: statusFilter === s ? "var(--bg)" : "var(--text)",
              }}
            >
              {s === "ALL"
                ? "All"
                : s === "COMPLETED"
                  ? "Completed"
                  : s === "NOT_COMPLETED"
                    ? "Not Completed"
                    : "Skipped"}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div
          className="mt-6 rounded-3xl border p-8 text-center text-sm shadow-sm"
          style={{
            background: "var(--card)",
            borderColor: "var(--border)",
            color: "var(--muted)",
          }}
        >
          Loading history...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* List */}
      {!loading && !error && (
        <div className="mt-6 space-y-4">
          {filteredTasks.length === 0 ? (
            <EmptyState />
          ) : (
            filteredTasks.map((t) => <HistoryTaskCard key={t._id} t={t} />)
          )}
        </div>
      )}
    </AppLayout>
  );
}

/* ---------------- components ---------------- */

function FilterField({ label, children }) {
  return (
    <div>
      <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
        {label}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div
      className="rounded-3xl border p-5 shadow-sm"
      style={{
        background: "var(--bg)",
        borderColor: "var(--border)",
      }}
    >
      <div className="text-xs" style={{ color: "var(--muted)" }}>
        {label}
      </div>
      <div
        className="mt-2 text-2xl font-semibold tracking-tight"
        style={{ color: "var(--text)" }}
      >
        {value}
      </div>
    </div>
  );
}

function HistoryTaskCard({ t }) {
  return (
    <div
      className="rounded-3xl border p-6 shadow-sm"
      style={{
        background: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div
            className={`text-sm font-semibold tracking-tight ${
              t.status == "DONE" ? "line-through opacity-70" : ""
            }`}
            style={{ color: "var(--text)" }}
          >
            {t.title}
          </div>

          {t.description && (
            <div className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              {t.description}
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <Badge>{t.category}</Badge>

            <span style={{ color: "var(--muted)" }}>
              Est: {t.expectedMinutes || 0} min
            </span>

            <span style={{ color: "var(--muted)" }}>
              Spent: {t.timeSpentMinutes || 0} min
            </span>

            {t.date && (
              <span style={{ color: "var(--muted)" }}>
                Date: {formatDate(t.date)}
              </span>
            )}
            {t.isSkipped && t.skippedAt && (
              <span style={{ color: "var(--muted)" }}>
                Skipped: {formatDate(t.skippedAt)}
              </span>
            )}
          </div>
        </div>

        <div>
          <span
            className="rounded-2xl px-4 py-2 text-xs font-semibold"
            style={getStatusStyle(t)}
          >
            {getStatusLabel(t)}
          </span>
        </div>
      </div>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span
      className="rounded-full border px-3 py-1 font-medium"
      style={{
        background: "var(--bg)",
        borderColor: "var(--border)",
        color: "var(--text)",
      }}
    >
      {children}
    </span>
  );
}

function EmptyState() {
  return (
    <div
      className="rounded-3xl border p-10 text-center shadow-sm"
      style={{
        background: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>
        No tasks found
      </div>
      <div className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
        Try changing date range or category filter.
      </div>
    </div>
  );
}

/* ---------------- helpers ---------------- */

function inputStyle() {
  return {
    background: "var(--bg)",
    borderColor: "var(--border)",
    color: "var(--text)",
  };
}

function getTodayDateInput() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function getDateDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function getStatusLabel(t) {
  if (t.isSkipped) return "Skipped";
  if (t.status == "DONE") return "Completed";
  return "Not Completed";
}

function getStatusStyle(t) {
  if (t.isSkipped) {
    return {
      background: "#6b7280", // gray
      color: "white",
    };
  }

  if (t.status == "DONE") {
    return {
      background: "#16a34a", // green
      color: "white",
    };
  }

  return {
    background: "#dc2626", // red
    color: "white",
  };
}
