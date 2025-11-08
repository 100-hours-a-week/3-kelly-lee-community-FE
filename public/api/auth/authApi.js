import { api } from "/api/api.js";

const baseUrl = window.__CONFIG__.API_BASE_URL;
const baseAuthUrl = baseUrl+"/auth";

export const authApi = {
  login: (data) =>
    api(baseAuthUrl, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: (id) =>
    api(`${baseAuthUrl}?memberId=${encodeURIComponent(id)}`, {
      method: "DELETE"
    }),

  refresh: (data) =>
    api(baseAuthUrl, {
      method: "PUT",
      body: JSON.stringify(data)
    }),
};