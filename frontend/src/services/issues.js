import { apiRequest } from "./api";

// Convert the API response into the task shape expected by existing UI components.
export const toTask = (issue) => ({
  id: issue._id,
  title: issue.title,
  description: issue.description,
  status: issue.status,
  priority: issue.priority,
  tags: issue.labels || [],
  assignee: issue.assignedTo
    ? { id: issue.assignedTo._id, name: issue.assignedTo.fullName, avatar: issue.assignedTo.avatar }
    : null,
  comments: (issue.comments || []).map((comment) => ({
    id: comment._id,
    body: comment.body,
    author: comment.author
      ? {
          id: comment.author._id,
          name: comment.author.fullName,
          avatar: comment.author.avatar,
        }
      : null,
    createdAt: comment.createdAt,
  })),
  commentsCount: issue.comments?.length || issue.commentsCount || 0,
  attachmentsCount: issue.attachments?.length || 0,
  dueDate: issue.dueDate ? issue.dueDate.slice(0, 10) : "",
});

export const getIssues = async () => (await apiRequest("/issues")).data.map(toTask);
export const createIssue = async (issue) => toTask((await apiRequest("/issues", {
  method: "POST",
  body: JSON.stringify(issue),
})).data);
export const updateIssueStatus = async (id, status) => toTask((await apiRequest(`/issues/${id}/status`, {
  method: "PATCH",
  body: JSON.stringify({ status }),
})).data);
export const deleteIssue = (id) => apiRequest(`/issues/${id}`, { method: "DELETE" });
export const addComment = async (id, body) => toTask((await apiRequest(`/issues/${id}/comments`, {
  method: "POST",
  body: JSON.stringify({ body }),
})).data);
