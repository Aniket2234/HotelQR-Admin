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

    // For demo purposes, return demo rooms
    // In production, implement proper database operations
    if (req.method === 'GET') {
      res.status(200).json([
        {
          id: 'room-1',
          roomNumber: '101',
          roomType: 'Standard Single',
          isOccupied: true,
          hotelId: 'demo-hotel',
          qrCode: 'qr-code-data-101'
        },
        {
          id: 'room-2',
          roomNumber: '102',
          roomType: 'Standard Single',
          isOccupied: false,
          hotelId: 'demo-hotel',
          qrCode: 'qr-code-data-102'
        },
        {
          id: 'room-3',
          roomNumber: '201',
          roomType: 'Deluxe Double',
          isOccupied: true,
          hotelId: 'demo-hotel',
          qrCode: 'qr-code-data-201'
        }
      ]);
    } else if (req.method === 'POST') {
      res.status(201).json({
        id: 'room-new',
        ...req.body,
        hotelId: 'demo-hotel'
      });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Rooms endpoint error:', error);
    res.status(500).json({
      message: 'Rooms service unavailable',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}