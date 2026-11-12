require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Initialize express app
const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Online Vehicle Service Booking & Maintenance Management System API',
    uptime: process.uptime(),
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/vehicles', require('./routes/vehicleRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/mechanics', require('./routes/mechanicRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/maintenance', require('./routes/maintenanceRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

let server;

// Connect Database and Start Server
connectDB()
  .then(async () => {
    // Auto-seed if database is empty
    try {
      const { runSeedInline } = require('./seed/inlineSeeder');
      await runSeedInline();
    } catch (seedErr) {
      console.warn('[Server] Auto-seed warning:', seedErr.message);
    }

    server = app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(` AutoCare Pro Backend Server Running on Port ${PORT}`);
      console.log(` Mode: ${process.env.NODE_ENV || 'development'}`);
      console.log(` Health: http://localhost:${PORT}/api/health`);
      console.log(`====================================================`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize server:', err.message);
    process.exit(1);
  });

module.exports = { app };
