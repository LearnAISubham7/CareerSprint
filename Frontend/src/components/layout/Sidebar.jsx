import React from "react";
import { Link, NavLink } from "react-router-dom";
import { CalendarDays, Clock, Plus, Repeat2, X } from "lucide-react";

const navItems = [
  { to: "/app/today", label: "Today", icon: CalendarDays },
  { to: "/app/create", label: "Create", icon: Plus },
  { to: "/app/templates", label: "Recurring", icon: Repeat2 },
  { to: "/app/history", label: "History", icon: Clock },
];

export default function Sidebar({ isMobile = false, onClose }) {
  return (
    <aside
      className={`${
        isMobile ? "h-full w-full p-5" : "hidden h-full w-full p-5 lg:block"
      }`}
      style={{
        background: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      {/* Brand + mobile close */}
      {isMobile && (
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-2xl"
              style={{ background: "var(--text)" }}
            />
            <div>
              <div
                className="text-sm font-semibold tracking-tight"
                style={{ color: "var(--text)" }}
              >
                CareerSprint
              </div>
              <div className="text-xs" style={{ color: "var(--muted)" }}>
                Placement Routine Tracker
              </div>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="rounded-2xl border p-2 cursor-pointer"
            style={{
              background: "var(--bg)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Nav */}
      <nav className="mt-10 space-y-2">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            {...item}
            onClose={onClose}
            isMobile={isMobile}
          />
        ))}
      </nav>

      {/* Footer hint */}
      <div
        className="mt-10 rounded-3xl border p-4 text-xs leading-relaxed"
        style={{
          background: "var(--bg)",
          borderColor: "var(--border)",
          color: "var(--muted)",
        }}
      >
        <div className="font-semibold" style={{ color: "var(--text)" }}>
          Tip
        </div>
        <div className="mt-1">
          Keep Today clean. Old tasks automatically go to History.
        </div>
      </div>
    </aside>
  );
}

function NavItem({ to, label, icon: Icon, isMobile, onClose }) {
  return (
    <NavLink
      to={to}
      onClick={() => {
        if (isMobile && onClose) onClose();
      }}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
          isActive ? "shadow-sm" : "opacity-80 hover:opacity-100"
        }`
      }
      style={({ isActive }) => ({
        background: isActive ? "var(--bg)" : "transparent",
        borderColor: "var(--border)",
        color: "var(--text)",
      })}
    >
      <Icon size={18} />
      {label}
    </NavLink>
  );
}
