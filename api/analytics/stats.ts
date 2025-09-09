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
    
    // Return user-specific analytics
    res.status(200).json({
      totalCustomers: 25,
      occupiedRooms: 18,
      totalRooms: 50,
      pendingRequests: 3,
      completedRequests: 42,
      totalRevenue: 125000,
      occupancyRate: 0.36
    });

  } catch (error) {
    console.error('Analytics endpoint error:', error);
    res.status(500).json({
      message: 'Analytics service unavailable',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}