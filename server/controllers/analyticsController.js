const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const Invoice = require('../models/Invoice');
const SparePart = require('../models/SparePart');
const Mechanic = require('../models/Mechanic');

// @desc    Get comprehensive admin overview metrics & chart data
// @route   GET /api/analytics/dashboard
// @access  Private (Admin)
const getAdminDashboardStats = async (req, res, next) => {
  try {
    // 1. Primary counts
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalVehicles = await Vehicle.countDocuments({ isActive: true });
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'Pending' });
    const inProgressBookings = await Booking.countDocuments({
      status: { $in: ['Mechanic Assigned', 'In Progress', 'Waiting for Parts'] },
    });
    const completedServices = await Booking.countDocuments({ status: 'Completed' });
    const totalMechanics = await Mechanic.countDocuments();

    // 2. Financial Metrics
    const paidInvoices = await Invoice.find({ paymentStatus: 'Paid' });
    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

    const pendingInvoices = await Invoice.find({ paymentStatus: 'Unpaid' });
    const pendingRevenue = pendingInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

    // 3. Status breakdown
    const statusCounts = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const statusMap = {
      Pending: 0,
      Confirmed: 0,
      'Mechanic Assigned': 0,
      'In Progress': 0,
      'Waiting for Parts': 0,
      Completed: 0,
      Cancelled: 0,
      Rejected: 0,
    };
    statusCounts.forEach((item) => {
      if (statusMap[item._id] !== undefined) {
        statusMap[item._id] = item.count;
      }
    });

    const statusChartData = Object.keys(statusMap).map((key) => ({
      name: key,
      value: statusMap[key],
    }));

    // 4. Monthly Revenue Trend (for Recharts)
    // Group paid invoices by month name
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyRevenueMap = {};
    months.forEach((m) => {
      monthlyRevenueMap[m] = 0;
    });

    paidInvoices.forEach((inv) => {
      const date = inv.paidAt || inv.issueDate || inv.createdAt;
      const monthIndex = new Date(date).getMonth();
      const monthName = months[monthIndex];
      monthlyRevenueMap[monthName] += inv.totalAmount;
    });

    // Provide last 6 months progression
    const currentMonthIndex = new Date().getMonth();
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const idx = (currentMonthIndex - i + 12) % 12;
      const mName = months[idx];
      last6Months.push({
        month: mName,
        revenue: monthlyRevenueMap[mName] || 0,
        bookings: 0, // will calculate below
      });
    }

    const allBookings = await Booking.find();
    allBookings.forEach((b) => {
      const bDate = b.createdAt;
      const mIdx = new Date(bDate).getMonth();
      const mName = months[mIdx];
      const found = last6Months.find((item) => item.month === mName);
      if (found) {
        found.bookings += 1;
      }
    });

    // 5. Popular services
    const serviceDistribution = await Booking.aggregate([
      {
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'serviceDetails',
        },
      },
      { $unwind: '$serviceDetails' },
      {
        $group: {
          _id: '$serviceDetails.name',
          category: { $first: '$serviceDetails.category' },
          count: { $sum: 1 },
          revenue: { $sum: '$totalCost' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // 6. Inventory highlights
    const totalPartsCount = await SparePart.countDocuments({ isActive: true });
    const lowStockPartsCount = await SparePart.countDocuments({
      isActive: true,
      $expr: { $lte: ['$stockQuantity', '$minThreshold'] },
    });

    // 7. Recent bookings
    const recentBookings = await Booking.find()
      .populate('customer', 'name email phone')
      .populate('vehicle')
      .populate('service')
      .populate('assignedMechanic', 'name')
      .sort('-createdAt')
      .limit(6);

    res.status(200).json({
      success: true,
      overview: {
        totalCustomers,
        totalVehicles,
        totalBookings,
        pendingBookings,
        inProgressBookings,
        completedServices,
        totalMechanics,
        totalRevenue,
        pendingRevenue,
        totalPartsCount,
        lowStockPartsCount,
      },
      charts: {
        monthlyTrend: last6Months,
        statusBreakdown: statusChartData,
        topServices: serviceDistribution,
      },
      recentBookings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboardStats,
};
