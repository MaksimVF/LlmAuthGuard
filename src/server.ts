import express from 'express';
import { createServer } from 'http';
import app from './app';

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

const server = createServer(app);

server.listen(Number(PORT), HOST, () => {
  console.log(`🚀 Auth Service running on http://${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});
