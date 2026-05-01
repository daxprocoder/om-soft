import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: CORS_HEADERS, body: 'Method Not Allowed' };
  }

  try {
    const store = getStore({
      name: 'bookings',
      siteID: '3d1051ef-7ed2-4a76-9e93-e04ec67caf2c',
      token: 'nfp_FCYAPv7t5in4wNQp9V2ucGiSiRaaH9M2f723'
    });
    const { blobs } = await store.list();

    const bookings = await Promise.all(
      blobs.map(async (blob) => {
        try {
          const data = await store.get(blob.key, { type: 'json' });
          return data;
        } catch {
          return null;
        }
      })
    );

    // Filter out nulls and sort by date (newest first)
    const validBookings = bookings
      .filter(Boolean)
      .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(validBookings),
    };
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
