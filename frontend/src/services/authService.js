import API from "./api";

export const loginUser = async (data) => {
  return API.post("/api/login", data);
};

export const logoutUser = async () => {
  return API.post("/api/logout");
};