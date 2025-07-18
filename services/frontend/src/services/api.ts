import axios from 'axios';
import { GeoResponse, Point } from '@/types/coordinatesDto';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_GATEWAY_URL,
});

export async function processPoints(points: Point[]): Promise<GeoResponse> {
  const response = await api.post<GeoResponse>('process', { points });
  return response.data;
}
