
/**
 * Simulation of a MERN backend.
 * In a real project, these functions would perform fetch() requests 
 * to your Node.js/Express server (e.g., http://localhost:5000/api/suggestions).
 */

import { Suggestion, Category } from '../types';

const API_URL = '/api/suggestions';

const getAuthHeader = () => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    try {
      const { token } = JSON.parse(userInfo);
      return { 'Authorization': `Bearer ${token}` };
    } catch (e) {
      console.error('Error parsing userInfo:', e);
      return {};
    }
  }
  return {};
};

export const getSuggestions = async (): Promise<Suggestion[]> => {
  try {
    const response = await fetch(API_URL, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch suggestions');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
};

export const addSuggestion = async (name: string, category: Category, message: string): Promise<Suggestion> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ name, category, message }),
    });

    if (!response.ok) {
      throw new Error('Failed to add suggestion');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding suggestion:', error);
    throw error;
  }
};

export const deleteSuggestion = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete suggestion');
    }
  } catch (error) {
    console.error('Error deleting suggestion:', error);
    throw error;
  }
};
