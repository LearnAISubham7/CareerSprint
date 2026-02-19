import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="h-screen" style={{ background: "var(--bg)" }}>
      {/* Topbar full width */}
      <Topbar onOpenSidebar={() => setMobileOpen(true)} />

      {/* Body takes remaining height */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Desktop Sidebar */}
        <div
          className="hidden w-72 border-r lg:block"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <Sidebar />
        </div>

        {/* Main scroll area */}
        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-10">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="absolute left-0 top-0 h-full w-80 max-w-[85%] border-r shadow-xl"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <Sidebar isMobile onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
