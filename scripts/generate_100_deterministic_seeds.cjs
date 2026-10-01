/**
 * Ashnora Deterministic 100 Seed Generator
 * Generates exactly 100 realistic records with relational integrity:
 * Customers, Tables, Dining Sessions, Orders, Order Items, Bills, Payments, Receipts, Service Requests, Notifications
 */

const fs = require('fs');
const path = require('path');

const RESTAURANT_ID = 'rest-ashnora-taj-01';
const RESTAURANT_NAME = 'Taj Palace Hotel';
const RESTAURANT_TAGLINE = 'A taste worth remembering';

const FIRST_NAMES = [
  'Aarav', 'Ananya', 'Rohan', 'Pooja', 'Vikram', 'Neha', 'Kabir', 'Aditi', 'Rahul', 'Simran',
  'Arjun', 'Meera', 'Karthik', 'Deepika', 'Varun', 'Sneha', 'Siddharth', 'Tanvi', 'Gaurav', 'Riya',
  'Aditya', 'Ishaan', 'Kavya', 'Manish', 'Divya', 'Nikhil', 'Shreya', 'Pranav', 'Ankita', 'Harsh'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Patel', 'Iyer', 'Menon', 'Reddy', 'Gupta', 'Malhotra', 'Kapoor', 'Deshmukh',
  'Chopra', 'Joshi', 'Bhat', 'Nair', 'Sengupta', 'Mehta', 'Kulkarni', 'Bansal', 'Agarwal', 'Rao'
];

const MENU_ITEMS = [
  { id: 'item-1', name: 'Chicken Biryani', category: 'Main Course', price: 340, veg: false },
  { id: 'item-2', name: 'Mutton Biryani', category: 'Main Course', price: 420, veg: false },
  { id: 'item-3', name: 'Butter Chicken', category: 'Main Course', price: 320, veg: false },
  { id: 'item-4', name: 'Paneer Butter Masala', category: 'Main Course', price: 280, veg: true },
  { id: 'item-5', name: 'Chicken 65', category: 'Starters', price: 240, veg: false },
  { id: 'item-6', name: 'Paneer Tikka', category: 'Starters', price: 220, veg: true },
  { id: 'item-7', name: 'Garlic Naan', category: 'Breads', price: 60, veg: true },
  { id: 'item-8', name: 'Butter Naan', category: 'Breads', price: 50, veg: true },
  { id: 'item-9', name: 'Fresh Lime Soda', category: 'Drinks', price: 90, veg: true },
  { id: 'item-10', name: 'Cold Coffee', category: 'Drinks', price: 120, veg: true },
  { id: 'item-11', name: 'Mango Juice', category: 'Drinks', price: 100, veg: true },
  { id: 'item-12', name: 'Gulab Jamun (2 pcs)', category: 'Desserts', price: 110, veg: true },
  { id: 'item-13', name: 'Rasmalai (2 pcs)', category: 'Desserts', price: 130, veg: true },
  { id: 'item-14', name: 'Chocolate Brownie', category: 'Desserts', price: 160, veg: true }
];

const ORDER_STATUS_CYCLE = [
  'PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'SERVED',
  'BILL_REQUESTED', 'BILLED', 'PAYMENT_PENDING', 'PAID', 'COMPLETED'
];

const PAYMENT_METHODS = ['upi', 'card', 'cash', 'online'];

