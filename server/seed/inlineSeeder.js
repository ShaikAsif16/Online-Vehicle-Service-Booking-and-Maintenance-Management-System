const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Service = require('../models/Service');
const Mechanic = require('../models/Mechanic');
const SparePart = require('../models/SparePart');
const Booking = require('../models/Booking');
const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');
const ServiceRecord = require('../models/ServiceRecord');
const Notification = require('../models/Notification');

const { seedUsers, seedServices, seedSpareParts } = require('./seedData');

const runSeedInline = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('[Auto-Seed] Database already contains records. Skipping seed.');
      return;
    }

    console.log('[Auto-Seed] Database is empty. Seeding initial accounts and catalog...');

    const createdUsers = [];
    for (const userData of seedUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }

    const admin = createdUsers.find((u) => u.role === 'admin');
    const mechanics = createdUsers.filter((u) => u.role === 'mechanic');
    const [marcus, elena, rajesh] = mechanics;
    const customers = createdUsers.filter((u) => u.role === 'customer');
    const [alex, priya, david] = customers;

    await Mechanic.create([
      {
        user: marcus._id,
        specialization: ['Engine & Transmission', 'General Maintenance'],
        experienceYears: 8,
        status: 'available',
        currentWorkload: 1,
        rating: 4.9,
        certifications: ['Master Automotive Technician (ASE-A1)', 'Bosch High Pressure Injection Specialist'],
      },
      {
        user: elena._id,
        specialization: ['Electrical & Diagnostics', 'AC & Climate Control'],
        experienceYears: 6,
        status: 'available',
        currentWorkload: 1,
        rating: 4.8,
        certifications: ['Automotive CAN-Bus Diagnostics Expert', 'Section 609 EPA Refrigerant License'],
      },
      {
        user: rajesh._id,
        specialization: ['Brakes & Suspension', 'Tires & Wheels'],
        experienceYears: 7,
        status: 'available',
        currentWorkload: 0,
        rating: 4.9,
        certifications: ['Advanced Chassis Alignment Certified', 'Brembo Brake Systems Tech'],
      },
    ]);

    const createdServices = await Service.insertMany(seedServices);
    const createdParts = await SparePart.insertMany(seedSpareParts);

    const vehicles = await Vehicle.insertMany([
      {
        owner: alex._id,
        type: 'car',
        registrationNumber: 'TS09EA1024',
        brand: 'Honda',
        model: 'Civic ZX',
        year: 2021,
        fuelType: 'Petrol',
        mileage: 38400,
        color: 'Meteoroid Grey Metallic',
        notes: 'Regular synthetic oil service history.',
      },
      {
        owner: alex._id,
        type: 'motorcycle',
        registrationNumber: 'TS09FX8899',
        brand: 'Yamaha',
        model: 'YZF-R15 V4',
        year: 2023,
        fuelType: 'Petrol',
        mileage: 9200,
        color: 'Racing Blue',
        notes: 'Slight clutch play detected at cold start.',
      },
      {
        owner: priya._id,
        type: 'scooter',
        registrationNumber: 'TS07HK4455',
        brand: 'TVS',
        model: 'Jupiter 125',
        year: 2022,
        fuelType: 'Petrol',
        mileage: 14500,
        color: 'Pristine White',
        notes: 'Front drum brake squeak.',
      },
      {
        owner: priya._id,
        type: 'car',
        registrationNumber: 'TS08MC7711',
        brand: 'Hyundai',
        model: 'Creta SX(O)',
        year: 2022,
        fuelType: 'Diesel',
        mileage: 26800,
        color: 'Phantom Black',
        notes: 'AC cooling efficiency check requested.',
      },
      {
        owner: david._id,
        type: 'car',
        registrationNumber: 'TS10BK9900',
        brand: 'BMW',
        model: '330i M Sport',
        year: 2022,
        fuelType: 'Petrol',
        mileage: 21500,
        color: 'Portimao Blue',
        notes: 'Performance check & brake inspection.',
      },
    ]);

    const [alexCar, alexMoto, priyaScooter, priyaCar, davidCar] = vehicles;

    // Completed Booking with PAID invoice
    const generalService = createdServices.find((s) => s.category === 'General Maintenance');
    const oilPart = createdParts.find((p) => p.partNumber === 'OIL-SYN-5W40-4L');
    const filterPart = createdParts.find((p) => p.partNumber === 'FLT-OIL-OEM-01');

    const completedBooking = await Booking.create({
      bookingReference: 'BK-20261101-1001',
      customer: alex._id,
      vehicle: alexCar._id,
      service: generalService._id,
      bookingDate: '2026-11-01',
      timeSlot: '09:00 AM - 10:00 AM',
      complaints: 'Routine 40,000 km periodic service and oil change.',
      additionalInstructions: 'Please check battery terminal health and tire pressures.',
      status: 'Completed',
      assignedMechanic: marcus._id,
      estimatedCost: generalService.basePrice,
      laborCost: 2999,
      partsCost: oilPart.sellingPrice + filterPart.sellingPrice,
      totalCost: 2999 + oilPart.sellingPrice + filterPart.sellingPrice,
      diagnosis: 'Vehicle in good running condition. Engine oil degradation noted as expected at 10k interval.',
      repairNotes: 'Drained engine oil, replaced oil filter, replenished 4L Castrol 5W-40. Cleaned air filter and topped brake fluid.',
      partsUsed: [
        { part: oilPart._id, partName: oilPart.name, partNumber: oilPart.partNumber, quantity: 1, unitPrice: oilPart.sellingPrice, totalPrice: oilPart.sellingPrice },
        { part: filterPart._id, partName: filterPart.name, partNumber: filterPart.partNumber, quantity: 1, unitPrice: filterPart.sellingPrice, totalPrice: filterPart.sellingPrice },
      ],
      actualCompletionDate: new Date('2026-11-01T12:30:00Z'),
      statusHistory: [
        { status: 'Pending', changedAt: new Date('2026-10-31T09:00:00Z'), changedBy: alex._id, note: 'Initial booking request' },
        { status: 'Confirmed', changedAt: new Date('2026-10-31T10:00:00Z'), changedBy: admin._id, note: 'Approved by workshop' },
        { status: 'Mechanic Assigned', changedAt: new Date('2026-10-31T11:00:00Z'), changedBy: admin._id, note: 'Assigned to Marcus' },
        { status: 'In Progress', changedAt: new Date('2026-11-01T09:15:00Z'), changedBy: marcus._id, note: 'Work commenced' },
        { status: 'Completed', changedAt: new Date('2026-11-01T12:30:00Z'), changedBy: marcus._id, note: 'All tasks completed & road-tested' },
      ],
    });

    const subtotal1 = completedBooking.laborCost + completedBooking.partsCost;
    const tax1 = Math.round(subtotal1 * 0.18);
    const total1 = subtotal1 + tax1;

    const paidInvoice = await Invoice.create({
      invoiceNumber: 'INV-202611-1001',
      booking: completedBooking._id,
      customer: alex._id,
      vehicle: alexCar._id,
      issueDate: new Date('2026-11-01T12:35:00Z'),
      items: [
        { description: `Labor: ${generalService.name}`, quantity: 1, unitPrice: completedBooking.laborCost, amount: completedBooking.laborCost, type: 'labor' },
        { description: `Part: ${oilPart.name}`, quantity: 1, unitPrice: oilPart.sellingPrice, amount: oilPart.sellingPrice, type: 'part' },
        { description: `Part: ${filterPart.name}`, quantity: 1, unitPrice: filterPart.sellingPrice, amount: filterPart.sellingPrice, type: 'part' },
      ],
      subtotal: subtotal1,
      taxRate: 18,
      taxAmount: tax1,
      totalAmount: total1,
      paymentStatus: 'Paid',
      paymentMethod: 'Simulated Gateway',
      paidAt: new Date('2026-11-01T13:00:00Z'),
    });

    completedBooking.invoice = paidInvoice._id;
    await completedBooking.save();

    await Payment.create({
      transactionId: 'TXN-SIM-20261101-7891',
      invoice: paidInvoice._id,
      booking: completedBooking._id,
      customer: alex._id,
      amount: total1,
      currency: 'INR',
      paymentMethod: 'Simulated Gateway',
      status: 'Successful',
      gatewayDetails: {
        gatewayName: 'Simulated Sandbox Gateway (Academic Evaluation Mode)',
        simulatedAuthCode: 'SIM-AUTH-9092KA',
        cardLast4: '4242',
      },
      paidAt: new Date('2026-11-01T13:00:00Z'),
    });

    await ServiceRecord.create({
      vehicle: alexCar._id,
      booking: completedBooking._id,
      customer: alex._id,
      mechanic: marcus._id,
      serviceName: generalService.name,
      serviceDate: new Date('2026-11-01T12:30:00Z'),
      mileageAtService: 38400,
      diagnosis: completedBooking.diagnosis,
      repairNotes: completedBooking.repairNotes,
      partsReplaced: [
        { partName: oilPart.name, partNumber: oilPart.partNumber, quantity: 1, price: oilPart.sellingPrice },
        { partName: filterPart.name, partNumber: filterPart.partNumber, quantity: 1, price: filterPart.sellingPrice },
      ],
      laborCost: completedBooking.laborCost,
      partsCost: completedBooking.partsCost,
      totalAmount: total1,
      nextServiceRecommendedDate: new Date('2026-05-01'),
      nextServiceMileage: 48400,
    });

    // Completed Booking with UNPAID invoice
    const acService = createdServices.find((s) => s.category === 'AC & Climate Control');
    const acGas = createdParts.find((p) => p.partNumber === 'GAS-R134A-1KG');
    const cabinFilter = createdParts.find((p) => p.partNumber === 'FLT-CAB-HEPA-02');

    const completedUnpaidBooking = await Booking.create({
      bookingReference: 'BK-20261108-2042',
      customer: priya._id,
      vehicle: priyaCar._id,
      service: acService._id,
      bookingDate: '2026-11-08',
      timeSlot: '11:00 AM - 12:00 PM',
      complaints: 'Air conditioner takes too long to cool cabin in afternoons.',
      status: 'Completed',
      assignedMechanic: elena._id,
      estimatedCost: acService.basePrice,
      laborCost: acService.basePrice,
      partsCost: acGas.sellingPrice + cabinFilter.sellingPrice,
      totalCost: acService.basePrice + acGas.sellingPrice + cabinFilter.sellingPrice,
      diagnosis: 'Refrigerant pressure low (24 psi). Cabin filter clogged with road dust.',
      repairNotes: 'Vacuum tested system for micro leaks (passed). Recharged 1kg R134a refrigerant and installed new active carbon cabin filter.',
      partsUsed: [
        { part: acGas._id, partName: acGas.name, partNumber: acGas.partNumber, quantity: 1, unitPrice: acGas.sellingPrice, totalPrice: acGas.sellingPrice },
        { part: cabinFilter._id, partName: cabinFilter.name, partNumber: cabinFilter.partNumber, quantity: 1, unitPrice: cabinFilter.sellingPrice, totalPrice: cabinFilter.sellingPrice },
      ],
      actualCompletionDate: new Date('2026-11-08T13:45:00Z'),
      statusHistory: [
        { status: 'Pending', changedAt: new Date('2026-11-07T14:00:00Z'), changedBy: priya._id, note: 'Booked online' },
        { status: 'Confirmed', changedAt: new Date('2026-11-07T15:00:00Z'), changedBy: admin._id, note: 'Confirmed by manager' },
        { status: 'Mechanic Assigned', changedAt: new Date('2026-11-07T16:00:00Z'), changedBy: admin._id, note: 'Assigned to Elena' },
        { status: 'In Progress', changedAt: new Date('2026-11-08T11:10:00Z'), changedBy: elena._id, note: 'Vacuum & diagnostics started' },
        { status: 'Completed', changedAt: new Date('2026-11-08T13:45:00Z'), changedBy: elena._id, note: 'Service complete & cabin sanitized' },
      ],
    });

    const subtotal2 = completedUnpaidBooking.laborCost + completedUnpaidBooking.partsCost;
    const tax2 = Math.round(subtotal2 * 0.18);
    const total2 = subtotal2 + tax2;

    const unpaidInvoice = await Invoice.create({
      invoiceNumber: 'INV-202611-2042',
      booking: completedUnpaidBooking._id,
      customer: priya._id,
      vehicle: priyaCar._id,
      issueDate: new Date('2026-11-08T13:50:00Z'),
      items: [
        { description: `Labor: ${acService.name}`, quantity: 1, unitPrice: completedUnpaidBooking.laborCost, amount: completedUnpaidBooking.laborCost, type: 'labor' },
        { description: `Part: ${acGas.name}`, quantity: 1, unitPrice: acGas.sellingPrice, amount: acGas.sellingPrice, type: 'part' },
        { description: `Part: ${cabinFilter.name}`, quantity: 1, unitPrice: cabinFilter.sellingPrice, amount: cabinFilter.sellingPrice, type: 'part' },
      ],
      subtotal: subtotal2,
      taxRate: 18,
      taxAmount: tax2,
      totalAmount: total2,
      paymentStatus: 'Unpaid',
      paymentMethod: 'None',
    });

    completedUnpaidBooking.invoice = unpaidInvoice._id;
    await completedUnpaidBooking.save();

    await ServiceRecord.create({
      vehicle: priyaCar._id,
      booking: completedUnpaidBooking._id,
      customer: priya._id,
      mechanic: elena._id,
      serviceName: acService.name,
      serviceDate: new Date('2026-11-08T13:45:00Z'),
      mileageAtService: 26800,
      diagnosis: completedUnpaidBooking.diagnosis,
      repairNotes: completedUnpaidBooking.repairNotes,
      partsReplaced: [
        { partName: acGas.name, partNumber: acGas.partNumber, quantity: 1, price: acGas.sellingPrice },
        { partName: cabinFilter.name, partNumber: cabinFilter.partNumber, quantity: 1, price: cabinFilter.sellingPrice },
      ],
      laborCost: completedUnpaidBooking.laborCost,
      partsCost: completedUnpaidBooking.partsCost,
      totalAmount: total2,
      nextServiceRecommendedDate: new Date('2027-05-08'),
      nextServiceMileage: 36800,
    });

    // In Progress
    const brakeService = createdServices.find((s) => s.category === 'Brakes & Suspension');
    const brakePadPart = createdParts.find((p) => p.partNumber === 'BRK-PAD-CER-FR');

    await Booking.create({
      bookingReference: 'BK-20261111-3011',
      customer: david._id,
      vehicle: davidCar._id,
      service: brakeService._id,
      bookingDate: '2026-11-12',
      timeSlot: '02:00 PM - 03:00 PM',
      complaints: 'High speed brake vibration and squeaking sound from front wheels.',
      additionalInstructions: 'Check brake disc rotor thickness.',
      status: 'In Progress',
      assignedMechanic: marcus._id,
      estimatedCost: brakeService.basePrice,
      laborCost: brakeService.basePrice,
      partsCost: brakePadPart.sellingPrice,
      totalCost: brakeService.basePrice + brakePadPart.sellingPrice,
      diagnosis: 'Front brake pads worn down to 2.5mm. Left disc rotor has light lateral runout.',
      repairNotes: 'Mounted vehicle on bay 1 lift. Dismantling caliper assembly and preparing disc surface.',
      partsUsed: [
        { part: brakePadPart._id, partName: brakePadPart.name, partNumber: brakePadPart.partNumber, quantity: 1, unitPrice: brakePadPart.sellingPrice, totalPrice: brakePadPart.sellingPrice },
      ],
      estimatedCompletionDate: new Date(+new Date() + 3 * 60 * 60 * 1000),
      statusHistory: [
        { status: 'Pending', changedAt: new Date('2026-11-10T11:00:00Z'), changedBy: david._id, note: 'Booked online' },
        { status: 'Confirmed', changedAt: new Date('2026-11-10T12:00:00Z'), changedBy: admin._id, note: 'Confirmed by workshop manager' },
        { status: 'Mechanic Assigned', changedAt: new Date('2026-11-11T09:00:00Z'), changedBy: admin._id, note: 'Assigned to Marcus Vance' },
        { status: 'In Progress', changedAt: new Date('2026-11-12T08:00:00Z'), changedBy: marcus._id, note: 'Work commenced in Bay 1' },
      ],
    });

    // Mechanic Assigned
    const ecuService = createdServices.find((s) => s.category === 'Electrical & Diagnostics');
    await Booking.create({
      bookingReference: 'BK-20261112-4022',
      customer: alex._id,
      vehicle: alexMoto._id,
      service: ecuService._id,
      bookingDate: '2026-11-12',
      timeSlot: '03:00 PM - 04:00 PM',
      complaints: 'Check engine light blinking occasionally above 7000 RPM.',
      status: 'Mechanic Assigned',
      assignedMechanic: elena._id,
      estimatedCost: ecuService.basePrice,
      laborCost: ecuService.basePrice,
      totalCost: ecuService.basePrice,
      statusHistory: [
        { status: 'Pending', changedAt: new Date('2026-11-11T08:00:00Z'), changedBy: alex._id, note: 'Customer appointment created' },
        { status: 'Confirmed', changedAt: new Date('2026-11-11T10:00:00Z'), changedBy: admin._id, note: 'Approved by admin' },
        { status: 'Mechanic Assigned', changedAt: new Date('2026-11-11T11:00:00Z'), changedBy: admin._id, note: 'Assigned to Elena Rostova' },
      ],
    });

    // Confirmed
    const alignService = createdServices.find((s) => s.category === 'Tires & Wheels');
    await Booking.create({
      bookingReference: 'BK-20261113-5033',
      customer: priya._id,
      vehicle: priyaScooter._id,
      service: alignService._id,
      bookingDate: '2026-11-13',
      timeSlot: '10:00 AM - 11:00 AM',
      complaints: 'Handle pulls slightly towards left side when accelerating.',
      status: 'Confirmed',
      estimatedCost: alignService.basePrice,
      laborCost: alignService.basePrice,
      totalCost: alignService.basePrice,
      statusHistory: [
        { status: 'Pending', changedAt: new Date('2026-11-11T15:00:00Z'), changedBy: priya._id, note: 'Customer appointment requested' },
        { status: 'Confirmed', changedAt: new Date('2026-11-11T16:30:00Z'), changedBy: admin._id, note: 'Slot and capacity verified' },
      ],
    });

    // Pending
    const detailService = createdServices.find((s) => s.category === 'Body & Detailing');
    await Booking.create({
      bookingReference: 'BK-20261114-6044',
      customer: david._id,
      vehicle: davidCar._id,
      service: detailService._id,
      bookingDate: '2026-11-14',
      timeSlot: '01:00 PM - 02:00 PM',
      complaints: 'Complete paint protection detailing and minor scratch removal.',
      status: 'Pending',
      estimatedCost: detailService.basePrice,
      laborCost: detailService.basePrice,
      totalCost: detailService.basePrice,
      statusHistory: [
        { status: 'Pending', changedAt: new Date('2026-11-11T18:00:00Z'), changedBy: david._id, note: 'Booking submitted online' },
      ],
    });

    // Notifications
    await Notification.insertMany([
      {
        recipient: alex._id,
        title: 'Invoice Ready for Payment',
        message: 'Your service for Honda Civic ZX is complete. Invoice INV-202611-1001 was generated.',
        type: 'invoice',
        isRead: true,
      },
      {
        recipient: alex._id,
        title: 'Diagnostic Appointment Confirmed',
        message: 'Technician Elena Rostova has been assigned to Yamaha R15 V4 on Nov 12.',
        type: 'mechanic_assigned',
        isRead: false,
      },
      {
        recipient: priya._id,
        title: 'Invoice Awaiting Payment',
        message: 'Invoice INV-202611-2042 of ₹4,838 for Hyundai Creta SX(O) is ready for payment.',
        type: 'invoice',
        relatedId: unpaidInvoice._id,
        isRead: false,
      },
      {
        recipient: marcus._id,
        title: 'New Service Job in Bay 1',
        message: 'BMW 330i M Sport brake inspection is assigned to you.',
        type: 'service_update',
        isRead: false,
      },
    ]);

    console.log('[Auto-Seed] Demo accounts and sample bookings populated successfully.');
  } catch (err) {
    console.error('[Auto-Seed] Seeding error:', err.message);
  }
};

module.exports = { runSeedInline };
