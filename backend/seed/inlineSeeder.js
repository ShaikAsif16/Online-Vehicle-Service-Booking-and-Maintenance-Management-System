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
        certifications: ['FIA Certified High-Performance Master Tech', 'Ferrari & Bugatti W16 Powertrain Specialist'],
      },
      {
        user: elena._id,
        specialization: ['Electrical & Diagnostics', 'AC & Climate Control'],
        experienceYears: 6,
        status: 'available',
        currentWorkload: 1,
        rating: 4.8,
        certifications: ['800V High-Voltage Hybrid Diagnostics Expert', 'McLaren Applied Telemetry & CAN-FD'],
      },
      {
        user: rajesh._id,
        specialization: ['Brakes & Suspension', 'Tires & Wheels'],
        experienceYears: 7,
        status: 'available',
        currentWorkload: 0,
        rating: 4.9,
        certifications: ['Brembo CCM-R Carbon Ceramic Specialist', 'Ohlins Active Dynamics & Pushrod Alignment'],
      },
    ]);

    const createdServices = await Service.insertMany(seedServices);
    const createdParts = await SparePart.insertMany(seedSpareParts);

    // Seeded Fleet: 100% Supercars & Hypercars
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
        notes: 'Twin-Turbo 4.0L V8 PHEV (1,000 CV), carbon aerodynamic pack, Brembo CCM-R brakes.',
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

    const [ferrariSF90, porscheGT3, lamboRevuelto, mclaren765, bugattiChiron, koenigseggJesko] = vehicles;

    // Completed Booking with PAID invoice (Ferrari SF90)
    const trackService = createdServices.find((s) => s.category === 'General Maintenance');
    const oilPart = createdParts.find((p) => p.partNumber === 'OIL-MOTUL-300V-5L');
    const filterPart = createdParts.find((p) => p.partNumber === 'FLT-BMC-CARBON-01');

    const completedBooking = await Booking.create({
      bookingReference: 'BK-20261101-1001',
      customer: alex._id,
      vehicle: ferrariSF90._id,
      service: trackService._id,
      bookingDate: '2026-11-01',
      timeSlot: '09:00 AM - 10:00 AM',
      complaints: 'Pre-flight circuit telemetry inspection and high-performance racing oil renewal.',
      additionalInstructions: 'Check center-lock wheel torque and test active DRS rear wing actuator.',
      status: 'Completed',
      assignedMechanic: marcus._id,
      estimatedCost: trackService.basePrice,
      laborCost: 12500,
      partsCost: oilPart.sellingPrice + filterPart.sellingPrice,
      totalCost: 12500 + oilPart.sellingPrice + filterPart.sellingPrice,
      diagnosis: 'Vehicle telemetry nominal. Motul 300V Ester Core oil and carbon airbox filter replenished.',
      repairNotes: 'Torqued all 4 center-lock hubs to 600 Nm spec. Flushed cooling circuits. Road-tested to 120 km/h on closed strip.',
      partsUsed: [
        { part: oilPart._id, partName: oilPart.name, partNumber: oilPart.partNumber, quantity: 1, unitPrice: oilPart.sellingPrice, totalPrice: oilPart.sellingPrice },
        { part: filterPart._id, partName: filterPart.name, partNumber: filterPart.partNumber, quantity: 1, unitPrice: filterPart.sellingPrice, totalPrice: filterPart.sellingPrice },
      ],
      actualCompletionDate: new Date('2026-11-01T12:30:00Z'),
      statusHistory: [
        { status: 'Pending', changedAt: new Date('2026-10-31T09:00:00Z'), changedBy: alex._id, note: 'Initial booking request' },
        { status: 'Confirmed', changedAt: new Date('2026-10-31T10:00:00Z'), changedBy: admin._id, note: 'Approved by workshop' },
        { status: 'Mechanic Assigned', changedAt: new Date('2026-10-31T11:00:00Z'), changedBy: admin._id, note: 'Assigned to Marcus Vance' },
        { status: 'In Progress', changedAt: new Date('2026-11-01T09:15:00Z'), changedBy: marcus._id, note: 'Work commenced in Bay 1' },
        { status: 'Completed', changedAt: new Date('2026-11-01T12:30:00Z'), changedBy: marcus._id, note: 'All track checks signed off' },
      ],
    });

    const subtotal1 = completedBooking.laborCost + completedBooking.partsCost;
    const tax1 = Math.round(subtotal1 * 0.18);
    const total1 = subtotal1 + tax1;

    const paidInvoice = await Invoice.create({
      invoiceNumber: 'INV-202611-1001',
      booking: completedBooking._id,
      customer: alex._id,
      vehicle: ferrariSF90._id,
      issueDate: new Date('2026-11-01T12:35:00Z'),
      items: [
        { description: `Labor: ${trackService.name}`, quantity: 1, unitPrice: completedBooking.laborCost, amount: completedBooking.laborCost, type: 'labor' },
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
      vehicle: ferrariSF90._id,
      booking: completedBooking._id,
      customer: alex._id,
      mechanic: marcus._id,
      serviceName: trackService.name,
      serviceDate: new Date('2026-11-01T12:30:00Z'),
      mileageAtService: 4200,
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
      nextServiceMileage: 10000,
    });

    // Completed Booking with UNPAID invoice (McLaren 765LT)
    const aeroService = createdServices.find((s) => s.category === 'AC & Climate Control');
    const cabinFilter = createdParts.find((p) => p.partNumber === 'FLT-CAB-CARBON-02');
    const srfFluid = createdParts.find((p) => p.partNumber === 'FLUID-CASTROL-SRF');

    const completedUnpaidBooking = await Booking.create({
      bookingReference: 'BK-20261108-2042',
      customer: priya._id,
      vehicle: mclaren765._id,
      service: aeroService._id,
      bookingDate: '2026-11-08',
      timeSlot: '11:00 AM - 12:00 PM',
      complaints: 'Active rear wing hydraulic speed brake deploy test and climate sterilization.',
      status: 'Completed',
      assignedMechanic: elena._id,
      estimatedCost: aeroService.basePrice,
      laborCost: aeroService.basePrice,
      partsCost: cabinFilter.sellingPrice + srfFluid.sellingPrice,
      totalCost: aeroService.basePrice + cabinFilter.sellingPrice + srfFluid.sellingPrice,
      diagnosis: 'Hydraulic active wing servo pressure recalibrated. Air sterilization complete.',
      repairNotes: 'Flushed hydraulic actuator lines and installed graphene anti-microbial cabin filter.',
      partsUsed: [
        { part: cabinFilter._id, partName: cabinFilter.name, partNumber: cabinFilter.partNumber, quantity: 1, unitPrice: cabinFilter.sellingPrice, totalPrice: cabinFilter.sellingPrice },
        { part: srfFluid._id, partName: srfFluid.name, partNumber: srfFluid.partNumber, quantity: 1, unitPrice: srfFluid.sellingPrice, totalPrice: srfFluid.sellingPrice },
      ],
      actualCompletionDate: new Date('2026-11-08T13:45:00Z'),
      statusHistory: [
        { status: 'Pending', changedAt: new Date('2026-11-07T14:00:00Z'), changedBy: priya._id, note: 'Booked online' },
        { status: 'Confirmed', changedAt: new Date('2026-11-07T15:00:00Z'), changedBy: admin._id, note: 'Confirmed by manager' },
        { status: 'Mechanic Assigned', changedAt: new Date('2026-11-07T16:00:00Z'), changedBy: admin._id, note: 'Assigned to Elena Rostova' },
        { status: 'In Progress', changedAt: new Date('2026-11-08T11:10:00Z'), changedBy: elena._id, note: 'Telemetry scan initiated' },
        { status: 'Completed', changedAt: new Date('2026-11-08T13:45:00Z'), changedBy: elena._id, note: 'Service complete & certified' },
      ],
    });

    const subtotal2 = completedUnpaidBooking.laborCost + completedUnpaidBooking.partsCost;
    const tax2 = Math.round(subtotal2 * 0.18);
    const total2 = subtotal2 + tax2;

    const unpaidInvoice = await Invoice.create({
      invoiceNumber: 'INV-202611-2042',
      booking: completedUnpaidBooking._id,
      customer: priya._id,
      vehicle: mclaren765._id,
      issueDate: new Date('2026-11-08T13:50:00Z'),
      items: [
        { description: `Labor: ${aeroService.name}`, quantity: 1, unitPrice: completedUnpaidBooking.laborCost, amount: completedUnpaidBooking.laborCost, type: 'labor' },
        { description: `Part: ${cabinFilter.name}`, quantity: 1, unitPrice: cabinFilter.sellingPrice, amount: cabinFilter.sellingPrice, type: 'part' },
        { description: `Part: ${srfFluid.name}`, quantity: 1, unitPrice: srfFluid.sellingPrice, amount: srfFluid.sellingPrice, type: 'part' },
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
      vehicle: mclaren765._id,
      booking: completedUnpaidBooking._id,
      customer: priya._id,
      mechanic: elena._id,
      serviceName: aeroService.name,
      serviceDate: new Date('2026-11-08T13:45:00Z'),
      mileageAtService: 3900,
      diagnosis: completedUnpaidBooking.diagnosis,
      repairNotes: completedUnpaidBooking.repairNotes,
      partsReplaced: [
        { partName: cabinFilter.name, partNumber: cabinFilter.partNumber, quantity: 1, price: cabinFilter.sellingPrice },
        { partName: srfFluid.name, partNumber: srfFluid.partNumber, quantity: 1, price: srfFluid.sellingPrice },
      ],
      laborCost: completedUnpaidBooking.laborCost,
      partsCost: completedUnpaidBooking.partsCost,
      totalAmount: total2,
      nextServiceRecommendedDate: new Date('2027-05-08'),
      nextServiceMileage: 8000,
    });

    // In Progress Booking (Bugatti Chiron Super Sport 300+)
    const brakeService = createdServices.find((s) => s.category === 'Brakes & Suspension');
    const brakePadPart = createdParts.find((p) => p.partNumber === 'BRK-PAD-BREMBO-CCM');

    await Booking.create({
      bookingReference: 'BK-20261111-3011',
      customer: david._id,
      vehicle: bugattiChiron._id,
      service: brakeService._id,
      bookingDate: '2026-11-12',
      timeSlot: '02:00 PM - 03:00 PM',
      complaints: 'Laser resonance scan of front Brembo Carbon Ceramic Matrix rotors before track day.',
      additionalInstructions: 'Inspect titanium pad clips and heat shields.',
      status: 'In Progress',
      assignedMechanic: marcus._id,
      estimatedCost: brakeService.basePrice,
      laborCost: brakeService.basePrice,
      partsCost: brakePadPart.sellingPrice,
      totalCost: brakeService.basePrice + brakePadPart.sellingPrice,
      diagnosis: 'CCM-R rotors within 98% nominal thickness. Installing fresh Brembo track pads.',
      repairNotes: 'Vehicle secured on Bay 1 heavy-duty pneumatic lift. Ultrasonic caliper cleaning underway.',
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

    // Mechanic Assigned (Porsche 911 GT3 RS Weissach)
    const hybridService = createdServices.find((s) => s.category === 'Electrical & Diagnostics');
    await Booking.create({
      bookingReference: 'BK-20261112-4022',
      customer: alex._id,
      vehicle: porscheGT3._id,
      service: hybridService._id,
      bookingDate: '2026-11-12',
      timeSlot: '03:00 PM - 04:00 PM',
      complaints: 'Telemetry datalogger check and CAN-FD sensor communication validation at 9000 RPM.',
      status: 'Mechanic Assigned',
      assignedMechanic: elena._id,
      estimatedCost: hybridService.basePrice,
      laborCost: hybridService.basePrice,
      totalCost: hybridService.basePrice,
      statusHistory: [
        { status: 'Pending', changedAt: new Date('2026-11-11T08:00:00Z'), changedBy: alex._id, note: 'Customer appointment created' },
        { status: 'Confirmed', changedAt: new Date('2026-11-11T10:00:00Z'), changedBy: admin._id, note: 'Approved by admin' },
        { status: 'Mechanic Assigned', changedAt: new Date('2026-11-11T11:00:00Z'), changedBy: admin._id, note: 'Assigned to Elena Rostova' },
      ],
    });

    // Confirmed (Lamborghini Revuelto V12 HPEV)
    const pushrodService = createdServices.find((s) => s.category === 'Tires & Wheels');
    await Booking.create({
      bookingReference: 'BK-20261113-5033',
      customer: priya._id,
      vehicle: lamboRevuelto._id,
      service: pushrodService._id,
      bookingDate: '2026-11-13',
      timeSlot: '10:00 AM - 11:00 AM',
      complaints: 'Precision 4-corner corner-weight scale balancing and negative camber track alignment.',
      status: 'Confirmed',
      estimatedCost: pushrodService.basePrice,
      laborCost: pushrodService.basePrice,
      totalCost: pushrodService.basePrice,
      statusHistory: [
        { status: 'Pending', changedAt: new Date('2026-11-11T15:00:00Z'), changedBy: priya._id, note: 'Customer appointment requested' },
        { status: 'Confirmed', changedAt: new Date('2026-11-11T16:30:00Z'), changedBy: admin._id, note: 'Laser alignment bay reserved' },
      ],
    });

    // Pending (Koenigsegg Jesko Attack)
    const ppfService = createdServices.find((s) => s.category === 'Body & Detailing');
    await Booking.create({
      bookingReference: 'BK-20261114-6044',
      customer: david._id,
      vehicle: koenigseggJesko._id,
      service: ppfService._id,
      bookingDate: '2026-11-14',
      timeSlot: '01:00 PM - 02:00 PM',
      complaints: 'Full frontal self-healing TPU PPF wrap on active carbon front splitters and hood louvers.',
      status: 'Pending',
      estimatedCost: ppfService.basePrice,
      laborCost: ppfService.basePrice,
      totalCost: ppfService.basePrice,
      statusHistory: [
        { status: 'Pending', changedAt: new Date('2026-11-11T18:00:00Z'), changedBy: david._id, note: 'Booking submitted online' },
      ],
    });

    // Notifications
    await Notification.insertMany([
      {
        recipient: alex._id,
        title: 'Track Inspection Invoice Paid',
        message: 'Your service for Ferrari SF90 Stradale is complete. Invoice INV-202611-1001 settled.',
        type: 'invoice',
        isRead: true,
      },
      {
        recipient: alex._id,
        title: 'Telemetry Appointment Confirmed',
        message: 'Technician Elena Rostova has been assigned to Porsche 911 GT3 RS Weissach on Nov 12.',
        type: 'mechanic_assigned',
        isRead: false,
      },
      {
        recipient: priya._id,
        title: 'Active Wing Service Invoice Ready',
        message: 'Invoice INV-202611-2042 of ₹29,559 for McLaren 765LT Spider is awaiting payment.',
        type: 'invoice',
        relatedId: unpaidInvoice._id,
        isRead: false,
      },
      {
        recipient: marcus._id,
        title: 'Hypercar in Bay 1',
        message: 'Bugatti Chiron Super Sport 300+ Brembo CCM-R overhaul is assigned to you.',
        type: 'service_update',
        isRead: false,
      },
    ]);

    console.log('[Auto-Seed] Demo accounts, supercar/hypercar fleet, and sample bookings populated successfully.');
  } catch (err) {
    console.error('[Auto-Seed] Seeding error:', err.message);
  }
};

module.exports = { runSeedInline };
