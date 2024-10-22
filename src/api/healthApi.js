import axios from 'axios';
import { API_BASE_URL } from '@env';

export const saveHealthData = async (userId, healthData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/save`, { userId, ...healthData });
    return response;
  } catch (error) {
    console.error('Error saving data:', error);
    throw error;
  }
};

export const fetchWeeklyData = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${userId}/week`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weekly data:', error);
    throw error;
  }
};

export const deleteHealthData = async (userId, date) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${userId}/${date}`);
    return response; 
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  }
};

export const updateHealthData = async (userId, healthData) => {
  try {
      const response = await axios.put(`${API_BASE_URL}/update`, {
          userId,
          ...healthData
      });
      return response.data;
  } catch (error) {
      console.error('Error updating health data:', error.response ? error.response.data : error.message);
      throw error;
  }
};
