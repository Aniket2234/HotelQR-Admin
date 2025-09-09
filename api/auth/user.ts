import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
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

    // For demo purposes, return a demo user
    // In production, implement proper authentication
    res.status(200).json({
      id: 'demo-user',
      email: 'demo@hotel.com',
      name: 'Demo User'
    });

  } catch (error) {
    console.error('Auth endpoint error:', error);
    res.status(500).json({
      message: 'Authentication service unavailable',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}