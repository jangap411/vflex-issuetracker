import { useState } from "react";
import { X } from "lucide-react";

const CreateTaskModal = ({
  isOpen,
  onClose,
  onCreateTask,
  defaultStatus = "todo",
  members,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(defaultStatus);
  const [priority, setPriority] = useState("Medium");
  const [assigneeId, setAssigneeId] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setError("");
    setIsSubmitting(true);
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const newIssue = {
      title,
      description,
      status,
      priority,
      labels: tags,
      assignedTo: assigneeId || null,
      dueDate,
    };
    try {
      // Wait for the API so the modal stays open if the request fails.
      await onCreateTask(newIssue);
      onClose();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-surface-container-lowest dark:bg-surface-container-high border border-outline-variant rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <h2 className="font-bold text-lg text-on-surface">
              Create New Task
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 overflow-y-auto flex-1 text-sm"
        >
          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1.5 uppercase tracking-wider">
              Issue Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement OAuth login with PKCE flow..."
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container/60 border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1.5 uppercase tracking-wider">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context, acceptance criteria, or design specifications..."
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container/60 border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline"
            />
          </div>

          {/* Status & Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5 uppercase tracking-wider">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container/60 border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5 uppercase tracking-wider">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container/60 border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>

          {/* Assignee & Due Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5 uppercase tracking-wider">
                Assignee
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container/60 border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface"
              >
                <option value="">Unassigned</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5 uppercase tracking-wider">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container/60 border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1.5 uppercase tracking-wider">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Frontend, API, Design"
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container/60 border border-outline-variant/60 focus:outline-none focus:border-primary text-on-surface placeholder:text-outline"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-outline-variant/60 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 text-sm font-semibold text-on-primary bg-primary hover:bg-primary/90 rounded-xl shadow-md shadow-primary/20 transition-all"
            >
              {isSubmitting ? "Creating..." : "Create Issue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
