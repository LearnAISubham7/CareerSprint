import React, { useMemo, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import { createTaskApi } from "../../api/taskApi";
import { createTemplateApi } from "../../api/templateApi";

const CATEGORIES = ["DSA", "APTITUDE", "PROJECT", "CORE", "OTHER"];

export default function CreateTask() {
  const [mode, setMode] = useState("ONE_TIME"); // ONE_TIME | RECURRING

  // One-time task
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    category: "DSA",
    expectedMinutes: 60,
    date: getTodayDateInput(),
  });

  // Recurring template
  const [templateForm, setTemplateForm] = useState({
    title: "",
    description: "",
    category: "DSA",
    expectedMinutes: 60,
    repeatType: "DAILY", // DAILY | WEEKLY | MONTHLY
    startDate: getTodayDateInput(),
    endDate: getTodayDateInput(),
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const cardStyle = {
    background: "var(--card)",
    borderColor: "var(--border)",
  };

  const muted = { color: "var(--muted)" };
  const text = { color: "var(--text)" };

  const activeForm = useMemo(() => {
    return mode === "ONE_TIME" ? taskForm : templateForm;
  }, [mode, taskForm, templateForm]);

  const updateTaskForm = (e) => {
    const { name, value } = e.target;
    setTaskForm((p) => ({ ...p, [name]: value }));
  };

  const updateTemplateForm = (e) => {
    const { name, value } = e.target;
    setTemplateForm((p) => ({ ...p, [name]: value }));
  };

  const validate = () => {
    const f = activeForm;

    if (!f.title.trim()) return "Title is required.";
    if (!f.category) return "Category is required.";

    const minutes = Number(f.expectedMinutes);
    if (!minutes || minutes < 5)
      return "Estimated time must be at least 5 min.";

    if (mode === "ONE_TIME" && !taskForm.date) return "Please select a date.";
    if (mode === "RECURRING" && !templateForm.startDate)
      return "Please select a start date.";

    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    try {
      setLoading(true);

      if (mode === "ONE_TIME") {
        await createTaskApi({
          title: taskForm.title,
          description: taskForm.description,
          category: taskForm.category,
          expectedMinutes: Number(taskForm.expectedMinutes),
          date: taskForm.date, // YYYY-MM-DD
        });

        setMsg("✅ Task created successfully.");
        setTaskForm((p) => ({ ...p, title: "", description: "" }));
      } else {
        await createTemplateApi({
          title: templateForm.title,
          description: templateForm.description,
          category: templateForm.category,
          expectedMinutes: Number(templateForm.expectedMinutes),
          repeatType: templateForm.repeatType,
          startDate: templateForm.startDate,
          endDate: templateForm.endDate,
        });

        setMsg("✅ Recurring template created successfully.");
        setTemplateForm((p) => ({ ...p, title: "", description: "" }));
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="rounded-3xl border p-6 shadow-sm" style={cardStyle}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-lg font-semibold tracking-tight" style={text}>
              Create
            </div>
            <div className="mt-1 text-sm" style={muted}>
              Add a one-time task or setup a recurring daily routine.
            </div>
          </div>

          {/* Mode switch */}
          <div
            className="inline-flex rounded-2xl border p-1"
            style={{
              background: "var(--bg)",
              borderColor: "var(--border)",
            }}
          >
            <button
              type="button"
              onClick={() => setMode("ONE_TIME")}
              className="rounded-xl cursor-pointer px-4 py-2 text-sm font-semibold transition"
              style={{
                background: mode === "ONE_TIME" ? "var(--text)" : "transparent",
                color: mode === "ONE_TIME" ? "var(--bg)" : "var(--text)",
              }}
            >
              One-time
            </button>

            <button
              type="button"
              onClick={() => setMode("RECURRING")}
              className="rounded-xl cursor-pointer px-4 py-2 text-sm font-semibold transition"
              style={{
                background:
                  mode === "RECURRING" ? "var(--text)" : "transparent",
                color: mode === "RECURRING" ? "var(--bg)" : "var(--text)",
              }}
            >
              Recurring
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="rounded-3xl border p-6 shadow-sm" style={cardStyle}>
            <div className="text-sm font-semibold" style={text}>
              {mode === "ONE_TIME" ? "One-time task" : "Recurring template"}
            </div>

            <div className="mt-1 text-sm" style={muted}>
              {mode === "ONE_TIME"
                ? "This task belongs only to the selected day."
                : "This will auto-generate tasks repeatedly."}
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {msg && (
              <div
                className="mt-5 rounded-2xl border px-4 py-3 text-sm"
                style={{
                  background: "var(--bg)",
                  borderColor: "var(--border)",
                  color: "var(--text)",
                }}
              >
                {msg}
              </div>
            )}

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              {/* Title */}
              <Field label="Title">
                <input
                  name="title"
                  value={activeForm.title}
                  onChange={
                    mode === "ONE_TIME" ? updateTaskForm : updateTemplateForm
                  }
                  placeholder="Example: Arrays - solve 2 problems"
                  className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-zinc-400/30"
                  style={inputStyle()}
                />
              </Field>

              {/* Description */}
              <Field label="Description (optional)">
                <textarea
                  name="description"
                  value={activeForm.description}
                  onChange={
                    mode === "ONE_TIME" ? updateTaskForm : updateTemplateForm
                  }
                  placeholder="Example: 1 easy + 1 medium + write patterns learned"
                  rows={4}
                  className="w-full resize-none rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-zinc-400/30"
                  style={inputStyle()}
                />
              </Field>

              {/* Category + Minutes */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Category">
                  <select
                    name="category"
                    value={activeForm.category}
                    onChange={
                      mode === "ONE_TIME" ? updateTaskForm : updateTemplateForm
                    }
                    className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                    style={inputStyle()}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Estimated minutes">
                  <input
                    type="number"
                    name="expectedMinutes"
                    value={activeForm.expectedMinutes}
                    onChange={
                      mode === "ONE_TIME" ? updateTaskForm : updateTemplateForm
                    }
                    min={5}
                    className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                    style={inputStyle()}
                  />
                </Field>
              </div>

              {/* One-time Date OR Recurring settings */}
              {mode === "ONE_TIME" ? (
                <Field label="Task date">
                  <input
                    type="date"
                    name="date"
                    value={taskForm.date}
                    onChange={updateTaskForm}
                    className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                    style={inputStyle()}
                  />
                </Field>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Repeat type">
                    <select
                      name="repeatType"
                      value={templateForm.repeatType}
                      onChange={updateTemplateForm}
                      className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                      style={inputStyle()}
                    >
                      <option value="DAILY">Daily</option>
                      <option value="WEEKLY">Weekly</option>
                      <option value="MONTHLY">Monthly</option>
                    </select>
                  </Field>

                  <Field label="Start date">
                    <input
                      type="date"
                      name="startDate"
                      value={templateForm.startDate}
                      onChange={updateTemplateForm}
                      className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                      style={inputStyle()}
                    />
                  </Field>
                  <Field label="End date">
                    <input
                      type="date"
                      name="endDate"
                      value={templateForm.endDate}
                      onChange={updateTemplateForm}
                      className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                      style={inputStyle()}
                    />
                  </Field>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer rounded-2xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  background: "var(--text)",
                  color: "var(--bg)",
                }}
              >
                {loading
                  ? "Saving..."
                  : mode === "ONE_TIME"
                    ? "Create task"
                    : "Create recurring template"}
              </button>
            </form>
          </div>
        </div>

        {/* Right panel */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl border p-6 shadow-sm" style={cardStyle}>
            <div className="text-sm font-semibold" style={text}>
              Preview
            </div>
            <div className="mt-1 text-sm" style={muted}>
              This is how your task will appear on Today.
            </div>

            <div
              className="mt-5 rounded-3xl border p-5"
              style={{
                background: "var(--bg)",
                borderColor: "var(--border)",
              }}
            >
              <div className="text-sm font-semibold" style={text}>
                {activeForm.title?.trim() || "Task title"}
              </div>

              <div className="mt-2 text-sm" style={muted}>
                {activeForm.description?.trim() ||
                  "Task description (optional)"}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                <span
                  className="rounded-full border px-3 py-1 font-medium"
                  style={{
                    background: "var(--card)",
                    borderColor: "var(--border)",
                    color: "var(--text)",
                  }}
                >
                  {activeForm.category}
                </span>

                <span style={muted}>
                  Est: {Number(activeForm.expectedMinutes) || 0} min
                </span>

                {mode === "ONE_TIME" ? (
                  <span style={muted}>Date: {taskForm.date}</span>
                ) : (
                  <span style={muted}>Repeat: {templateForm.repeatType}</span>
                )}
              </div>
            </div>

            <div className="mt-6 text-xs leading-relaxed" style={muted}>
              <span className="font-semibold" style={text}>
                Note:
              </span>{" "}
              One-time tasks are independent. Recurring templates generate tasks
              automatically and show up in Today.
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

/* ---------------- helpers ---------------- */

function Field({ label, children }) {
  return (
    <div>
      <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
        {label}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

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
