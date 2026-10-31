import { CalendarDays, Check, Circle, Clock3, Edit2, MoreHorizontal, Trash2 } from "lucide-react";
function dateLabel(value) { if (!value) return "No due date"; return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }); }
export default function TaskCard({ task, onEdit, onDelete, onStatus }) {
  const overdue = task.dueDate && new Date(task.dueDate) < new Date(new Date().toDateString()) && task.status !== "Completed";
  const nextStatus = task.status === "Pending" ? "In Progress" : task.status === "In Progress" ? "Completed" : "Pending";
  return <article className={`task-card ${task.status === "Completed" ? "is-complete" : ""}`}>
    <button className={`check-button ${task.status === "Completed" ? "checked" : ""}`} onClick={() => onStatus(task, task.status === "Completed" ? "Pending" : "Completed")} aria-label={task.status === "Completed" ? "Mark pending" : "Mark completed"}>{task.status === "Completed" ? <Check size={14}/> : <Circle size={17}/>}</button>
    <div className="task-content"><div className="task-title-row"><h3>{task.title}</h3><span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span></div>
      {task.description && <p className="task-description">{task.description}</p>}
      <div className="task-meta"><span className={`status status-${task.status.toLowerCase().replace(" ", "-")}`}><span className="status-dot"/>{task.status}</span><span className={overdue ? "due overdue" : "due"}><CalendarDays size={13}/>{overdue ? "Overdue · " : ""}{dateLabel(task.dueDate)}</span></div>
    </div>
    <div className="task-actions"><button className="icon-btn" title={`Move to ${nextStatus}`} onClick={() => onStatus(task, nextStatus)}><Clock3 size={16}/></button><button className="icon-btn" title="Edit task" onClick={() => onEdit(task)}><Edit2 size={16}/></button><button className="icon-btn danger-hover" title="Delete task" onClick={() => onDelete(task)}><Trash2 size={16}/></button></div>
  </article>;
}
