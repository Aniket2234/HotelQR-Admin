import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle OPTIONS request for CORS
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    // Only allow GET requests
    if (req.method !== 'GET') {
      res.status(405).json({ message: 'Method not allowed' });
      return;
    }

    // For demo purposes, return demo available rooms
    // In production, implement proper database operations
    res.status(200).json({
      'room-type-1': ['101', '102', '103', '104', '105', '106', '107', '108'],
      'room-type-2': ['201', '202', '203', '204', '205'],
      'room-type-3': ['301', '302']
    });

  } catch (error) {
    console.error('Available rooms endpoint error:', error);
    res.status(500).json({
      message: 'Available rooms service unavailable',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}