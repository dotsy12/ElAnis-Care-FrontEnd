// src/api/reviews.ts
// Reviews API wrapper — lightweight and self-contained so components can import it directly.

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'https://elanis.runasp.net/api';

export interface Review {
  id: string;
  serviceRequestId: string;
  clientName: string;
  clientAvatar?: string | null;
  providerName?: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface ProviderReviewsResult {
  providerId: string;
  providerName: string;
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
}

export interface SubmitReviewPayload {
  serviceRequestId: string;
  rating: number; // 1..5
  comment?: string | null;
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('accessToken');
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

async function parseJSON(response: Response) {
  try {
    return await response.json();
  } catch (err) {
    return { succeeded: response.ok, data: null, message: 'Invalid JSON response' };
  }
}

export async function submitReview(payload: SubmitReviewPayload) {
  const url = `${BASE_URL}/Reviews`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
  };

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const body = await parseJSON(res);
  return body; // backend shaped response
}

export async function fetchProviderReviews(providerId: string) {
  const url = `${BASE_URL}/Reviews/provider/${providerId}`;
  const res = await fetch(url, { method: 'GET' });
  const body = await parseJSON(res);
  return body;
}

export async function fetchUserReviews() {
  const url = `${BASE_URL}/Reviews/user`;
  const headers = { ...getAuthHeaders() };
  const res = await fetch(url, { method: 'GET', headers });
  const body = await parseJSON(res);
  return body;
}

export async function fetchReviewByRequest(requestId: string) {
  const url = `${BASE_URL}/Reviews/request/${requestId}`;
  const headers = { ...getAuthHeaders() };
  const res = await fetch(url, { method: 'GET', headers });
  const body = await parseJSON(res);
  return body;
}

export default {
  submitReview,
  fetchProviderReviews,
  fetchUserReviews,
  fetchReviewByRequest,
};
