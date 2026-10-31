import mongoose from "mongoose";
import Task from "../models/Task.js";

const allowedStatuses = ["Pending", "In Progress", "Completed"];
const allowedPriorities = ["Low", "Medium", "High"];

function validatePayload(body, partial = false) {
  const errors = [];
  if (!partial || body.title !== undefined) {
    if (typeof body.title !== "string" || !body.title.trim()) errors.push("Title is required.");
    else if (body.title.trim().length > 120) errors.push("Title must be 120 characters or fewer.");
  }
  if (body.description !== undefined && String(body.description).length > 1000) errors.push("Description must be 1000 characters or fewer.");
  if (body.status !== undefined && !allowedStatuses.includes(body.status)) errors.push("Invalid status.");
  if (body.priority !== undefined && !allowedPriorities.includes(body.priority)) errors.push("Invalid priority.");
  if (body.dueDate !== undefined && body.dueDate !== null && body.dueDate !== "" && Number.isNaN(Date.parse(body.dueDate))) errors.push("Invalid due date.");
  return errors;
}

export async function listTasks(req, res, next) {
  try {
    const { search = "", status, priority, sort = "newest" } = req.query;
    const filter = {};
    if (status && allowedStatuses.includes(status)) filter.status = status;
    if (priority && allowedPriorities.includes(priority)) filter.priority = priority;
    if (search.trim()) {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [{ title: { $regex: escaped, $options: "i" } }, { description: { $regex: escaped, $options: "i" } }];
    }
    const sortMap = { newest: { createdAt: -1 }, oldest: { createdAt: 1 }, dueDate: { dueDate: 1, createdAt: -1 }, priority: { priority: -1, createdAt: -1 } };
    const tasks = await Task.find(filter).sort(sortMap[sort] || sortMap.newest).lean();
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) { next(error); }
}

export async function getTask(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid task ID." });
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found." });
    res.json({ success: true, data: task });
  } catch (error) { next(error); }
}

export async function createTask(req, res, next) {
  try {
    const errors = validatePayload(req.body);
    if (errors.length) return res.status(400).json({ success: false, message: errors[0], errors });
    const task = await Task.create({
      title: req.body.title.trim(), description: req.body.description || "",
      status: req.body.status || "Pending", priority: req.body.priority || "Medium",
      dueDate: req.body.dueDate || null
    });
    res.status(201).json({ success: true, message: "Task created.", data: task });
  } catch (error) { next(error); }
}

export async function updateTask(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid task ID." });
    const errors = validatePayload(req.body, true);
    if (errors.length) return res.status(400).json({ success: false, message: errors[0], errors });
    const payload = { ...req.body };
    if (payload.title !== undefined) payload.title = payload.title.trim();
    if (payload.dueDate === "") payload.dueDate = null;
    const task = await Task.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ success: false, message: "Task not found." });
    res.json({ success: true, message: "Task updated.", data: task });
  } catch (error) { next(error); }
}

export async function deleteTask(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid task ID." });
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found." });
    res.json({ success: true, message: "Task deleted." });
  } catch (error) { next(error); }
}
