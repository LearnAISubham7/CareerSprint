import React, { useState } from "react";
import Modal from "../common/Modal";

const CATEGORIES = ["DSA", "APTITUDE", "PROJECT", "CORE", "OTHER"];

export default function QuickAddTaskModal({ open, onClose, onCreate }) {
  const [form, setForm] = useState({
    title: "",
    category: "DSA",
    expectedMinutes: 60,
  });

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const submit = (e) => {
    e.preventDefault();

    if (!form.title.trim()) return alert("Task title is required");

    onCreate({
      title: form.title.trim(),
      category: form.category,
      expectedMinutes: Number(form.expectedMinutes),
      date: getTodayDateInput(),
      source: "CUSTOM",
    });

    // reset
    setForm({
      title: "",
      category: "DSA",
      expectedMinutes: 60,
    });
  };

  return (
    <Modal open={open} onClose={onClose} title="Quick add task">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
            Task title
          </div>
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            placeholder="Eg: Solve 2 array problems"
            className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none"
            style={inputStyle()}
            autoFocus
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <div
              className="text-sm font-medium"
              style={{ color: "var(--text)" }}
            >
              Category
            </div>
            <select
              name="category"
              value={form.category}
              onChange={onChange}
              className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none"
              style={inputStyle()}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div
              className="text-sm font-medium"
              style={{ color: "var(--text)" }}
            >
              Expected minutes
            </div>
            <input
              type="number"
              min={5}
              name="expectedMinutes"
              value={form.expectedMinutes}
              onChange={onChange}
              className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none"
              style={inputStyle()}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full cursor-pointer rounded-2xl px-4 py-3 text-sm font-semibold transition hover:opacity-90"
          style={{
            background: "var(--text)",
            color: "var(--bg)",
          }}
        >
          Add task
        </button>
      </form>
    </Modal>
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
