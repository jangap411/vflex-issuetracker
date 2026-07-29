import {
  MessageSquare,
  Paperclip,
  Clock,
  ArrowRightLeft,
} from "lucide-react";

const TaskCard = ({ task, onTaskClick, onMoveTask }) => {
  const getPriorityStyle = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50";
      case "medium":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50";
      case "low":
      default:
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50";
    }
  };

  return (
    <div className="group relative p-4 rounded-xl bg-surface-container-lowest dark:bg-surface-container-high border border-outline-variant/60 hover:border-primary/50 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
      {/* Top Header: ID & Priority */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-bold text-outline uppercase tracking-wider">
          {task.id}
        </span>
        <div className="flex items-center gap-1.5">
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getPriorityStyle(task.priority)}`}
          >
            {task.priority}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveTask(task);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-all"
            title="Move status"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3
        onClick={() => onTaskClick(task)}
        className="font-semibold text-sm text-on-surface group-hover:text-primary line-clamp-2 leading-snug mb-1.5 transition-colors"
      >
        {task.title}
      </h3>

      {/* Description */}
      <p className="text-xs text-on-surface-variant line-clamp-2 mb-3 leading-relaxed">
        {task.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {task.tags.map((tag, idx) => (
          <span
            key={idx}
            className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Footer: Date, Metadata & Assignee */}
      <div className="pt-3 border-t border-outline-variant/40 flex items-center justify-between text-xs text-on-surface-variant">
        <div className="flex items-center gap-3">
          {task.dueDate && (
            <span className="flex items-center gap-1 text-[11px] text-outline font-medium">
              <Clock className="w-3 h-3" />
              <span>{task.dueDate}</span>
            </span>
          )}
          {task.commentsCount > 0 && (
            <span className="flex items-center gap-1 text-[11px] text-outline">
              <MessageSquare className="w-3 h-3" />
              <span>{task.commentsCount}</span>
            </span>
          )}
          {task.attachmentsCount > 0 && (
            <span className="flex items-center gap-1 text-[11px] text-outline">
              <Paperclip className="w-3 h-3" />
              <span>{task.attachmentsCount}</span>
            </span>
          )}
        </div>

        {/* Assignee Avatar */}
        {task.assignee && (
          <img
            src={task.assignee.avatar}
            alt={task.assignee.name}
            title={task.assignee.name}
            className="w-6 h-6 rounded-full object-cover ring-2 ring-surface"
          />
        )}
      </div>
    </div>
  );
};

export default TaskCard;
