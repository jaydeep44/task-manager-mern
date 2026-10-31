import axios from "axios";
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api", timeout: 10000 });
export const taskService = {
  list: params => api.get("/tasks", { params }).then(r => r.data.data),
  create: data => api.post("/tasks", data).then(r => r.data.data),
  update: (id, data) => api.put(`/tasks/${id}`, data).then(r => r.data.data),
  remove: id => api.delete(`/tasks/${id}`).then(r => r.data)
};
