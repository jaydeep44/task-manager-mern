import { useEffect, useState } from "react";
import { X } from "lucide-react";

const blank = { title: "", description: "", status: "Pending", priority: "Medium", dueDate: "" };
export default function TaskModal({ open, task, onClose, onSave, saving }) {
  const [form, setForm] = useState(blank);
  const [error, setError] = useState("");
  useEffect(() => {
    if (open) { setForm(task ? { ...blank, ...task, dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0,10) : "" } : blank); setError(""); }
  }, [open, task]);
  if (!open) return null;
  const change = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const submit = async e => { e.preventDefault(); if (!form.title.trim()) return setError("Please enter a task title."); try { await onSave({ ...form, title: form.title.trim(), dueDate: form.dueDate || null }); } catch (err) { setError(err.message || "Unable to save task."); } };
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-head"><div><span className="eyebrow">{task ? "UPDATE ITEM" : "NEW ITEM"}</span><h2 id="modal-title">{task ? "Edit task" : "Create a task"}</h2></div><button className="icon-btn" onClick={onClose} aria-label="Close"><X size={19}/></button></div>
      <form onSubmit={submit} className="task-form">
        <label>Task title <span className="required">*</span><input autoFocus name="title" maxLength="120" placeholder="e.g. Prepare project proposal" value={form.title} onChange={change}/></label>
        <label>Description<textarea name="description" maxLength="1000" rows="3" placeholder="Add a few details..." value={form.description} onChange={change}/></label>
        <div className="form-grid">
          <label>Status<select name="status" value={form.status} onChange={change}><option>Pending</option><option>In Progress</option><option>Completed</option></select></label>
          <label>Priority<select name="priority" value={form.priority} onChange={change}><option>Low</option><option>Medium</option><option>High</option></select></label>
        </div>
        <label>Due date<input type="date" name="dueDate" value={form.dueDate} onChange={change}/></label>
        {error && <p className="form-error">{error}</p>}
        <div className="modal-actions"><button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-primary" disabled={saving}>{saving ? "Saving..." : task ? "Save changes" : "Create task"}</button></div>
      </form>
    </section>
  </div>;
}
