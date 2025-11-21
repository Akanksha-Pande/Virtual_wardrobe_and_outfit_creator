import axios from "axios";

// Base URL for backend API (change this when Spring Boot backend is ready)
const API_BASE_URL = "http://localhost:8080/api"; 

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth APIs
export const loginUser = (email: string, password: string) =>
  api.post("/auth/login", { email, password }).then(r => r.data);

export const signupUser = (name: string, email: string, password: string) => 
  api.post("/auth/signup", { username: name, email, password }).then(r => r.data);

// Images (multipart)
export const uploadImage = (file: File) => {
  const form = new FormData();
  form.append("file", file);
  return axios.post(`${API_BASE_URL}/images/upload`, form, {
    headers: { "Content-Type": "multipart/form-data" }
  }).then(r => r.data);
};

// Clothing
export const addClothingItem = (payload: any) =>
  api.post("/clothing", payload).then(r => r.data);

export const getUserClothing = (userId: string) =>
  api.get(`/clothing/user/${userId}`).then(r => r.data);

export const deleteClothingItem = (id: string) =>
  api.delete(`/clothing/${id}`).then(r => r.data);

// Outfits
export const createOutfit = (payload: any) =>
  api.post("/outfits", payload).then(r => r.data);

export const getUserOutfits = (userId: string) =>
  api.get(`/outfits/user/${userId}`).then(r => r.data);

// AI Suggestion
export const getAISuggestion = (userId: string) =>
  api.get(`/ai/suggest-outfit/${userId}`).then(r => r.data);

export default api;