import api from "./axios";

export const loginApi = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const registerApi = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const meApi = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const logoutApi = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};
