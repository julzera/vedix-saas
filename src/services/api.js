import axios from 'axios';

const API_BASE = "https://api.limonixdigital.com"; // Sua VPS

export const api = axios.create({
  baseURL: API_BASE,
});

export default api;