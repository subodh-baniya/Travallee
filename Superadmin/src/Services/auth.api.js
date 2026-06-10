import { authClient } from "./httpclient/auth.client";

export const getProfileApi = async () => {
  const response = await authClient.get("/profile");
  return response.data;
};

export const loginApi = async (payload) => {
  const response = await authClient.post("/login", payload);
  return response.data;
};

export const logoutApi = async () => {
  const response = await authClient.post("/logout", {});
  return response.data;
};
