import React, { useEffect, useState } from "react";
import Modal from "../common/Modal";

const CATEGORIES = ["DSA", "Aptitude", "Project", "Core", "Other"];

export default function EditTaskModal({ open, onClose, task, onSave }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "DSA",
    expectedMinutes: 60,
  });

  useEffect(() => {
    if (!task) return;

    setForm({
      title: task.title || "",
      description: task.description || "",
      category: task.category || "DSA",
      expectedMinutes: task.expectedMinutes || 60,
    });
  }, [task]);

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const submit = (e) => {
    e.preventDefault();
    onSave({
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      expectedMinutes: Number(form.expectedMinutes),
    });
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit task">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
            Title
          </div>
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none"
            style={inputStyle()}
          />
        </div>

        <div>
          <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
            Description
          </div>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            rows={4}
            className="mt-2 w-full resize-none rounded-2xl border px-4 py-3 text-sm outline-none"
            style={inputStyle()}
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
              Estimated minutes
            </div>
            <input
              type="number"
              min={5}
              name="expectedMinutes "
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
          Save changes
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
