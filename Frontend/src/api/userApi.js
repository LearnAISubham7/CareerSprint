import axios from "./axios";

export const getActivityApi = async () => {
  const res = await axios.get("/users/activity");
  return res.data;
};
