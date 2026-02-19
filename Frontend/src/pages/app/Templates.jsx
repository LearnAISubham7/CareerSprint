import React, { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import {
  getTemplatesApi,
  updateTemplateApi,
  deleteTemplateAdvancedApi,
  toggleTemplateActiveApi,
} from "../../api/templateApi";
import EditTemplateModal from "../../components/templates/EditTemplateModal";
import DeleteTemplateModal from "../../components/templates/DeleteTemplateModal";

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState(null);

  const onEdit = (template) => {
    setSelectedTemplate(template);
    setEditOpen(true);
  };

  const onSaveEdit = async (payload) => {
    try {
      const updated = await updateTemplateApi(selectedTemplate._id, payload);

      setTemplates((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t)),
      );

      setEditOpen(false);
      setSelectedTemplate(null);
    } catch (err) {
      alert(err?.response?.data?.message || "Update failed.");
    }
  };

  const askDelete = (template) => {
    setSelectedDelete(template);
    setDeleteOpen(true);
  };

  const doDelete = async (mode) => {
    try {
      setDeletingId(selectedDelete._id);

      await deleteTemplateAdvancedApi(selectedDelete._id, mode);

      setTemplates((prev) => prev.filter((t) => t._id !== selectedDelete._id));

      setDeleteOpen(false);
      setSelectedDelete(null);
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed.");
    } finally {
      setDeletingId("");
    }
  };

  const onToggleActive = async (template) => {
    try {
      const updated = await toggleTemplateActiveApi(template._id);

      setTemplates((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t)),
      );
    } catch (err) {
      alert(err?.response?.data?.message || "Action failed.");
    }
  };

  const loadTemplates = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await getTemplatesApi();
      setTemplates(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load templates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

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
              Recurring Templates
            </div>
            <div className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              These templates auto-generate tasks every day/week/month.
            </div>
          </div>

          <button
            onClick={loadTemplates}
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
          Loading templates...
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
          {templates.length === 0 ? (
            <EmptyState />
          ) : (
            templates.map((t) => (
              <TemplateCard
                key={t._id}
                t={t}
                deleting={deletingId === t._id}
                onEdit={() => onEdit(t)}
                onAskDelete={askDelete}
                onToggleActive={onToggleActive}
              />
            ))
          )}
        </div>
      )}
      <EditTemplateModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedTemplate(null);
        }}
        template={selectedTemplate}
        onSave={onSaveEdit}
      />
      <DeleteTemplateModal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedDelete(null);
        }}
        template={selectedDelete}
        deleting={!!deletingId}
        onDelete={doDelete}
      />
    </AppLayout>
  );
}

/* ----------------- UI components ----------------- */

function TemplateCard({ t, onAskDelete, onEdit, onToggleActive, deleting }) {
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
            className="text-sm font-semibold tracking-tight"
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
            <Badge>{formatRepeat(t.repeatType)}</Badge>

            {t.isActive ? <Badge>Active</Badge> : <Badge>Paused</Badge>}

            <span style={{ color: "var(--muted)" }}>
              Est: {t.expectedMinutes} min
            </span>

            {t.startDate && (
              <span style={{ color: "var(--muted)" }}>
                Start: {formatDate(t.startDate)}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onToggleActive(t)}
            className="rounded-2xl cursor-pointer border px-4 py-2 text-sm font-semibold transition hover:opacity-90"
            style={{
              background: t.isActive ? "var(--bg)" : "var(--text)",
              borderColor: "var(--border)",
              color: t.isActive ? "var(--text)" : "var(--bg)",
            }}
          >
            {t.isActive ? "Pause" : "Resume"}
            {/* {t.isActive ? <Badge>Active</Badge> : <Badge>Paused</Badge>} */}
          </button>

          <button
            onClick={onEdit}
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
            disabled={deleting}
            onClick={() => onAskDelete(t)}
            className="rounded-2xl cursor-pointer border px-4 py-2 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              background: "var(--bg)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
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
        No recurring templates yet
      </div>
      <div className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
        Go to Create → Recurring and add your daily routine.
      </div>
    </div>
  );
}

/* ----------------- helpers ----------------- */

function formatRepeat(repeatType) {
  if (repeatType === "DAILY") return "Daily";
  if (repeatType === "WEEKLY") return "Weekly";
  if (repeatType === "MONTHLY") return "Monthly";
  return repeatType;
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
