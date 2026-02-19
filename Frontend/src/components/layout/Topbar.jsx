import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Moon, Sun, Menu } from "lucide-react";

import { ThemeContext } from "../../context/ThemeContext";
import { AuthContext } from "../../context/AuthContext";
import { logoutApi } from "../../api/authApi";

export default function Topbar({ onOpenSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();

  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, setUser } = useContext(AuthContext);

  const pageTitle = getTitle(location.pathname);

  const onLogout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      // ignore
    } finally {
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <header
      className="sticky top-0 z-20 border-b px-6 py-4 "
      style={{
        background: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-3">
          {/* Mobile menu */}
          <button
            onClick={onOpenSidebar}
            className="inline-flex items-center justify-center rounded-2xl border p-2 lg:hidden cursor-pointer"
            style={{
              background: "var(--bg)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          >
            <Menu size={18} />
          </button>
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
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium transition hover:opacity-90 cursor-pointer"
            style={{
              background: "var(--bg)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            <span className="hidden sm:inline">
              {theme === "dark" ? "Light" : "Dark"}
            </span>
          </button>

          <button
            onClick={onLogout}
            className="inline-flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition hover:opacity-90"
            style={{
              background: "var(--text)",
              color: "var(--bg)",
            }}
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function getTitle(pathname) {
  if (pathname.includes("/app/today")) return "Today";
  if (pathname.includes("/app/create")) return "Create Tasks";
  if (pathname.includes("/app/templates")) return "Recurring Tasks";
  if (pathname.includes("/app/history")) return "History";
  return "CareerSprint";
}
