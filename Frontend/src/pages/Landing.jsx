import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { logoutApi } from "../api/authApi";

export default function Landing() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const onLogout = async () => {
    try {
      await logoutApi();
    } catch {}
    setUser(null);
    navigate("/");
  };

  const cardStyle = {
    background: "var(--card)",
    borderColor: "var(--border)",
  };

  const muted = { color: "var(--muted)" };
  const text = { color: "var(--text)" };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* NAVBAR */}
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-2xl"
              style={{ background: "var(--text)" }}
            />
            <div>
              <div
                className="text-sm font-semibold tracking-tight"
                style={text}
              >
                CareerSprint
              </div>
              <div className="text-xs" style={muted}>
                Placement Routine Tracker
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="rounded-2xl cursor-pointer border px-4 py-2 text-sm font-medium transition hover:opacity-90"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
                color: "var(--text)",
              }}
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>

            {user ? (
              <>
                <button
                  onClick={() => navigate("/app/today")}
                  className="rounded-2xl cursor-pointer px-4 py-2 text-sm font-medium transition hover:opacity-90"
                  style={{
                    background: "var(--text)",
                    color: "var(--bg)",
                  }}
                >
                  Go to Today
                </button>

                <button
                  onClick={onLogout}
                  className="rounded-2xl cursor-pointer border px-4 py-2 text-sm font-medium transition hover:opacity-90"
                  style={{
                    background: "var(--card)",
                    borderColor: "var(--border)",
                    color: "var(--text)",
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-2xl px-4 py-2 text-sm font-medium transition hover:opacity-80"
                  style={{ color: "var(--text)" }}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-2xl px-4 py-2 text-sm font-medium transition hover:opacity-90"
                  style={{
                    background: "var(--text)",
                    color: "var(--bg)",
                  }}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>

        {/* HERO */}
        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
                color: "var(--text)",
              }}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Built for 6-month campus placement preparation
            </div>

            <h1
              className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl"
              style={text}
            >
              {user ? (
                <>
                  Welcome back, {user.name} 👋 <br />
                  Continue your sprint today.
                </>
              ) : (
                <>
                  A daily command center <br />
                  for your placement journey.
                </>
              )}
            </h1>

            <p
              className="mt-4 max-w-xl text-base leading-relaxed"
              style={muted}
            >
              CareerSprint helps you manage DSA, Aptitude, Projects and Core
              subjects using recurring routines, daily goals, focus timer, and
              complete history — so you never lose consistency.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {user ? (
                <>
                  <button
                    onClick={() => navigate("/app/today")}
                    className="rounded-2xl cursor-pointer px-6 py-3 text-sm font-medium transition hover:opacity-90"
                    style={{
                      background: "var(--text)",
                      color: "var(--bg)",
                    }}
                  >
                    Open Today
                  </button>

                  <button
                    onClick={() => navigate("/app/create")}
                    className="rounded-2xl cursor-pointer border px-6 py-3 text-sm font-medium transition hover:opacity-90"
                    style={{
                      background: "var(--card)",
                      borderColor: "var(--border)",
                      color: "var(--text)",
                    }}
                  >
                    Create tasks
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="rounded-2xl px-6 py-3 text-sm font-medium transition hover:opacity-90"
                    style={{
                      background: "var(--text)",
                      color: "var(--bg)",
                    }}
                  >
                    Create free account
                  </Link>

                  <Link
                    to="/login"
                    className="rounded-2xl border px-6 py-3 text-sm font-medium transition hover:opacity-90"
                    style={{
                      background: "var(--card)",
                      borderColor: "var(--border)",
                      color: "var(--text)",
                    }}
                  >
                    I already have an account
                  </Link>
                </>
              )}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                "Recurring tasks",
                "Today view",
                "History tracking",
                "Focus timer",
              ].map((x) => (
                <div
                  key={x}
                  className="rounded-2xl border px-4 py-3 text-xs font-medium"
                  style={{
                    background: "var(--card)",
                    borderColor: "var(--border)",
                    color: "var(--text)",
                  }}
                >
                  {x}
                </div>
              ))}
            </div>
          </div>

          {/* PREVIEW PANEL */}
          <div className="rounded-3xl border p-6 shadow-sm" style={cardStyle}>
            <div className="flex items-start justify-between">
              <div>
                <div
                  className="text-sm font-semibold tracking-tight"
                  style={text}
                >
                  Today
                </div>
                <div className="mt-1 text-xs" style={muted}>
                  Monday • 6 tasks • 3h 45m
                </div>
              </div>

              <div
                className="rounded-2xl px-4 py-2 text-xs font-semibold"
                style={{
                  background: "var(--text)",
                  color: "var(--bg)",
                }}
              >
                62% done
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <PreviewTask
                title="Arrays: solve 2 problems"
                meta="DSA • 120 min"
                badge="Start"
              />
              <PreviewTask
                title="Percentages: 20 questions"
                meta="Aptitude • Done"
                badge="✓"
                done
              />
              <PreviewTask
                title="Project: improve Resume UI"
                meta="Project • 45 min"
                badge="Start"
              />
              <PreviewTask
                title="DBMS: JOIN + GROUP BY"
                meta="Core • 45 min"
                badge="Start"
              />
            </div>

            <div
              className="mt-6 rounded-2xl border p-4"
              style={{
                background: "var(--bg)",
                borderColor: "var(--border)",
              }}
            >
              <div className="text-xs" style={muted}>
                Weekly progress
              </div>

              <div
                className="mt-2 h-2 w-full rounded-full"
                style={{ background: "var(--border)" }}
              >
                <div
                  className="h-2 w-[62%] rounded-full"
                  style={{ background: "var(--text)" }}
                />
              </div>

              <div className="mt-2 text-xs" style={muted}>
                62% complete
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE GRID */}
        <div className="mt-20">
          <div className="text-sm font-semibold tracking-tight" style={text}>
            Why CareerSprint works
          </div>
          <div className="mt-2 max-w-2xl text-sm leading-relaxed" style={muted}>
            The goal is simple: remove daily decision fatigue and turn your plan
            into execution.
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <FeatureCard
              title="Recurring routine, auto-generated daily"
              desc="Set your weekly placement routine once. CareerSprint generates today’s tasks automatically."
            />
            <FeatureCard
              title="Custom goals for any day"
              desc="Add independent tasks for today, tomorrow, or any future date — no recurrence needed."
            />
            <FeatureCard
              title="Focus timer + time spent"
              desc="Track how much time you actually invested in DSA, Aptitude and projects."
            />
            <FeatureCard
              title="History that shows your consistency"
              desc="Only today is shown in main view. Old tasks go to history with full details."
            />
          </div>
        </div>

        {/* FOOTER */}
        <div
          className="mt-16 border-t pt-6 text-center text-xs"
          style={{ borderColor: "var(--border)", color: "var(--muted)" }}
        >
          © {new Date().getFullYear()} CareerSprint — Built for placement
          consistency.
        </div>
      </div>
    </div>
  );
}

/* ----------------- small components ----------------- */

function PreviewTask({ title, meta, badge, done = false }) {
  return (
    <div
      className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition ${
        done ? "opacity-60" : ""
      }`}
      style={{
        background: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      <div>
        <div
          className={`text-sm font-medium ${done ? "line-through" : ""}`}
          style={{ color: "var(--text)" }}
        >
          {title}
        </div>
        <div className="text-xs" style={{ color: "var(--muted)" }}>
          {meta}
        </div>
      </div>

      <div
        className="rounded-xl px-3 py-1 text-xs font-semibold"
        style={{
          background: done ? "#059669" : "var(--text)",
          color: done ? "white" : "var(--bg)",
        }}
      >
        {badge}
      </div>
    </div>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <div
      className="rounded-3xl border p-6 shadow-sm"
      style={{
        background: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      <div
        className="text-sm font-semibold tracking-tight"
        style={{ color: "var(--text)" }}
      >
        {title}
      </div>
      <div
        className="mt-2 text-sm leading-relaxed"
        style={{ color: "var(--muted)" }}
      >
        {desc}
      </div>
    </div>
  );
}
