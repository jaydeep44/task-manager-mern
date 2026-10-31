import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, AlertCircle, ArrowDownUp, CheckCircle2, CircleDashed, ClipboardList, Plus, Search, Sparkles, X } from "lucide-react";
import TaskCard from "./components/TaskCard.jsx";
import TaskModal from "./components/TaskModal.jsx";
import { taskService } from "./services/taskService.js";

const filters = ["All tasks", "Pending", "In Progress", "Completed"];
export default function App() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All tasks");
  const [priority, setPriority] = useState("All priorities");
  const [sort, setSort] = useState("newest");
  const [modal, setModal] = useState({ open: false, task: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const loadTasks = useCallback(async () => {
    setLoading(true); setError("");
    try { setTasks(await taskService.list({ search, status: status === "All tasks" ? undefined : status, priority: priority === "All priorities" ? undefined : priority, sort })); }
    catch (e) { setError(e.response?.data?.message || "Could not connect to the API. Check that the backend and MongoDB are running."); }
    finally { setLoading(false); }
  }, [search, status, priority, sort]);
  useEffect(() => { const timer = setTimeout(loadTasks, 250); return () => clearTimeout(timer); }, [loadTasks]);
  const counts = useMemo(() => ({ total: tasks.length, pending: tasks.filter(t => t.status === "Pending").length, progress: tasks.filter(t => t.status === "In Progress").length, completed: tasks.filter(t => t.status === "Completed").length }), [tasks]);
  const notify = message => { setToast(message); setTimeout(() => setToast(""), 2600); };
  const saveTask = async data => { setSaving(true); try { if (modal.task) await taskService.update(modal.task._id, data); else await taskService.create(data); setModal({ open: false, task: null }); await loadTasks(); notify(modal.task ? "Task updated successfully" : "Task created successfully"); } catch (e) { throw new Error(e.response?.data?.message || "Unable to save task."); } finally { setSaving(false); } };
  const updateStatus = async (task, next) => { try { await taskService.update(task._id, { status: next }); await loadTasks(); notify("Task status updated"); } catch (e) { setError(e.response?.data?.message || "Unable to update task."); } };
  const deleteTask = async task => { if (!window.confirm(`Delete “${task.title}”? This cannot be undone.`)) return; try { await taskService.remove(task._id); await loadTasks(); notify("Task deleted"); } catch (e) { setError(e.response?.data?.message || "Unable to delete task."); } };
  const clearFilters = () => { setSearch(""); setStatus("All tasks"); setPriority("All priorities"); };
  return <div className="app-shell">
    <aside className="sidebar"><div className="brand"><div className="brand-mark"><ClipboardList size={21}/></div><span>taskflow<span className="brand-period">.</span></span></div><div className="side-label">WORKSPACE</div><button className="side-link active"><Activity size={17}/> Overview</button><div className="sidebar-bottom"><div className="avatar">JC</div><div><strong>My workspace</strong><small>Personal task space</small></div><span className="online-dot"/></div></aside>
    <main className="main-area"><header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <strong>Overview</strong></div><div className="top-right"><span className="today-label">{new Date().toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"})}</span><div className="avatar avatar-small">JC</div></div></header>
      <div className="page-content"><section className="welcome-row"><div><div className="eyebrow welcome-eyebrow"><Sparkles size={13}/> YOUR PRODUCTIVITY SPACE</div><h1>Good work starts<br className="mobile-break"/> with a clear plan<span>.</span></h1><p>Keep your priorities in focus and make progress, one task at a time.</p></div><button className="btn btn-primary create-btn" onClick={() => setModal({ open: true, task: null })}><Plus size={17}/> New task</button></section>
        <section className="stats-grid">
          <Stat icon={<ClipboardList size={18}/>} label="Total tasks" value={counts.total} tone="blue"/>
          <Stat icon={<CircleDashed size={18}/>} label="Pending" value={counts.pending} tone="amber"/>
          <Stat icon={<Activity size={18}/>} label="In progress" value={counts.progress} tone="purple"/>
          <Stat icon={<CheckCircle2 size={18}/>} label="Completed" value={counts.completed} tone="green"/>
        </section>
        <section className="tasks-section"><div className="section-heading"><div><h2>Your tasks</h2><p>A focused view of everything on your plate.</p></div><span className="task-count">{tasks.length} {tasks.length === 1 ? "task" : "tasks"}</span></div>
          <div className="toolbar"><div className="search-box"><Search size={17}/><input placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)}/>{search && <button onClick={() => setSearch("")} aria-label="Clear search"><X size={14}/></button>}</div><div className="toolbar-filters"><select aria-label="Filter by priority" value={priority} onChange={e => setPriority(e.target.value)}><option>All priorities</option><option>High</option><option>Medium</option><option>Low</option></select><select aria-label="Sort tasks" value={sort} onChange={e => setSort(e.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="dueDate">Due date</option><option value="priority">Priority</option></select><span className="sort-icon"><ArrowDownUp size={15}/></span></div></div>
          <div className="filter-tabs">{filters.map(f => <button key={f} onClick={() => setStatus(f)} className={status === f ? "filter-tab selected" : "filter-tab"}>{f}{f === "All tasks" ? <span>{counts.total}</span> : null}</button>)}</div>
          {error && <div className="error-banner"><AlertCircle size={17}/><span>{error}</span><button onClick={() => setError("")}>Dismiss</button></div>}
          {loading ? <div className="loading-state"><div className="spinner"/>Loading your tasks...</div> : tasks.length ? <div className="task-list">{tasks.map(task => <TaskCard key={task._id} task={task} onEdit={t => setModal({ open: true, task: t })} onDelete={deleteTask} onStatus={updateStatus}/>)}</div> : <div className="empty-state"><div className="empty-icon"><ClipboardList size={25}/></div><h3>{search || status !== "All tasks" || priority !== "All priorities" ? "No matching tasks" : "A fresh start"}</h3><p>{search || status !== "All tasks" || priority !== "All priorities" ? "Try changing your search or filters." : "Create your first task and turn your plans into progress."}</p>{search || status !== "All tasks" || priority !== "All priorities" ? <button className="btn btn-ghost" onClick={clearFilters}>Clear filters</button> : <button className="btn btn-primary" onClick={() => setModal({ open: true, task: null })}><Plus size={16}/> Create your first task</button>}</div>}
        </section><footer className="footer">Made for focused work <span>·</span> TaskFlow</footer>
      </div>
    </main>
    <TaskModal open={modal.open} task={modal.task} onClose={() => setModal({ open: false, task: null })} onSave={saveTask} saving={saving}/>
    {toast && <div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
  </div>;
}
function Stat({ icon, label, value, tone }) { return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div><div className="stat-label">{label}</div><div className="stat-value">{value}</div></div></div>; }
