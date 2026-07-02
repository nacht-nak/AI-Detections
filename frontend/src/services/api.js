import axios from 'axios';

// Create a configured axios instance
// Uses environment variable VITE_API_URL, which should point to the FastAPI backend.
// Defaults to localhost:8000 for local development.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds (generous timeout for model cold starts/downloads)
});

/**
 * Send text to the backend API for AI detection.
 * @param {string} text - The input text (20-5000 characters).
 * @returns {Promise<Object>} The API response with detection metrics.
 */
export const analyzeText = async (text) => {
  try {
    const response = await api.post('/api/analyze', { text });
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. The AI server might be loading the model. Please try again.');
    }
    if (!error.response) {
      throw new Error('Unable to connect to AI server. Please check if the backend is running.');
    }
    throw new Error(error.response.data?.detail || 'An error occurred during analysis.');
  }
};

/**
 * Health check to verify if backend is online and model is loaded.
 * @returns {Promise<Object>} Health check status.
 */
export const checkHealth = async () => {
  try {
    const response = await api.get('/api/health');
    return response.data;
  } catch (error) {
    return { status: 'offline', model_loaded: false };
  }
};

export default api;
