import React from "react";
import TaskItem from "./TaskItem";

export default function CategorySection({
  title,
  tasks,
  onToggleComplete,
  onStartTimer,
  onStopTimer,
  onEdit,
  onDelete,
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>
          {title}
        </div>
        <div className="text-xs" style={{ color: "var(--muted)" }}>
          {tasks.length} tasks
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onToggleComplete={onToggleComplete}
            onStartTimer={onStartTimer}
            onStopTimer={onStopTimer}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}
