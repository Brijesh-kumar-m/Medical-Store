// Mock data for development without backend
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const mockProducts = [
  { id: '1', name: 'Paracetamol 500mg', name_hi: 'पैरासिटामोल 500mg', price: 25, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=200&h=200&q=80', category: 'fever_cold', requires_prescription: false, in_stock: true },
  { id: '2', name: 'Crocin Advance', name_hi: 'क्रोसिन एडवांस', price: 30, image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=200&h=200&q=80', category: 'fever_cold', requires_prescription: false, in_stock: true },
  { id: '3', name: 'Dolo 650', name_hi: 'डोलो 650', price: 32, image: 'https://images.unsplash.com/photo-1607619275048-24722480f876?auto=format&fit=crop&w=200&h=200&q=80', category: 'fever_cold', requires_prescription: false, in_stock: true },
  { id: '4', name: 'Combiflam Tablet', name_hi: 'कॉम्बिफ्लेम टैबलेट', price: 35, image: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=200&h=200&q=80', category: 'pain_relief', requires_prescription: false, in_stock: true },
  { id: '5', name: 'Ibuprofen 400mg', name_hi: 'इबुप्रोफेन 400mg', price: 28, image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=200&h=200&q=80', category: 'pain_relief', requires_prescription: false, in_stock: true },
  { id: '6', name: 'Vicks VapoRub', name_hi: 'विक्स वेपोरब', price: 75, image: 'https://images.unsplash.com/photo-1555364376-7910cf94e9f7?auto=format&fit=crop&w=200&h=200&q=80', category: 'fever_cold', requires_prescription: false, in_stock: true },
  { id: '7', name: 'ORS Sachet', name_hi: 'ORS सैशे', price: 12, image: 'https://images.unsplash.com/photo-1547489432-cf93fa6c71ee?auto=format&fit=crop&w=200&h=200&q=80', category: 'general', requires_prescription: false, in_stock: true },
  { id: '8', name: 'Cetirizine 10mg', name_hi: 'सिट्रिजीन 10mg', price: 18, image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbbc88?auto=format&fit=crop&w=200&h=200&q=80', category: 'general', requires_prescription: false, in_stock: true },
  { id: '9', name: 'Vitamin C Tablets', name_hi: 'विटामिन C टैबलेट', price: 120, image: 'https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?auto=format&fit=crop&w=200&h=200&q=80', category: 'vitamins', requires_prescription: false, in_stock: true },
  { id: '10', name: 'Multivitamin Capsules', name_hi: 'मल्टीविटामिन कैप्सूल', price: 180, image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=200&h=200&q=80', category: 'vitamins', requires_prescription: false, in_stock: true },
  { id: '11', name: 'Calcium + D3 Tablets', name_hi: 'कैल्शियम + D3 टैबलेट', price: 150, image: 'https://images.unsplash.com/photo-1550572017-ed3c2cbe0df0?auto=format&fit=crop&w=200&h=200&q=80', category: 'vitamins', requires_prescription: false, in_stock: true },
  { id: '12', name: 'Dettol Antiseptic', name_hi: 'डेटॉल एंटीसेप्टिक', price: 65, image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=200&h=200&q=80', category: 'first_aid', requires_prescription: false, in_stock: true },
  { id: '13', name: 'Band-Aid Strips (10)', name_hi: 'बैंड-एड स्ट्रिप्स (10)', price: 40, image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=200&h=200&q=80', category: 'first_aid', requires_prescription: false, in_stock: true },
  { id: '14', name: 'Cotton Roll', name_hi: 'कॉटन रोल', price: 30, image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=200&h=200&q=80', category: 'first_aid', requires_prescription: false, in_stock: true },
  { id: '15', name: 'Burnol Cream', name_hi: 'बर्नोल क्रीम', price: 55, image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=200&h=200&q=80', category: 'first_aid', requires_prescription: false, in_stock: true },
  { id: '16', name: 'Metformin 500mg', name_hi: 'मेटफॉर्मिन 500mg', price: 45, image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=200&h=200&q=80', category: 'diabetes', requires_prescription: true, in_stock: true },
];

const bloodTests = [
  { id: 'cbc', name: 'Complete Blood Count (CBC)', name_hi: 'कम्पलीट ब्लड काउंट (CBC)', price: 350, mrp: 500, offer: '30% off' },
  { id: 'sugar', name: 'Blood Sugar (Fasting)', name_hi: 'ब्लड शुगर (फास्टिंग)', price: 150, mrp: 200, offer: '25% off' },
  { id: 'thyroid', name: 'Thyroid Profile', name_hi: 'थायरॉइड प्रोफाइल', price: 600, mrp: 800, offer: '25% off' },
  { id: 'lipid', name: 'Lipid Profile', name_hi: 'लिपिड प्रोफाइल', price: 500, mrp: 700, offer: '28% off' },
  { id: 'liver', name: 'Liver Function Test', name_hi: 'लिवर फंक्शन टेस्ट', price: 550, mrp: 800, offer: '31% off' },
  { id: 'kidney', name: 'Kidney Function Test', name_hi: 'किडनी फंक्शन टेस्ट', price: 500, mrp: 750, offer: '33% off' },
  { id: 'urine', name: 'Urine Routine', name_hi: 'यूरिन रूटीन', price: 200, mrp: 300, offer: '33% off' },
  { id: 'vitamin_d', name: 'Vitamin D', name_hi: 'विटामिन D', price: 800, mrp: 1200, offer: '33% off' },
  { id: 'hba1c', name: 'HbA1c', name_hi: 'HbA1c', price: 450, mrp: 600, offer: '25% off' },
  { id: 'diabetes_screen', name: 'Diabetes Screen (Fasting Sugar + HbA1c)', name_hi: 'डायबिटीज स्क्रीन', price: 500, mrp: 650, offer: '23% off' },
  { id: 'full_body', name: 'Full Body Health Checkup', name_hi: 'फुल बॉडी हेल्थ चेकअप', price: 1200, mrp: 2000, offer: '40% off' },
  { id: 'vitamin_b12', name: 'Vitamin B12 Test', name_hi: 'विटामिन B12 टेस्ट', price: 700, mrp: 900, offer: '22% off' },
  { id: 'hemoglobin', name: 'Hemoglobin (Hb) Test', name_hi: 'हीमोग्लोबिन टेस्ट', price: 100, mrp: 150, offer: '33% off' },
  { id: 'dengue_malaria', name: 'Malaria & Dengue Screen', name_hi: 'मलेरिया और डेंगू स्क्रीन', price: 400, mrp: 600, offer: '33% off' },
  { id: 'double_marker', name: 'Double Marker Test', name_hi: 'डबल मार्कर टेस्ट', price: 1500, mrp: 1800, offer: '16% off' },
];

// In-memory stores for mock
let users = JSON.parse(localStorage.getItem('o2_mock_users') || '[]');
let orders = JSON.parse(localStorage.getItem('o2_mock_orders') || '[]');
let bloodTestBookings = JSON.parse(localStorage.getItem('o2_mock_blood_tests') || '[]');
let prescriptions = JSON.parse(localStorage.getItem('o2_mock_prescriptions') || '[]');
let products = (() => {
  const stored = JSON.parse(localStorage.getItem('o2_mock_products') || 'null');
  if (!stored) return [...mockProducts];
  // Auto-migration: if any product has no image (empty string), migrate it to have the new default image
  let migrated = false;
  const updated = stored.map(p => {
    const defaultProd = mockProducts.find(d => d.id === p.id);
    if (defaultProd && !p.image) {
      migrated = true;
      return { ...p, image: defaultProd.image };
    }
    return p;
  });
  if (migrated) {
    localStorage.setItem('o2_mock_products', JSON.stringify(updated));
  }
  return updated;
})();
let bloodTestsAdmin = (() => {
  const stored = JSON.parse(localStorage.getItem('o2_mock_blood_test_types') || 'null');
  if (!stored) return [...bloodTests];
  // Auto-migration: if any default test is missing or lacks mrp/offer, merge/update it
  let migrated = false;
  const updated = [...stored];
  bloodTests.forEach(t => {
    const existingIdx = updated.findIndex(u => u.id === t.id);
    if (existingIdx === -1) {
      updated.push(t);
      migrated = true;
    } else {
      const existing = updated[existingIdx];
      if (existing.mrp !== t.mrp || existing.offer !== t.offer) {
        updated[existingIdx] = { ...existing, mrp: t.mrp, offer: t.offer };
        migrated = true;
      }
    }
  });
  if (migrated) {
    localStorage.setItem('o2_mock_blood_test_types', JSON.stringify(updated));
  }
  return updated;
})();
let settings = JSON.parse(localStorage.getItem('o2_mock_settings') || '{"delivery_charge": 50}');
let notifications = JSON.parse(localStorage.getItem('o2_mock_notifications') || '[]');

function persist() {
  localStorage.setItem('o2_mock_users', JSON.stringify(users));
  localStorage.setItem('o2_mock_orders', JSON.stringify(orders));
  localStorage.setItem('o2_mock_blood_tests', JSON.stringify(bloodTestBookings));
  localStorage.setItem('o2_mock_prescriptions', JSON.stringify(prescriptions));
  localStorage.setItem('o2_mock_products', JSON.stringify(products));
  localStorage.setItem('o2_mock_blood_test_types', JSON.stringify(bloodTestsAdmin));
  localStorage.setItem('o2_mock_settings', JSON.stringify(settings));
  localStorage.setItem('o2_mock_notifications', JSON.stringify(notifications));
}

const mockService = {
  // ======== AUTH ========
  async loginSimple(name, mobile) {
    await delay(500);
    let user = users.find((u) => u.mobile === mobile);
    if (!user) {
      user = { id: 'user_' + Date.now(), name, mobile, role: 'user', created_at: new Date().toISOString() };
      users.push(user);
      persist();
      return { ...user, isNew: true };
    } else {
      user.name = name;
      persist();
      return { ...user, isNew: false };
    }
  },

  async getUser(id) {
    await delay(200);
    return users.find((u) => u.id === id) || null;
  },

  async updateUser(id, data) {
    await delay(300);
    const idx = users.findIndex((u) => u.id === id);
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...data };
      persist();
      return users[idx];
    }
    return null;
  },

  async getAllUsers() {
    await delay(300);
    return [...users];
  },

  // ======== PRODUCTS ========
  async getProducts(category) {
    await delay(400);
    if (category && category !== 'all') {
      return products.filter((p) => p.category === category);
    }
    return [...products];
  },

  async getProduct(id) {
    await delay(200);
    return products.find((p) => p.id === id) || null;
  },

  async addProduct(data) {
    await delay(400);
    const product = { ...data, id: 'prod_' + Date.now() };
    products.push(product);
    persist();
    return product;
  },

  async updateProduct(id, data) {
    await delay(300);
    const idx = products.findIndex((p) => p.id === id);
    if (idx >= 0) {
      products[idx] = { ...products[idx], ...data };
      persist();
      return products[idx];
    }
    return null;
  },

  async deleteProduct(id) {
    await delay(300);
    products = products.filter((p) => p.id !== id);
    persist();
    return true;
  },

  // ======== ORDERS ========
  async createOrder(orderData) {
    await delay(600);
    const order = {
      ...orderData,
      id: 'ord_' + Date.now(),
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    orders.push(order);
    persist();

    // Check referral reward
    if (order.total_price >= 100) {
      const userObj = users.find(u => u.id === order.user_id);
      if (userObj && userObj.mobile) {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('o2_mock_referrals_')) {
            try {
              const stats = JSON.parse(localStorage.getItem(key));
              const refIdx = stats.referrals.findIndex(r => r.invitee_mobile === userObj.mobile && !r.rewarded);
              if (refIdx >= 0) {
                stats.referrals[refIdx].rewarded = true;
                stats.earned = stats.referrals.filter(r => r.rewarded).reduce((sum, r) => sum + (r.reward_amount || 50), 0);
                localStorage.setItem(key, JSON.stringify(stats));
                break;
              }
            } catch (e) {
              console.error('Failed to parse mock referrals:', e);
            }
          }
        }
      }
    }

    return order;
  },

  async getOrders(userId) {
    await delay(400);
    if (userId) return orders.filter((o) => o.user_id === userId).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async getOrder(id) {
    await delay(200);
    return orders.find((o) => o.id === id) || null;
  },

  async updateOrderStatus(id, status) {
    await delay(300);
    const idx = orders.findIndex((o) => o.id === id);
    if (idx >= 0) {
      orders[idx].status = status;
      persist();
      return orders[idx];
    }
    return null;
  },

  // ======== BLOOD TESTS ========
  async getBloodTestTypes() {
    await delay(200);
    return [...bloodTestsAdmin];
  },

  async addBloodTestType(data) {
    await delay(300);
    const test = { ...data, id: 'btt_' + Date.now() };
    bloodTestsAdmin.push(test);
    persist();
    return test;
  },

  async updateBloodTestType(id, data) {
    await delay(300);
    const idx = bloodTestsAdmin.findIndex((t) => t.id === id);
    if (idx >= 0) {
      bloodTestsAdmin[idx] = { ...bloodTestsAdmin[idx], ...data };
      persist();
      return bloodTestsAdmin[idx];
    }
    return null;
  },

  async deleteBloodTestType(id) {
    await delay(300);
    bloodTestsAdmin = bloodTestsAdmin.filter((t) => t.id !== id);
    persist();
    return true;
  },

  async bookBloodTest(data) {
    await delay(600);
    const booking = {
      ...data,
      id: 'bt_' + Date.now(),
      status: 'requested',
      report_url: null,
      created_at: new Date().toISOString(),
    };
    bloodTestBookings.push(booking);
    persist();
    return booking;
  },

  async getBloodTestBookings(userId) {
    await delay(400);
    if (userId) return bloodTestBookings.filter((b) => b.user_id === userId).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return [...bloodTestBookings].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async updateBloodTestStatus(id, status, reportUrl) {
    await delay(300);
    const idx = bloodTestBookings.findIndex((b) => b.id === id);
    if (idx >= 0) {
      bloodTestBookings[idx].status = status;
      if (reportUrl) bloodTestBookings[idx].report_url = reportUrl;
      persist();
      return bloodTestBookings[idx];
    }
    return null;
  },

  // ======== PRESCRIPTIONS ========
  async uploadPrescription(data) {
    await delay(800);
    const rx = {
      ...data,
      id: 'rx_' + Date.now(),
      created_at: new Date().toISOString(),
    };
    prescriptions.push(rx);
    persist();
    return rx;
  },

  async getPrescriptions(userId) {
    await delay(400);
    if (userId) return prescriptions.filter((p) => p.user_id === userId);
    return [...prescriptions];
  },

  // ======== FILE UPLOAD (mock) ========
  async uploadFile(file, path) {
    await delay(1000);
    // Create a blob URL for mock
    const url = URL.createObjectURL(file);
    return url;
  },

  // ======== STATS (Admin) ========
  async getStats() {
    await delay(300);
    return {
      totalOrders: orders.length,
      totalTests: bloodTestBookings.length,
      totalUsers: users.length,
      revenue: orders.reduce((sum, o) => sum + (o.total_price || 0), 0),
    };
  },

  // ======== SETTINGS (Admin) ========
  async getSettings() {
    await delay(100);
    return settings;
  },

  async updateSettings(data) {
    await delay(300);
    settings = { ...settings, ...data };
    persist();
    return settings;
  },

  async getReferralStats(userId) {
    await delay(200);
    const refKey = `o2_mock_referrals_${userId}`;
    const stats = JSON.parse(localStorage.getItem(refKey) || '{"total":0,"earned":0,"referrals":[]}');
    return stats;
  },

  async applyReferralCode(code, inviteeMobile) {
    await delay(300);
    if (!code || !code.startsWith('O2-')) return { success: false, error: 'Invalid code format' };
    const suffix = code.substring(3).toLowerCase();
    const referrer = users.find(u => u.id.slice(-6).toLowerCase() === suffix);
    if (!referrer) return { success: false, error: 'Referrer not found' };
    if (referrer.mobile === inviteeMobile) return { success: false, error: 'Cannot refer yourself' };

    const refKey = `o2_mock_referrals_${referrer.id}`;
    const stats = JSON.parse(localStorage.getItem(refKey) || '{"total":0,"earned":0,"referrals":[]}');

    if (stats.referrals.some(r => r.invitee_mobile === inviteeMobile)) {
      return { success: false, error: 'Already referred' };
    }

    const newRef = {
      id: 'ref_' + Date.now(),
      referrer_id: referrer.id,
      invitee_mobile: inviteeMobile,
      rewarded: false,
      reward_amount: 50,
      created_at: new Date().toISOString()
    };
    stats.referrals.push(newRef);
    stats.total = stats.referrals.length;
    localStorage.setItem(refKey, JSON.stringify(stats));
    return { success: true, referral: newRef };
  },

  // ======== NOTIFICATIONS ========
  async getNotifications(userId) {
    await delay(200);
    return notifications.filter(n => n.user_id === userId || !n.user_id).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async markNotificationRead(id) {
    await delay(100);
    const idx = notifications.findIndex(n => n.id === id);
    if (idx >= 0) {
      notifications[idx].read = true;
      persist();
      return notifications[idx];
    }
    return null;
  },

  async clearNotifications(userId) {
    await delay(200);
    // Keep other users' notifications, clear current user's
    notifications = notifications.filter(n => n.user_id !== userId);
    persist();
    return true;
  },

  async createNotification(data) {
    await delay(200);
    const notif = {
      id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      user_id: data.user_id || null,
      title: data.title,
      body: data.body,
      type: data.type || 'alert',
      metadata: data.metadata || {},
      read: false,
      created_at: new Date().toISOString()
    };
    notifications.push(notif);
    persist();

    // Trigger online real-time UI notification
    const event = new CustomEvent('mock-notification-received', { detail: notif });
    window.dispatchEvent(event);

    return notif;
  },
};

export default mockService;
