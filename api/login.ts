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

    const { email, password } = req.body;

    // For demo purposes, accept any credentials
    // In production, implement proper authentication
    if (email && password) {
      res.status(200).json({
        message: 'Login successful',
        user: {
          id: 'demo-user',
          email: email,
          name: 'Demo User'
        },
        token: 'demo-token-' + Date.now()
      });
    } else {
      res.status(400).json({ message: 'Email and password required' });
    }

  } catch (error) {
    console.error('Login endpoint error:', error);
    res.status(500).json({
      message: 'Login service unavailable',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}