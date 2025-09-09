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

    const { email, password, hotelName, address, phone } = req.body;

    // For demo purposes, accept any registration
    // In production, implement proper validation and user creation
    if (email && password && hotelName) {
      res.status(201).json({
        message: 'Registration successful',
        user: {
          id: 'demo-user',
          email: email,
          name: 'Demo User'
        },
        hotel: {
          id: 'demo-hotel',
          name: hotelName,
          address: address || '123 Demo Street',
          phone: phone || '+1-234-567-8900',
          email: email,
          ownerId: 'demo-user'
        },
        token: 'demo-token-' + Date.now()
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