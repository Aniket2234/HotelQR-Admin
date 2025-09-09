import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { registerRoutes } from '../server/routes';
import '../server/db'; // Initialize database connection

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup routes
let server: any;
const initServer = async () => {
  if (!server) {
    server = await registerRoutes(app);
  }
  return server;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await initServer();
  
  // Convert Vercel request to Express format
  const expressReq = req as any;
  const expressRes = res as any;
  
  // Handle the request with Express app
  app(expressReq, expressRes);
}