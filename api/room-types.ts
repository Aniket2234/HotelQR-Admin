import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle OPTIONS request for CORS
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    // Check authentication first
    // For now, require login
    res.status(401).json({ message: "Authentication required" });
    return;
    
    // For demo purposes, return demo room types
    // In production, implement proper database operations
    if (req.method === 'GET') {
      res.status(200).json([
        {
          id: 'room-type-1',
          name: 'Standard Single',
          category: 'standard',
          price: 2500,
          available: 8,
          total: 10,
          hotelId: 'demo-hotel'
        },
        {
          id: 'room-type-2',
          name: 'Deluxe Double',
          category: 'deluxe',
          price: 4500,
          available: 5,
          total: 8,
          hotelId: 'demo-hotel'
        },
        {
          id: 'room-type-3',
          name: 'Executive Suite',
          category: 'suite',
          price: 8500,
          available: 2,
          total: 3,
          hotelId: 'demo-hotel'
        }
      ]);
    } else if (req.method === 'POST') {
      res.status(201).json({
        id: 'room-type-new',
        ...req.body,
        hotelId: 'demo-hotel'
      });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Room types endpoint error:', error);
    res.status(500).json({
      message: 'Room types service unavailable',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}