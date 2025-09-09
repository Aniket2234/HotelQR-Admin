import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { storage } from '../server/storage';
import { insertHotelSchema, insertCustomerSchema, insertServiceRequestSchema, insertRoomTypeSchema, insertRoomSchema, insertAdminServiceSchema } from '@shared/types';
import { z } from 'zod';
import QRCode from 'qrcode';
import mongoose from 'mongoose';
import '../server/db'; // Initialize database connection

// Utility function to validate ObjectId
function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id) && (new mongoose.Types.ObjectId(id).toString() === id || id.length === 24);
}

// Create Express app for handling routes
const createApp = () => {
  const app = express();
  
  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Simple auth middleware for serverless (simplified for now)
  const isAuthenticated = (req: any, res: any, next: any) => {
    // For now, we'll bypass auth to get the basic functionality working
    // In production, you'd implement proper JWT or session-based auth
    req.user = { id: 'demo-user', claims: { sub: 'demo-user' } };
    next();
  };

  // Auth routes
  app.get('/api/auth/user', (req: any, res) => {
    // For demo purposes, return a demo user
    // In production, implement proper authentication
    res.json({ id: 'demo-user', email: 'demo@hotel.com', name: 'Demo User' });
  });

  // Hotel routes
  app.get('/api/hotel', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id || req.user.claims?.sub;
      const hotel = await storage.getUserHotel(userId);
      res.json(hotel);
    } catch (error) {
      console.error("Error fetching hotel:", error);
      res.status(500).json({ message: "Failed to fetch hotel" });
    }
  });

  app.post('/api/hotel', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id || req.user.claims?.sub;
      const hotelData = insertHotelSchema.parse({ ...req.body, ownerId: userId });
      const hotel = await storage.createHotel(hotelData);
      res.json(hotel);
    } catch (error) {
      console.error("Error creating hotel:", error);
      res.status(400).json({ message: "Failed to create hotel" });
    }
  });

  // Customer routes
  app.get('/api/customers', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id || req.user.claims?.sub;
      const hotel = await storage.getUserHotel(userId);
      
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      const customers = await storage.getCustomers(hotel.id);
      res.json(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  // Service request routes
  app.get('/api/service-requests', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id || req.user.claims?.sub;
      const hotel = await storage.getUserHotel(userId);
      
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      const serviceRequests = await storage.getServiceRequests(hotel.id);
      res.json(serviceRequests);
    } catch (error) {
      console.error("Error fetching service requests:", error);
      res.status(500).json({ message: "Failed to fetch service requests" });
    }
  });

  // Analytics routes
  app.get('/api/analytics/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id || req.user.claims?.sub;
      const hotel = await storage.getUserHotel(userId);
      
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      const stats = await storage.getHotelStats(hotel.id);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  return app;
};

let app: express.Express;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Initialize app if not already done
    if (!app) {
      app = createApp();
    }

    // Handle the request
    app(req as any, res as any);
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}