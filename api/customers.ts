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

    // For demo purposes, return demo customers
    // In production, implement proper database operations
    if (req.method === 'GET') {
      res.status(200).json([
        {
          id: 'demo-customer-1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1-234-567-8901',
          roomNumber: '101',
          roomType: 'Standard Single',
          checkinTime: new Date().toISOString(),
          hotelId: 'demo-hotel'
        }
      ]);
    } else if (req.method === 'POST') {
      res.status(201).json({
        id: 'demo-customer-new',
        ...req.body,
        hotelId: 'demo-hotel'
      });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Customers endpoint error:', error);
    res.status(500).json({
      message: 'Customers service unavailable',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}