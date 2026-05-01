import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS_HEADERS, body: 'Method Not Allowed' };
  }

  try {
    const { id, status } = JSON.parse(event.body || '{}');

    if (!id || !status) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Missing id or status' }),
      };
    }

    const store = getStore({
      name: 'bookings',
      siteID: '3d1051ef-7ed2-4a76-9e93-e04ec67caf2c',
      token: 'nfp_FCYAPv7t5in4wNQp9V2ucGiSiRaaH9M2f723'
    });
    const existing = await store.get(id, { type: 'json' }) as any;

    if (!existing) {
      return {
        statusCode: 404,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Booking not found' }),
      };
    }

    const updated = { ...existing, status, updatedAt: new Date().toISOString() };
    await store.setJSON(id, updated);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: 'Booking updated', booking: updated }),
    };
  } catch (error: any) {
    console.error('Error updating booking:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
