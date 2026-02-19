import React from "react";
import Modal from "../common/Modal";

export default function DeleteTemplateModal({
  open,
  onClose,
  template,
  onDelete,
  deleting,
}) {
  if (!template) return null;

  return (
    <Modal open={open} onClose={onClose} title="Delete recurring template">
      <div className="text-sm" style={{ color: "var(--muted)" }}>
        Template:
        <span style={{ color: "var(--text)", fontWeight: 600 }}>
          {" "}
          {template.title}
        </span>
      </div>

      <div className="mt-5 space-y-3">
        <button
          disabled={deleting}
          onClick={() => onDelete("ONLY")}
          className="w-full cursor-pointer rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition hover:opacity-90 disabled:opacity-60"
          style={{
            background: "var(--bg)",
            borderColor: "var(--border)",
            color: "var(--text)",
          }}
        >
          Delete only template
          <div
            className="mt-1 text-xs font-normal"
            style={{ color: "var(--muted)" }}
          >
            Future tasks will stop generating. Existing tasks remain in history.
          </div>
        </button>

        <button
          disabled={deleting}
          onClick={() => onDelete("FUTURE")}
          className="w-full cursor-pointer rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition hover:opacity-90 disabled:opacity-60"
          style={{
            background: "var(--bg)",
            borderColor: "var(--border)",
            color: "var(--text)",
          }}
        >
          Delete template + delete future tasks
          <div
            className="mt-1 text-xs font-normal"
            style={{ color: "var(--muted)" }}
          >
            Past history stays, but upcoming tasks from this template will be
            removed.
          </div>
        </button>

        <button
          disabled={deleting}
          onClick={() => onDelete("ALL")}
          className="w-full cursor-pointer rounded-2xl px-4 py-3 text-left text-sm font-semibold transition hover:opacity-90 disabled:opacity-60"
          style={{
            background: "#dc2626",
            color: "white",
          }}
        >
          Delete template + delete ALL tasks (history too)
          <div className="mt-1 text-xs font-normal text-white/80">
            This removes all tasks created from this template.
          </div>
        </button>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="rounded-2xl cursor-pointer border px-4 py-2 text-sm font-semibold"
          style={{
            background: "var(--bg)",
            borderColor: "var(--border)",
            color: "var(--text)",
          }}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
