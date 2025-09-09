import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle OPTIONS request for CORS
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
      res.status(405).json({ message: 'Method not allowed' });
      return;
    }

    const { username, password, email, hotelName, address, phone } = req.body;

    // For demo purposes, accept any valid registration
    // In production, implement proper validation, hashing, and database storage
    if (username && password && hotelName && username.length > 0 && password.length > 0) {
      const userData = {
        id: `user-${username}`,
        username: username,
        email: email || `${username}@hotel.com`,
        name: username.charAt(0).toUpperCase() + username.slice(1),
        hotelName: hotelName,
        hotelId: `hotel-${username}`
      };
      
      // Create a simple token (in production, use proper JWT)
      const token = Buffer.from(JSON.stringify(userData)).toString('base64');
      
      // Set cookie for authentication
      res.setHeader('Set-Cookie', `auth-token=${token}; HttpOnly; Path=/; Max-Age=604800`);
      
      res.status(201).json({
        message: 'Registration successful',
        user: userData,
        hotel: {
          id: `hotel-${username}`,
          name: hotelName,
          address: address || '123 Hotel Street',
          phone: phone || '+1-234-567-8900',
          email: email || `${username}@hotel.com`,
          ownerId: `user-${username}`
        },
        success: true
      });
    } else {
      res.status(400).json({ message: 'Email, password, and hotel name are required' });
    }

  } catch (error) {
    console.error('Register endpoint error:', error);
    res.status(500).json({
      message: 'Registration service unavailable',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}