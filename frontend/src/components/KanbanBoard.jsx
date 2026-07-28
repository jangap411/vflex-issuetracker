import React from "react";
import TaskCard from "./TaskCard";
import { Plus, MoreHorizontal } from "lucide-react";

const KanbanBoard = ({
  columns,
  tasks,
  searchQuery,
  activeFilter,
  onTaskClick,
  onMoveTask,
  onOpenCreateTask,
}) => {
  // Filter tasks based on searchQuery and activeFilter
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    if (!matchesSearch) return false;

    if (activeFilter === "my_issues") {
      return t.assignee?.name === "Alex Rivera";
    }
    if (activeFilter === "high_priority") {
      return t.priority.toLowerCase() === "high";
    }
    return true;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
      {columns.map((column) => {
        const colTasks = filteredTasks.filter((t) => t.status === column.id);

        return (
          <div
            key={column.id}
            className="flex flex-col rounded-2xl bg-surface-container-low/70 dark:bg-surface-dim border border-outline-variant/60 p-4 min-h-[600px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between gap-2 mb-4 px-1">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-3 h-3 rounded-full border-2 ${column.color} bg-primary/20`}
                ></div>
                <h2 className="font-bold text-sm text-on-surface uppercase tracking-wide">
                  {column.title}
                </h2>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-surface-container text-on-surface-variant">
                  {colTasks.length}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onOpenCreateTask(column.id)}
                  className="p-1 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                  title="Add task to column"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                  title="Column options"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Task Cards Stack */}
            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
              {colTasks.length === 0 ? (
                <div className="py-12 border-2 border-dashed border-outline-variant/40 rounded-xl flex flex-col items-center justify-center text-center p-4">
                  <p className="text-xs font-medium text-outline mb-2">
                    No tasks in {column.title}
                  </p>
                  <button
                    onClick={() => onOpenCreateTask(column.id)}
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create a task</span>
                  </button>
                </div>
              ) : (
                colTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onTaskClick={onTaskClick}
                    onMoveTask={onMoveTask}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
