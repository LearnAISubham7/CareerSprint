import api from "./axios";

// create one-time task
export const createTaskApi = async (data) => {
  const res = await api.post("/tasks/", data);
  return res.data;
};

// ✅ get today tasks
export const getTodayTasksApi = async () => {
  const res = await api.get("/tasks/today");
  return res.data;
};

// ✅ toggle complete
export const toggleTaskCompleteApi = async (taskId) => {
  const res = await api.patch(`/tasks/${taskId}/toggle`);
  return res.data;
};

// ✅ timer start
export const startTaskTimerApi = async (taskId) => {
  const res = await api.post(`/tasks/${taskId}/start-timer`);
  return res.data;
};

// ✅ timer stop
export const stopTaskTimerApi = async (taskId) => {
  const res = await api.post(`/tasks/${taskId}/stop-timer`);
  return res.data;
};

// get history tasks by date range
export const getHistoryTasksApi = async ({ from, to, category }) => {
  const params = new URLSearchParams();

  if (from) params.append("from", from);
  if (to) params.append("to", to);
  if (category && category !== "ALL") params.append("category", category);

  const res = await api.get(`/tasks/history/range?${params.toString()}`);
  return res.data;
};

// update task
export const updateTaskApi = async (taskId, data) => {
  const res = await api.patch(`/tasks/${taskId}`, data);
  return res.data;
};

// delete task
export const deleteTaskApi = async (taskId) => {
  const res = await api.delete(`/tasks/${taskId}`);
  return res.data;
};
