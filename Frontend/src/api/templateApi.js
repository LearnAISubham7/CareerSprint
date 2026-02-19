import api from "./axios";

// create recurring template
export const createTemplateApi = async (data) => {
  const res = await api.post("/templates", data);
  return res.data;
};

// get templates
export const getTemplatesApi = async () => {
  const res = await api.get("/templates");
  return res.data;
};

export const toggleTemplateActiveApi = async (templateId) => {
  const res = await api.patch(`/templates/${templateId}/toggle-active`);
  return res.data;
};

// update template
export const updateTemplateApi = async (templateId, data) => {
  const res = await api.patch(`/templates/${templateId}`, data);
  return res.data;
};

// delete template
export const deleteTemplateApi = async (templateId) => {
  const res = await api.delete(`/templates/${templateId}`);
  return res.data;
};

export const deleteTemplateAdvancedApi = async (templateId, mode) => {
  // mode: "ONLY" | "FUTURE" | "ALL"
  let url = `/templates/${templateId}`;

  if (mode === "FUTURE") url += "?deleteFuture=true";
  if (mode === "ALL") url += "?deleteAll=true";

  const res = await api.delete(url);
  return res.data;
};
