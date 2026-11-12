require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('../config/db');

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

const runSeeder = async () => {
  try {
    console.log('[Seeder] Connecting to database...');
    await connectDB();

    console.log('[Seeder] Clearing old records...');
    await Promise.all([
      User.deleteMany({}),
      Vehicle.deleteMany({}),
      Service.deleteMany({}),
      Mechanic.deleteMany({}),
      SparePart.deleteMany({}),
      Booking.deleteMany({}),
      Invoice.deleteMany({}),
      Payment.deleteMany({}),
      ServiceRecord.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    console.log('[Seeder] Inserting users...');
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

    console.log('[Seeder] Initializing mechanic profiles...');
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

    console.log('[Seeder] Inserting services catalog...');
    const createdServices = await Service.insertMany(seedServices);

    console.log('[Seeder] Inserting spare parts inventory...');
    const createdParts = await SparePart.insertMany(seedSpareParts);

    console.log('[Seeder] Registering sample customer supercar and hypercar fleet...');
    const vehicles = await Vehicle.insertMany([
      {
        owner: alex._id,
        type: 'supercar',
        registrationNumber: 'TS09SF9000',
        brand: 'Ferrari',
        model: 'SF90 Stradale Assetto Fiorano',
        year: 2023,
        fuelType: 'Hybrid',
        mileage: 4200,
        color: 'Rosso Corsa Red',
        notes: 'Twin-Turbo 4.0L V8 PHEV (1,000 CV), Assetto Fiorano carbon fiber package, ceramic brakes.',
      },
      {
        owner: alex._id,
        type: 'supercar',
        registrationNumber: 'TS09GT3992',
        brand: 'Porsche',
        model: '911 GT3 RS Weissach',
        year: 2024,
        fuelType: 'Petrol',
        mileage: 2800,
        color: 'Shark Blue',
        notes: 'Naturally Aspirated 4.0L Boxer-6 (525 PS), active DRS carbon wing, magnesium center-lock wheels.',
      },
      {
        owner: priya._id,
        type: 'supercar',
        registrationNumber: 'TS07LB6300',
        brand: 'Lamborghini',
        model: 'Revuelto V12 HPEV',
        year: 2024,
        fuelType: 'Hybrid',
        mileage: 1850,
        color: 'Giallo Inti Pearl Yellow',
        notes: '6.5L Mid-Mounted V12 with 3 Axial Flux Electric Motors (1015 CV), carbon monocoque chassis.',
      },
      {
        owner: priya._id,
        type: 'supercar',
        registrationNumber: 'TS08MC7650',
        brand: 'McLaren',
        model: '765LT Spider',
        year: 2023,
        fuelType: 'Petrol',
        mileage: 3900,
        color: 'Curacao Blue Metallic',
        notes: '4.0L Twin-Turbo V8 (765 PS), quad titanium exhaust, lightweight carbon fiber bodywork.',
      },
      {
        owner: david._id,
        type: 'hypercar',
        registrationNumber: 'TS10BG3000',
        brand: 'Bugatti',
        model: 'Chiron Super Sport 300+',
        year: 2023,
        fuelType: 'Petrol',
        mileage: 1600,
        color: 'Exposed Carbon & Jet Orange',
        notes: '8.0L Quad-Turbo W16 Engine (1600 HP), 300+ mph aerodynamically optimized longtail body.',
      },
      {
        owner: david._id,
        type: 'hypercar',
        registrationNumber: 'TS10KJ1600',
        brand: 'Koenigsegg',
        model: 'Jesko Attack',
        year: 2024,
        fuelType: 'Petrol',
        mileage: 820,
        color: 'Crystal White with Carbon Accents',
        notes: '5.0L Twin-Turbo V8 flat-plane crank (1600 BHP on E85), 9-speed Light Speed Transmission (LST).',
      },
    ]);

    const [alexCar, alexMoto, priyaScooter, priyaCar, davidCar] = vehicles;

    console.log('[Seeder] Generating comprehensive realistic bookings...');

    // 1. Completed Booking with PAID invoice and maintenance history
    const completedBookingRef = 'BK-20261101-1001';
    const generalService = createdServices.find((s) => s.category === 'General Maintenance');
    const oilPart = createdParts.find((p) => p.partNumber === 'OIL-MOTUL-300V-5L') || createdParts[0];
    const filterPart = createdParts.find((p) => p.partNumber === 'FLT-BMC-CARBON-01') || createdParts[1];

    const completedBooking = await Booking.create({
      bookingReference: completedBookingRef,
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
        {
          part: oilPart._id,
          partName: oilPart.name,
          partNumber: oilPart.partNumber,
          quantity: 1,
          unitPrice: oilPart.sellingPrice,
          totalPrice: oilPart.sellingPrice,
        },
        {
          part: filterPart._id,
          partName: filterPart.name,
          partNumber: filterPart.partNumber,
          quantity: 1,
          unitPrice: filterPart.sellingPrice,
          totalPrice: filterPart.sellingPrice,
        },
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

    // Create Paid Invoice for completed booking
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

    // Create Payment Record for paid invoice
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

    // Create ServiceRecord in Maintenance History
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

    // 2. Completed Booking with UNPAID invoice (Ready for customer to test simulated payment flow!)
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

    // 3. IN PROGRESS Booking (Assigned to Marcus)
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
      estimatedCompletionDate: new Date(+new Date() + 3 * 60 * 60 * 1000), // today + 3 hours
      statusHistory: [
        { status: 'Pending', changedAt: new Date('2026-11-10T11:00:00Z'), changedBy: david._id, note: 'Booked online' },
        { status: 'Confirmed', changedAt: new Date('2026-11-10T12:00:00Z'), changedBy: admin._id, note: 'Confirmed by workshop manager' },
        { status: 'Mechanic Assigned', changedAt: new Date('2026-11-11T09:00:00Z'), changedBy: admin._id, note: 'Assigned to Marcus Vance' },
        { status: 'In Progress', changedAt: new Date('2026-11-12T08:00:00Z'), changedBy: marcus._id, note: 'Work commenced in Bay 1' },
      ],
    });

    // 4. MECHANIC ASSIGNED Booking (Assigned to Elena, ready to start)
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

    // 5. CONFIRMED Booking (Approved by Admin, waiting for mechanic assignment)
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

    // 6. PENDING Booking (Awaiting Admin review)
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

    // 7. CANCELLED Booking
    await Booking.create({
      bookingReference: 'BK-20261105-7055',
      customer: alex._id,
      vehicle: alexCar._id,
      service: alignService._id,
      bookingDate: '2026-11-06',
      timeSlot: '04:00 PM - 05:00 PM',
      complaints: 'Routine wheel balancing.',
      status: 'Cancelled',
      cancellationReason: 'Customer had urgent out-of-station travel.',
      estimatedCost: alignService.basePrice,
      laborCost: alignService.basePrice,
      totalCost: alignService.basePrice,
      statusHistory: [
        { status: 'Pending', changedAt: new Date('2026-11-04T10:00:00Z'), changedBy: alex._id, note: 'Booking created' },
        { status: 'Cancelled', changedAt: new Date('2026-11-05T08:00:00Z'), changedBy: alex._id, note: 'Cancelled by customer: urgent travel' },
      ],
    });

    console.log('[Seeder] Creating realistic sample notifications...');
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

    console.log('\n=============================================================');
    console.log(' SEEDING COMPLETED SUCCESSFULLY!');
    console.log('=============================================================');
    console.log(' Demo Login Accounts:');
    console.log(' -----------------------------------------------------------');
    console.log(' [ADMIN]');
    console.log('   Email:    admin@autocare.com');
    console.log('   Password: Admin@123');
    console.log(' -----------------------------------------------------------');
    console.log(' [MECHANIC 1 - Master Tech]');
    console.log('   Email:    marcus.mechanic@autocare.com');
    console.log('   Password: Mechanic@123');
    console.log(' [MECHANIC 2 - Diagnostics]');
    console.log('   Email:    elena.mechanic@autocare.com');
    console.log('   Password: Mechanic@123');
    console.log(' -----------------------------------------------------------');
    console.log(' [CUSTOMER 1 - Alex Turner]');
    console.log('   Email:    alex.customer@example.com');
    console.log('   Password: Customer@123');
    console.log(' [CUSTOMER 2 - Priya Sharma (Has Unpaid Invoice)]');
    console.log('   Email:    priya.customer@example.com');
    console.log('   Password: Customer@123');
    console.log('=============================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seeder] Error populating database:', error);
    process.exit(1);
  }
};

runSeeder();
