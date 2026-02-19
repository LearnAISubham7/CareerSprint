import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { registerApi } from "../../api/authApi";
import { AuthContext } from "../../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { setUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Please fill all fields.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const user = await registerApi(form); // backend sets cookie
      setUser(user);
      navigate("/app/today");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Registration failed. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    background: "var(--card)",
    borderColor: "var(--border)",
  };

  const muted = { color: "var(--muted)" };
  const text = { color: "var(--text)" };

  return (
    <div className="min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 lg:grid-cols-2">
        {/* LEFT PANEL */}
        <div className="hidden lg:flex flex-col justify-between p-10">
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
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

            <h1
              className="mt-10 text-4xl font-semibold leading-tight tracking-tight"
              style={text}
            >
              Create your account.
              <br />
              Start your 6-month plan.
            </h1>

            <p
              className="mt-4 max-w-md text-base leading-relaxed"
              style={muted}
            >
              Your recurring routine will auto-generate daily tasks. Your custom
              goals stay independent. Everything is tracked in history.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3">
              <MiniStat
                title="Daily routine"
                desc="Recurring tasks auto created."
              />
              <MiniStat title="Custom goals" desc="Set tasks for any date." />
              <MiniStat
                title="Consistency"
                desc="History shows your progress."
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs" style={muted}>
              Secure cookie authentication • No token stored in localStorage
            </div>

            <button
              onClick={toggleTheme}
              className="rounded-2xl cursor-pointer border px-4 py-2 text-xs font-semibold transition hover:opacity-90"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
                color: "var(--text)",
              }}
            >
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            {/* Mobile top */}
            <div className="mb-6 flex items-center justify-between lg:hidden">
              <Link to="/" className="text-sm font-semibold" style={text}>
                CareerSprint
              </Link>

              <button
                onClick={toggleTheme}
                className="rounded-2xl cursor-pointer border px-4 py-2 text-xs font-semibold"
                style={{
                  background: "var(--card)",
                  borderColor: "var(--border)",
                  color: "var(--text)",
                }}
              >
                {theme === "dark" ? "Light" : "Dark"}
              </button>
            </div>

            <div className="rounded-3xl border p-8 shadow-sm" style={cardStyle}>
              <div>
                <h2
                  className="text-2xl font-semibold tracking-tight"
                  style={text}
                >
                  Register
                </h2>
                <p className="mt-1 text-sm" style={muted}>
                  Create your account to start tracking.
                </p>
              </div>

              {error && (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium" style={text}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="Subham"
                    className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-zinc-400/30"
                    style={{
                      background: "var(--bg)",
                      borderColor: "var(--border)",
                      color: "var(--text)",
                    }}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium" style={text}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-zinc-400/30"
                    style={{
                      background: "var(--bg)",
                      borderColor: "var(--border)",
                      color: "var(--text)",
                    }}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium" style={text}>
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={onChange}
                    placeholder="Minimum 6 characters"
                    className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-zinc-400/30"
                    style={{
                      background: "var(--bg)",
                      borderColor: "var(--border)",
                      color: "var(--text)",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full cursor-pointer rounded-2xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    background: "var(--text)",
                    color: "var(--bg)",
                  }}
                >
                  {loading ? "Creating..." : "Create account"}
                </button>
              </form>

              <div className="mt-6 text-center text-sm" style={muted}>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold underline underline-offset-4"
                  style={text}
                >
                  Login
                </Link>
              </div>
            </div>

            <div className="mt-6 text-center text-xs" style={muted}>
              Your routine stays private — tasks are linked to your account.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- small component ---------- */

function MiniStat({ title, desc }) {
  return (
    <div
      className="rounded-3xl border p-5 shadow-sm"
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
      <div className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
        {desc}
      </div>
    </div>
  );
}
