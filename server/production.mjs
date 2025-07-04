// Simple Node.js entry point for PM2
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use dynamic import for the server
async function startServer() {
  try {
    const { createServer } = await import('./index.js');
    const express = await import('express');
    
    const app = createServer();
    const port = process.env.PORT || 3001;

    // In production, serve the built SPA files if they exist
    const distPath = join(__dirname, "../dist/spa");
    
    // Check if SPA files exist and serve them
    try {
      app.use(express.default.static(distPath));
      
      // Handle React Router - serve index.html for all non-API routes
      app.get("*", (req, res) => {
        // Don't serve index.html for API routes
        if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
          return res.status(404).json({ error: "API endpoint not found" });
        }
        
        res.sendFile(join(distPath, "index.html"));
      });
    } catch (err) {
      console.log('SPA files not found, running API only mode');
    }

    app.listen(port, () => {
      console.log(`🚀 Orbit Trails API server running on port ${port}`);
      console.log(`🔧 API Health: http://localhost:${port}/health`);
      console.log(`📊 API Endpoints: http://localhost:${port}/api`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
