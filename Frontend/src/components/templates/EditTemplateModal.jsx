import React, { useEffect, useState } from "react";
import Modal from "../common/Modal";

const CATEGORIES = ["DSA", "APTITUDE", "PROJECT", "CORE", "OTHER"];

export default function EditTemplateModal({ open, onClose, template, onSave }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "DSA",
    expectedMinutes: 60,
    repeatType: "DAILY",
    startDate: "",
  });

  useEffect(() => {
    if (!template) return;

    setForm({
      title: template.title || "",
      description: template.description || "",
      category: template.category || "DSA",
      expectedMinutes: template.expectedMinutes || 60,
      repeatType: template.repeatType || "DAILY",
      startDate: template.startDate
        ? String(template.startDate).slice(0, 10)
        : "",
    });
  }, [template]);

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
      repeatType: form.repeatType,
      startDate: form.startDate,
    });
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit recurring template">
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <div
              className="text-sm font-medium"
              style={{ color: "var(--text)" }}
            >
              Repeat type
            </div>
            <select
              name="repeatType"
              value={form.repeatType}
              onChange={onChange}
              className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none"
              style={inputStyle()}
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
            </select>
          </div>

          <div>
            <div
              className="text-sm font-medium"
              style={{ color: "var(--text)" }}
            >
              Start date
            </div>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
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
