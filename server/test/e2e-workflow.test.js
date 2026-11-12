const http = require('http');

// Helper to make HTTP requests
const request = (options, postData = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
};

const runTestSuite = async () => {
  console.log('\n=============================================================');
  console.log(' STARTING FULL-STACK AUTOMATED VERIFICATION TEST SUITE');
  console.log('=============================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName, details = '') => {
    if (condition) {
      console.log(` ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(` ❌ FAIL: ${testName} ${details ? '(' + details + ')' : ''}`);
      failed++;
    }
  };

  try {
    // 1. Health check
    const health = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      method: 'GET',
    });
    assert(health.status === 200 && health.body.status === 'online', '1. Backend API Health Check');

    // 2. Customer Login
    const custLogin = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'alex.customer@example.com', password: 'Customer@123' }
    );
    assert(
      custLogin.status === 200 && custLogin.body.user?.role === 'customer',
      '2. Customer Authentication & Role Assignment'
    );
    const customerToken = custLogin.body.token;

    // 3. Admin Login
    const adminLogin = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'admin@autocare.com', password: 'Admin@123' }
    );
    assert(
      adminLogin.status === 200 && adminLogin.body.user?.role === 'admin',
      '3. Workshop Administrator Login'
    );
    const adminToken = adminLogin.body.token;

    // 4. Mechanic Login
    const mechLogin = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'marcus.mechanic@autocare.com', password: 'Mechanic@123' }
    );
    assert(
      mechLogin.status === 200 && mechLogin.body.user?.role === 'mechanic',
      '4. Lead Technician / Mechanic Login'
    );
    const mechanicToken = mechLogin.body.token;
    const mechanicId = mechLogin.body.user._id;

    // 5. Role-Based Access Control: Customer blocked from admin route
    const rbacTest = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/analytics/dashboard',
      method: 'GET',
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    assert(
      rbacTest.status === 403,
      '5. RBAC Protection: Customer denied access to /api/analytics/dashboard'
    );

    // 6. Register a new Customer Account
    const newEmail = `test.user.${Date.now()}@example.com`;
    const regRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        name: 'Automated Test Rider',
        email: newEmail,
        password: 'Password@123',
        phone: '+91 99999 88888',
      }
    );
    assert(
      regRes.status === 201 && regRes.body.success,
      '6. Customer Self-Registration & Immediate Token Issuance'
    );
    const newCustToken = regRes.body.token;

    // 7. Register Vehicle
    const regVehNum = `TS${Math.floor(10 + Math.random() * 89)}E${Math.floor(1000 + Math.random() * 8999)}`;
    const vehRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/vehicles',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newCustToken}`,
        },
      },
      {
        type: 'car',
        registrationNumber: regVehNum,
        brand: 'Volkswagen',
        model: 'Virtus GT',
        year: 2023,
        fuelType: 'Petrol',
        mileage: 18000,
      }
    );
    assert(vehRes.status === 201 && vehRes.body.vehicle?.brand === 'Volkswagen', '7. Vehicle Registration to Fleet');
    const newVehicleId = vehRes.body.vehicle._id;

    // 8. Fetch available services
    const servicesRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/services',
      method: 'GET',
    });
    assert(servicesRes.status === 200 && servicesRes.body.services.length > 0, '8. Services Catalog Retrieval');
    const chosenService = servicesRes.body.services[0];

    // 9. Book Service Appointment
    const testDate = '2026-11-20';
    const testSlot = '10:00 AM - 11:00 AM';
    const bookingRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/bookings',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newCustToken}`,
        },
      },
      {
        vehicleId: newVehicleId,
        serviceId: chosenService._id,
        bookingDate: testDate,
        timeSlot: testSlot,
        complaints: 'Automated test suite engine health audit check.',
      }
    );
    assert(
      bookingRes.status === 201 && bookingRes.body.booking?.status === 'Pending',
      '9. Service Booking Creation with Reference & Pending Status'
    );
    const newBookingId = bookingRes.body.booking._id;
    const newBookingRef = bookingRes.body.booking.bookingReference;

    // 10. Duplicate Booking Prevention
    const dupRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/bookings',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newCustToken}`,
        },
      },
      {
        vehicleId: newVehicleId,
        serviceId: chosenService._id,
        bookingDate: testDate,
        timeSlot: testSlot,
      }
    );
    assert(
      dupRes.status === 400 && dupRes.body.success === false,
      '10. Double Booking Conflict Prevention (Same vehicle, date, and slot rejected)'
    );

    // 11. Admin Booking Approval
    const approveRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: `/api/bookings/${newBookingId}/approval`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
      },
      { action: 'approve' }
    );
    assert(
      approveRes.status === 200 && approveRes.body.booking?.status === 'Confirmed',
      '11. Administrator Booking Confirmation & Approval'
    );

    // 12. Admin Mechanic Assignment
    const assignRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: `/api/bookings/${newBookingId}/assign-mechanic`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
      },
      { mechanicId: mechanicId }
    );
    assert(
      assignRes.status === 200 && assignRes.body.booking?.status === 'Mechanic Assigned',
      '12. Technician Bay Assignment & Notification Dispatch'
    );

    // 13. Mechanic Progress: In Progress & Diagnosis
    const progressRes1 = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: `/api/bookings/${newBookingId}/progress`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mechanicToken}`,
        },
      },
      {
        status: 'In Progress',
        diagnosis: 'Engine compression test nominal. Multi-system scan complete.',
        repairNotes: 'Cleaned intake throttle body and verified sensor outputs.',
      }
    );
    assert(
      progressRes1.status === 200 && progressRes1.body.booking?.status === 'In Progress',
      '13. Technician Work Commencement & Telemetry Progress Logging'
    );

    // 14. Mechanic Completion: Triggers Auto-Invoice & Maintenance Log
    const progressRes2 = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: `/api/bookings/${newBookingId}/progress`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mechanicToken}`,
        },
      },
      {
        status: 'Completed',
        diagnosis: 'Engine running at peak manufacturer tolerance.',
        repairNotes: 'Road tested for 5 km. All tests passed.',
      }
    );
    assert(
      progressRes2.status === 200 &&
        progressRes2.body.booking?.status === 'Completed' &&
        !!progressRes2.body.booking?.invoice,
      '14. Service Completion with Automatic Invoice Generation'
    );
    const invoiceId = progressRes2.body.booking.invoice._id || progressRes2.body.booking.invoice;

    // 15. Simulated Payment Processing
    const payRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/payments/process-simulated',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newCustToken}`,
        },
      },
      {
        invoiceId,
        paymentMethod: 'Credit/Debit Card',
        paymentDetails: { cardLast4: '4242' },
      }
    );
    assert(
      payRes.status === 200 && payRes.body.payment?.status === 'Successful',
      '15. Simulated Payment Gateway Processing & Receipt Settlement'
    );

    // 16. Verify Maintenance History Persistence
    const histRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/maintenance/my',
      method: 'GET',
      headers: { Authorization: `Bearer ${newCustToken}` },
    });
    assert(
      histRes.status === 200 && histRes.body.records.length > 0,
      '16. Automated Maintenance Record Persistence in Vehicle Logbook'
    );

    // 17. Verify Notifications Received
    const notifRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/notifications',
      method: 'GET',
      headers: { Authorization: `Bearer ${newCustToken}` },
    });
    assert(
      notifRes.status === 200 && notifRes.body.notifications.length >= 3,
      '17. Customer Lifecycle Notifications Generated (Booking, Progress, Payment)'
    );

    console.log('\n-------------------------------------------------------------');
    console.log(` TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
    console.log('-------------------------------------------------------------\n');

    if (failed === 0) {
      console.log(' 🎉 ALL 17 END-TO-END WORKFLOW INTEGRATION TESTS PASSED 100%!');
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
};

runTestSuite();
