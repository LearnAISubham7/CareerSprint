import React from "react";

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* modal */}
      <div
        className="relative w-full max-w-lg rounded-3xl border p-6 shadow-xl"
        style={{
          background: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div
              className="text-base font-semibold tracking-tight"
              style={{ color: "var(--text)" }}
            >
              {title}
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-2xl border px-3 py-1 text-sm font-semibold cursor-pointer"
            style={{
              background: "var(--bg)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          >
            Close
          </button>
        </div>

        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
