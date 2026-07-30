import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import KanbanBoard from "../components/KanbanBoard";
import CreateTaskModal from "../components/CreateTaskModal";
import TaskDetailModal from "../components/TaskDetailModal";
import { getUsers } from "../services/auth";
import {
  createIssue,
  deleteIssue,
  getIssues,
  updateIssueStatus,
  addComment as addIssueComment,
} from "../services/issues";
import {
  SlidersHorizontal,
  Layers,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

// columns
const initialColumns = [
  { id: "todo", title: "To Do", color: "border-slate-300" },
  { id: "in_progress", title: "In Progress", color: "border-blue-500" },
  { id: "in_review", title: "In Review", color: "border-purple-500" },
  { id: "done", title: "Done", color: "border-emerald-500" },
];

const BoardPage = ({
  searchQuery,
  onOpenCreateTask,
  isCreateModalOpen,
  setIsCreateModalOpen,
  defaultColumnForCreate,
}) => {
  const navigate = useNavigate();
  const [columns] = useState(initialColumns);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // all, my_issues, high_priority
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const loadBoard = async () => {
      try {
        // Load tasks and selectable assignees together when the board opens.
        const [loadedTasks, usersResponse] = await Promise.all([
          getIssues(),
          getUsers(),
        ]);
        setTasks(loadedTasks);
        setMembers(
          usersResponse.data.map((user) => ({
            id: user._id,
            name: user.fullName,
            role: user.role,
            avatar: user.avatar,
          })),
        );
      } catch (requestError) {
        setError(requestError.message);
        if (requestError.message.includes("Not authorized"))
          navigate("/login", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };
    loadBoard();
  }, [navigate]);

  // Statistics
  const totalCount = tasks.length;
  const doneCount = tasks.filter((t) => t.status === "done").length;
  const highPriorityCount = tasks.filter(
    (t) => t.priority.toLowerCase() === "high",
  ).length;

  const handleCreateTask = async (newIssue) => {
    const createdTask = await createIssue(newIssue);
    setTasks((currentTasks) => [createdTask, ...currentTasks]);
  };

  const handleMoveTask = async (taskToMove) => {
    const statusOrder = ["todo", "in_progress", "in_review", "done"];
    const currentIndex = statusOrder.indexOf(taskToMove.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];

    try {
      const updatedTask = await updateIssueStatus(taskToMove.id, nextStatus);
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task,
        ),
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      const updatedTask = await updateIssueStatus(taskId, newStatus);
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task,
        ),
      );
      setSelectedTask(updatedTask);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteIssue(taskId);
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId),
      );
      setSelectedTask(null);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleAddComment = async (taskId, body) => {
    const updatedTask = await addIssueComment(taskId, body);
    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    );
    setSelectedTask(updatedTask);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Page Title & Stats Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-fixed text-on-primary-fixed">
              Sprint #42 Active
            </span>
            <span className="text-xs text-outline font-medium">
              Ends in 4 days
            </span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface">
            Modern Issue Board
          </h1>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container/60 border border-outline-variant/60">
            <Layers className="w-4 h-4 text-primary" />
            <span className="text-xs text-on-surface font-semibold">
              {totalCount} Total Issues
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container/60 border border-outline-variant/60">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-on-surface font-semibold">
              {highPriorityCount} High Priority
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container/60 border border-outline-variant/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-xs text-on-surface font-semibold">
              {doneCount} Completed
            </span>
          </div>
        </div>
      </div>
      {error && (
        <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}
      {isLoading && (
        <p className="text-sm text-on-surface-variant">Loading issues...</p>
      )}

      {/* Filter Tabs & Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-2 rounded-2xl bg-surface-container-low border border-outline-variant/60">
        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeFilter === "all"
                ? "bg-primary text-on-primary shadow-sm shadow-primary/20"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            All Issues ({totalCount})
          </button>
          <button
            onClick={() => setActiveFilter("my_issues")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeFilter === "my_issues"
                ? "bg-primary text-on-primary shadow-sm shadow-primary/20"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            Assigned to Me
          </button>
          <button
            onClick={() => setActiveFilter("high_priority")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeFilter === "high_priority"
                ? "bg-primary text-on-primary shadow-sm shadow-primary/20"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            🔥 High Priority ({highPriorityCount})
          </button>
        </div>

        {/* View Toggle / Sort */}
        <div className="flex items-center justify-end gap-2 text-xs">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-outline-variant/60 text-on-surface-variant hover:bg-surface-container">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Sort by Priority</span>
          </button>
        </div>
      </div>

      {/* Main Kanban Board Container */}
      <KanbanBoard
        columns={columns}
        tasks={tasks}
        searchQuery={searchQuery}
        activeFilter={activeFilter}
        onTaskClick={(task) => setSelectedTask(task)}
        onMoveTask={handleMoveTask}
        onOpenCreateTask={onOpenCreateTask}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        key={defaultColumnForCreate}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTask={handleCreateTask}
        defaultStatus={defaultColumnForCreate}
        members={members}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdateStatus={handleUpdateTaskStatus}
        onDeleteTask={handleDeleteTask}
        onAddComment={handleAddComment}
      />
    </div>
  );
};

export default BoardPage;
