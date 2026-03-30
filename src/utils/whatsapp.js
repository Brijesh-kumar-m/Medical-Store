import config from '../config/backend.js';

export function openWhatsApp(message) {
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${config.whatsappNumber}?text=${encoded}`;
  window.open(url, '_blank');
}

export function generateOrderMessage(order, items, lang = 'en') {
  const isHindi = lang === 'hi';
  let msg = isHindi
    ? `🏥 *O2Clinic ऑर्डर*\n\n`
    : `🏥 *O2Clinic Order*\n\n`;

  items.forEach((item, i) => {
    msg += `${i + 1}. ${item.name} x${item.qty} — ₹${item.price * item.qty}\n`;
  });

  msg += `\n💰 ${isHindi ? 'कुल' : 'Total'}: ₹${order.total_price}`;
  msg += `\n📍 ${isHindi ? 'पता' : 'Address'}: ${order.address}`;
  msg += `\n📱 ${isHindi ? 'मोबाइल' : 'Mobile'}: ${order.mobile || ''}`;

  return msg;
}

export function generateBloodTestMessage(booking, lang = 'en') {
  const isHindi = lang === 'hi';
  let msg = isHindi
    ? `🩸 *O2Clinic ब्लड टेस्ट बुकिंग*\n\n`
    : `🩸 *O2Clinic Blood Test Booking*\n\n`;

  msg += `${isHindi ? 'टेस्ट' : 'Test'}: ${booking.test_type}\n`;
  msg += `${isHindi ? 'मरीज़' : 'Patient'}: ${booking.patient_name}\n`;
  msg += `${isHindi ? 'तारीख' : 'Date'}: ${booking.date}\n`;
  msg += `${isHindi ? 'समय' : 'Time'}: ${booking.time}\n`;
  msg += `${isHindi ? 'पता' : 'Address'}: ${booking.address}\n`;

  return msg;
}
