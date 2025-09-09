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
    
    // Return user-specific service requests
    if (req.method === 'GET') {
      res.status(200).json([
        {
          id: 'demo-request-1',
          type: 'maintenance',
          description: 'Air conditioning not working',
          status: 'pending',
          priority: 'high',
          roomNumber: '101',
          customerName: 'John Doe',
          createdAt: new Date().toISOString(),
          hotelId: userData.hotelId
        }
      ]);
    } else if (req.method === 'POST') {
      res.status(201).json({
        id: 'demo-request-new',
        ...req.body,
        status: 'pending',
        createdAt: new Date().toISOString(),
        hotelId: 'demo-hotel'
      });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Service requests endpoint error:', error);
    res.status(500).json({
      message: 'Service requests service unavailable',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}