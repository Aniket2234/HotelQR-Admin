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

    // Check for authentication token
    const cookies = req.headers.cookie;
    const authToken = cookies?.split(';').find(c => c.trim().startsWith('auth-token='))?.split('=')[1];
    
    if (!authToken) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }
    
    let userData;
    try {
      userData = JSON.parse(Buffer.from(authToken, 'base64').toString());
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }
    
    // Return user-specific customer data
    if (req.method === 'GET') {
      res.status(200).json([
        {
          id: 'demo-customer-1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1-234-567-8901',
          roomNumber: '101',
          roomType: 'Standard Single',
          roomTypeName: 'Standard Single',
          roomPrice: 2500,
          checkinTime: new Date().toISOString(),
          isActive: true,
          expectedStayDays: 3,
          hotelId: userData.hotelId
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