import React, { useEffect, useState, useContext } from "react";
import AppLayout from "../components/layout/AppLayout";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { AuthContext } from "../context/AuthContext";
import { getActivityApi } from "../api/userApi";
import { useMemo } from "react";
import { Tooltip } from "react-tooltip";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    loadActivity();
  }, []);

  const loadActivity = async () => {
    try {
      const data = await getActivityApi();
      setActivity(data.activity);
    } catch (err) {
      console.error(err);
    }
  };
  const stats = useMemo(() => {
    if (!activity.length) {
      return { activeDays: 0, currentStreak: 0 };
    }

    const map = new Map(activity.map((a) => [a.date, a.count]));

    let activeDays = activity.filter((a) => a.count > 0).length;

    // Calculate streak
    let streak = 0;
    let current = new Date();

    while (true) {
      const key = current.toISOString().slice(0, 10);
      if (map.get(key) > 0) {
        streak++;
        current.setDate(current.getDate() - 1);
      } else {
        break;
      }
    }

    return {
      activeDays,
      currentStreak: streak,
    };
  }, [activity]);

  return (
    <AppLayout>
      {/* Profile Header */}
      <div
        className="rounded-3xl border p-6"
        style={{
          background: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold"
            style={{
              background: "var(--text)",
              color: "var(--bg)",
            }}
          >
            {user?.name?.[0]}
          </div>

          <div>
            <div
              className="text-lg font-semibold"
              style={{ color: "var(--text)" }}
            >
              {user?.name}
            </div>
            <div className="text-sm" style={{ color: "var(--muted)" }}>
              {user?.email}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 text-sm">
        <div style={{ color: "var(--muted)" }}>Active Days:</div>
        <div className="font-semibold" style={{ color: "var(--text)" }}>
          {stats.activeDays}
        </div>
      </div>
      {/* Activity Heatmap */}
      <div
        className="mt-6 rounded-3xl border p-6"
        style={{
          background: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>
          Activity
        </div>

        <div className="mt-4  overflow-x-auto">
          <CalendarHeatmap
            startDate={new Date(new Date().setMonth(new Date().getMonth() - 6))}
            endDate={new Date(new Date().setMonth(new Date().getMonth() + 6))}
            values={activity}
            gutterSize={2}
            showWeekdayLabels={false}
            classForValue={(value) => {
              if (!value || value.count === 0) return "color-empty";
              if (value.count >= 5) return "color-scale-4";
              if (value.count >= 3) return "color-scale-3";
              if (value.count >= 2) return "color-scale-2";
              return "color-scale-1";
            }}
            tooltipDataAttrs={(value) => {
              if (!value || !value.date) return null;

              return {
                "data-tooltip-id": "heatmap-tooltip",
                "data-tooltip-content": `${value.date} • ${value.count || 0} tasks`,
              };
            }}
          />
          <Tooltip id="heatmap-tooltip" />
        </div>
      </div>
    </AppLayout>
  );
}
