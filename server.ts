import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import apiRoutes from './server/routes/apiRoutes';
import { authMiddleware, errorHandler } from './server/middleware/authMiddleware';

dotenv.config();

const app = express();
const PORT = 3000;

// Parsers & Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(authMiddleware);

// Mount modular REST API routes
app.use('/api', apiRoutes);

// Error handling middleware
app.use(errorHandler);

// Vite & Static Asset Handling
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[VendraX Enterprise Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
