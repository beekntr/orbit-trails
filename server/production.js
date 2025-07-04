import { createServer } from "./index.js";

const app = createServer();
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`🚀 Orbit Trails API server running on port ${port}`);
  console.log(`🔧 API Health: http://localhost:${port}/health`);
  console.log(`📊 API Endpoints: http://localhost:${port}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
