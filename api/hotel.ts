import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle OPTIONS request for CORS
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    // For demo purposes, return a demo hotel
    // In production, implement proper database operations
    if (req.method === 'GET') {
      res.status(200).json({
        id: 'demo-hotel',
        name: 'Demo Hotel',
        address: '123 Demo Street',
        phone: '+1-234-567-8900',
        email: 'contact@demohotel.com',
        ownerId: 'demo-user'
      });
    } else if (req.method === 'POST') {
      res.status(201).json({
        id: 'demo-hotel',
        name: req.body.name || 'Demo Hotel',
        address: req.body.address || '123 Demo Street',
        phone: req.body.phone || '+1-234-567-8900',
        email: req.body.email || 'contact@demohotel.com',
        ownerId: 'demo-user'
      });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Hotel endpoint error:', error);
    res.status(500).json({
      message: 'Hotel service unavailable',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}