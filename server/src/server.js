const app = require('./app');
const { connectDB } = require('./config/db');
const { autoSeedIfEmpty } = require('./seed/seedData');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await autoSeedIfEmpty();

    const server = app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(` NeighbourShelf REST API Server Running`);
      console.log(` Port: ${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(` Health Check: http://localhost:${PORT}/api/health`);
      console.log(`===============================================`);
    });

    const shutdown = async () => {
      console.log('Shutting down NeighbourShelf server...');
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (err) {
    console.error('Fatal error starting server:', err);
    process.exit(1);
  }
};

startServer();
