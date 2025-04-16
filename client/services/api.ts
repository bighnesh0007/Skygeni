// src/services/api.ts

import axios from 'axios';
import { FunnelData } from '@/types/index';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const fetchFunnelData = async (): Promise<FunnelData> => {
  try {
    const response = await axios.get(`${API_URL}/api/funnel-data`);
    return response.data;
  } catch (error) {
    console.error('Error fetching funnel data:', error);
    throw error;
  }
};