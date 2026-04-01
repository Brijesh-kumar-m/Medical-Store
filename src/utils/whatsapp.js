import config from '../config/backend.js';

export function openWhatsApp(message) {
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${config.whatsappNumber}?text=${encoded}`;
  window.open(url, '_blank');
}

export function generateOrderMessage(order, items, lang = 'en') {
  const isHindi = lang === 'hi';
  
  let msg = isHindi
    ? `*O2Clinic - नया आर्डर*\n\n`
    : `*O2Clinic - New Order*\n\n`;

  msg += `*${isHindi ? 'ऑर्डर आइटम्स' : 'Order Items'}:*\n`;
  items.forEach((item, i) => {
    msg += `- ${item.name} (x${item.qty}) = ₹${item.price * item.qty}\n`;
  });

  msg += `\n*${isHindi ? 'बिल डिटेल्स' : 'Billing Details'}:*\n`;
  if (order.subtotal !== undefined && order.delivery_charge !== undefined) {
    msg += `- Subtotal: ₹${order.subtotal}\n`;
    msg += `- Delivery Charge: ₹${order.delivery_charge}\n`;
    msg += `------------------------\n`;
  }
  msg += `*${isHindi ? 'फाइनल टोटल' : 'Grand Total'}: ₹${order.total_price}*\n`;

  msg += `\n*${isHindi ? 'डिलीवरी डिटेल्स' : 'Delivery Details'}:*\n`;
  if (order.patient_name) msg += `${isHindi ? 'नाम' : 'Name'}: ${order.patient_name}\n`;
  msg += `${isHindi ? 'पता' : 'Address'}: ${order.address || '—'}\n`;
  if (order.mobile) msg += `${isHindi ? 'मोबाइल' : 'Mobile'}: ${order.mobile}\n`;

  return msg;
}

export function generateBloodTestMessage(booking, lang = 'en') {
  const isHindi = lang === 'hi';
  let msg = isHindi
    ? `*O2Clinic - ब्लड टेस्ट बुकिंग*\n\n`
    : `*O2Clinic - Blood Test Booking*\n\n`;

  msg += `*${isHindi ? 'टेस्ट' : 'Test'}:* ${booking.test_type}\n`;
  msg += `*${isHindi ? 'मरीज़' : 'Patient'}:* ${booking.patient_name}\n`;
  if (booking.mobile) msg += `*${isHindi ? 'फ़ोन' : 'Phone'}:* ${booking.mobile}\n`;
  msg += `*${isHindi ? 'तारीख' : 'Date'}:* ${booking.date}\n`;
  msg += `*${isHindi ? 'समय' : 'Time'}:* ${booking.time}\n`;
  msg += `*${isHindi ? 'पता' : 'Address'}:* ${booking.address || '—'}\n`;

  return msg;
}