// Deterministic pseudo-random based on seed
function createSeededRandom(seed = 1042) {
  let s = seed;
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function generate100Records() {
  const rng = createSeededRandom(42);
  const records = [];

  const baseDate = new Date('2026-09-30T10:00:00.000Z');

  for (let i = 1; i <= 100; i++) {
    const fn = FIRST_NAMES[Math.floor(rng() * FIRST_NAMES.length)];
    const ln = LAST_NAMES[Math.floor(rng() * LAST_NAMES.length)];
    const customerName = `${fn} ${ln}`;
    const customerId = `cust-${1000 + i}`;
    const phone = `+91 98${Math.floor(10000000 + rng() * 90000000)}`;

    const tableNum = (i % 24) + 1;
    const tableId = `table-t${tableNum}`;
    const seatNumber = (i % 4) + 1;
    const sessionId = `sess-104-${String(i).padStart(3, '0')}`;
    const orderId = `ord-A${1000 + i}`;
    const billId = `bill-B${1000 + i}`;
    const paymentId = `pay-P${1000 + i}`;
    const receiptId = `R-${1000 + i}`;

    // Status distribution
    let status;
    if (i <= 8) status = 'PLACED';
    else if (i <= 16) status = 'CONFIRMED';
    else if (i <= 30) status = 'PREPARING';
    else if (i <= 42) status = 'READY';
    else if (i <= 55) status = 'SERVED';
    else if (i <= 68) status = 'BILL_REQUESTED';
    else if (i <= 78) status = 'PAYMENT_PENDING';
    else if (i <= 90) status = 'PAID';
    else status = 'COMPLETED';

    const isClosed = status === 'COMPLETED' || (status === 'PAID' && i % 2 === 0);
    const sessionStatus = isClosed ? 'CLOSED' : (status === 'PAID' ? 'COMPLETED' : 'ACTIVE');

    // Pick 2-4 items
    const itemCount = 2 + Math.floor(rng() * 3);
    const selectedItems = [];
    let subtotal = 0;

    for (let k = 0; k < itemCount; k++) {
      const menuIdx = Math.floor(rng() * MENU_ITEMS.length);
      const m = MENU_ITEMS[menuIdx];
      const qty = 1 + (rng() > 0.7 ? 1 : 0);
      const lineTotal = m.price * qty;
      subtotal += lineTotal;

      selectedItems.push({
        id: `oi-${orderId}-${k + 1}`,
        order_id: orderId,
        menu_item_id: m.id,
        name: m.name,
        price: m.price,
        quantity: qty,
        line_total: lineTotal,
        veg: m.veg,
        special_instructions: k === 0 && rng() > 0.6 ? 'Less spicy, please' : null
      });
    }

    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;

    // Timeline timestamps
    const placedTime = new Date(baseDate.getTime() + i * 180000);
    const confirmedTime = new Date(placedTime.getTime() + 45000);
    const preparingTime = new Date(confirmedTime.getTime() + 90000);
    const readyTime = new Date(preparingTime.getTime() + 600000);
    const servedTime = new Date(readyTime.getTime() + 180000);
    const billRequestedTime = new Date(servedTime.getTime() + 900000);
    const billedTime = new Date(billRequestedTime.getTime() + 60000);
    const paidTime = new Date(billedTime.getTime() + 120000);
    const completedTime = new Date(paidTime.getTime() + 30000);

    const paymentMethod = PAYMENT_METHODS[Math.floor(rng() * PAYMENT_METHODS.length)];

    const hasVoice = i % 5 === 0;
    const voiceMetadata = hasVoice ? {
      audio_url: `https://storage.ashnora.com/audio/voice-ord-${i}.webm`,
      duration_seconds: 4.5,
      transcription: 'Please make the biryani extra spicy and add extra raita.',
      recorded_at: placedTime.toISOString()
    } : null;

    const record = {
      index: i,
      restaurant: {
        id: RESTAURANT_ID,
        name: RESTAURANT_NAME,
        tagline: RESTAURANT_TAGLINE,
        currency_symbol: '₹'
      },
      customer: {
        id: customerId,
        name: customerName,
        phone,
        visit_count: 1 + Math.floor(rng() * 8)
      },
      table: {
        id: tableId,
        table_number: `T${tableNum}`,
        seat_number: `S${seatNumber}`,
        capacity: 4
      },
      dining_session: {
        session_id: sessionId,
        status: sessionStatus,
        started_at: placedTime.toISOString(),
        completed_at: isClosed ? completedTime.toISOString() : null,
        closed_at: isClosed ? completedTime.toISOString() : null,
        final_total: isClosed ? total : null
      },
      order: {
        order_id: orderId,
        order_number: `A${1000 + i}`,
        status,
        subtotal,
        tax,
        total,
        voice_instructions: voiceMetadata,
        items: selectedItems,
        timestamps: {
          created_at: placedTime.toISOString(),
          placed_at: placedTime.toISOString(),
          confirmed_at: ['CONFIRMED', 'PREPARING', 'READY', 'SERVED', 'BILL_REQUESTED', 'BILLED', 'PAYMENT_PENDING', 'PAID', 'COMPLETED'].includes(status) ? confirmedTime.toISOString() : null,
          preparing_at: ['PREPARING', 'READY', 'SERVED', 'BILL_REQUESTED', 'BILLED', 'PAYMENT_PENDING', 'PAID', 'COMPLETED'].includes(status) ? preparingTime.toISOString() : null,
          ready_at: ['READY', 'SERVED', 'BILL_REQUESTED', 'BILLED', 'PAYMENT_PENDING', 'PAID', 'COMPLETED'].includes(status) ? readyTime.toISOString() : null,
          served_at: ['SERVED', 'BILL_REQUESTED', 'BILLED', 'PAYMENT_PENDING', 'PAID', 'COMPLETED'].includes(status) ? servedTime.toISOString() : null,
          bill_requested_at: ['BILL_REQUESTED', 'BILLED', 'PAYMENT_PENDING', 'PAID', 'COMPLETED'].includes(status) ? billRequestedTime.toISOString() : null,
          billed_at: ['BILLED', 'PAYMENT_PENDING', 'PAID', 'COMPLETED'].includes(status) ? billedTime.toISOString() : null,
          paid_at: ['PAID', 'COMPLETED'].includes(status) ? paidTime.toISOString() : null,
          completed_at: status === 'COMPLETED' ? completedTime.toISOString() : null
        }
      },
      bill: {
        bill_id: billId,
        invoice_number: `INV-2026-${String(i).padStart(4, '0')}`,
        status: ['PAID', 'COMPLETED'].includes(status) ? 'PAID' : (['BILL_REQUESTED', 'BILLED', 'PAYMENT_PENDING'].includes(status) ? 'UNPAID' : 'DRAFT'),
        subtotal,
        tax,
        total_amount: total
      },
      payment: ['PAID', 'COMPLETED'].includes(status) ? {
        payment_id: paymentId,
        receipt_id: receiptId,
        amount: total,
        payment_method: paymentMethod,
        status: 'PAID',
        paid_at: paidTime.toISOString()
      } : null,
      service_request: i % 4 === 0 ? {
        id: `sr-${100 + i}`,
        type: i % 8 === 0 ? 'WATER_REFILL' : 'EXTRA_CUTLERY',
        status: isClosed ? 'RESOLVED' : 'PENDING',
        requested_at: placedTime.toISOString()
      } : null
    };

    records.push(record);
  }

  return records;
}

const seedData = generate100Records();
const outputPath = path.resolve(__dirname, 'seed_100_records.json');
fs.writeFileSync(outputPath, JSON.stringify(seedData, null, 2), 'utf8');

console.log(`✅ Successfully generated exactly ${seedData.length} deterministic seed records.`);
console.log(`📁 File written to: ${outputPath}`);
