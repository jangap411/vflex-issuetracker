import React from "react";
import {
  X,
  Calendar,
  User,
  Tag,
  Clock,
  MessageSquare,
  Trash2,
  ArrowRight,
} from "lucide-react";

const TaskDetailModal = ({
  task,
  isOpen,
  onClose,
  onUpdateStatus,
  onDeleteTask,
}) => {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-surface-container-lowest dark:bg-surface-container-high border border-outline-variant rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-outline uppercase tracking-wider">
              {task.id}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-fixed text-on-primary-fixed">
              {task.priority} Priority
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDeleteTask(task.id)}
              className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Title */}
          <h2 className="font-bold text-xl text-on-surface leading-tight">
            {task.title}
          </h2>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-outline mb-2">
              Description
            </h4>
            <p className="text-on-surface-variant leading-relaxed bg-surface-container/40 p-4 rounded-xl border border-outline-variant/40">
              {task.description || "No additional description provided."}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-surface-container/60 border border-outline-variant/60">
            <div>
              <span className="text-[11px] font-semibold text-outline uppercase">
                Status
              </span>
              <select
                value={task.status}
                onChange={(e) => onUpdateStatus(task.id, e.target.value)}
                className="mt-1 w-full bg-surface border border-outline-variant text-xs font-semibold rounded-lg px-2 py-1.5 text-on-surface"
              >
                <option value="backlog">Backlog</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-outline uppercase">
                Assignee
              </span>
              <div className="mt-1 flex items-center gap-2">
                <img
                  src={task.assignee?.avatar}
                  alt="Assignee"
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span className="text-xs font-medium text-on-surface truncate">
                  {task.assignee?.name || "Unassigned"}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-outline uppercase">
                Due Date
              </span>
              <div className="mt-1 flex items-center gap-1 text-xs text-on-surface">
                <Clock className="w-3.5 h-3.5 text-outline" />
                <span>{task.dueDate || "N/A"}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-outline uppercase">
                Comments
              </span>
              <div className="mt-1 flex items-center gap-1 text-xs text-on-surface">
                <MessageSquare className="w-3.5 h-3.5 text-outline" />
                <span>{task.commentsCount || 0} discussion(s)</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-outline mb-2">
              Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {task.tags?.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-outline-variant flex items-center justify-between bg-surface-container-low">
          <span className="text-xs text-outline">Last modified today</span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-on-primary bg-primary rounded-xl hover:bg-primary/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
