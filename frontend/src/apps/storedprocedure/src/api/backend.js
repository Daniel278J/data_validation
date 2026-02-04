import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_URL;

const BASE_URL = `${API_BASE_URL}/stored`; // Backend URL

export const translateProcedure = async (data) => {
  const response = await axios.post(`${BASE_URL}/translate`, data);
  return response.data;
};

export const validateConnection = async (data) => {
  const response = await axios.post(`${BASE_URL}/validate_connection`, data);
  return response.data;
};

export const validateProcedure = async (data) => {
  const response = await axios.post(`${BASE_URL}/validate_sp`, data);
  return response.data;
}