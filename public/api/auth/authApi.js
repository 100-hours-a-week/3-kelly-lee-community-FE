import { api } from "/api/api.js";
import dotenv from 'dotenv';
dotenv.config();

const baseUrl = process.env.API_BASE_URL;
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