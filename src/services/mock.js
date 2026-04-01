// Mock data for development without backend
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const mockProducts = [
  { id: '1', name: 'Paracetamol 500mg', name_hi: 'पैरासिटामोल 500mg', price: 25, image: '', category: 'fever_cold', requires_prescription: false, in_stock: true },
  { id: '2', name: 'Crocin Advance', name_hi: 'क्रोसिन एडवांस', price: 30, image: '', category: 'fever_cold', requires_prescription: false, in_stock: true },
  { id: '3', name: 'Dolo 650', name_hi: 'डोलो 650', price: 32, image: '', category: 'fever_cold', requires_prescription: false, in_stock: true },
  { id: '4', name: 'Combiflam Tablet', name_hi: 'कॉम्बिफ्लेम टैबलेट', price: 35, image: '', category: 'pain_relief', requires_prescription: false, in_stock: true },
  { id: '5', name: 'Ibuprofen 400mg', name_hi: 'इबुप्रोफेन 400mg', price: 28, image: '', category: 'pain_relief', requires_prescription: false, in_stock: true },
  { id: '6', name: 'Vicks VapoRub', name_hi: 'विक्स वेपोरब', price: 75, image: '', category: 'fever_cold', requires_prescription: false, in_stock: true },
  { id: '7', name: 'ORS Sachet', name_hi: 'ORS सैशे', price: 12, image: '', category: 'general', requires_prescription: false, in_stock: true },
  { id: '8', name: 'Cetirizine 10mg', name_hi: 'सिट्रिजीन 10mg', price: 18, image: '', category: 'general', requires_prescription: false, in_stock: true },
  { id: '9', name: 'Vitamin C Tablets', name_hi: 'विटामिन C टैबलेट', price: 120, image: '', category: 'vitamins', requires_prescription: false, in_stock: true },
  { id: '10', name: 'Multivitamin Capsules', name_hi: 'मल्टीविटामिन कैप्सूल', price: 180, image: '', category: 'vitamins', requires_prescription: false, in_stock: true },
  { id: '11', name: 'Calcium + D3 Tablets', name_hi: 'कैल्शियम + D3 टैबलेट', price: 150, image: '', category: 'vitamins', requires_prescription: false, in_stock: true },
  { id: '12', name: 'Dettol Antiseptic', name_hi: 'डेटॉल एंटीसेप्टिक', price: 65, image: '', category: 'first_aid', requires_prescription: false, in_stock: true },
  { id: '13', name: 'Band-Aid Strips (10)', name_hi: 'बैंड-एड स्ट्रिप्स (10)', price: 40, image: '', category: 'first_aid', requires_prescription: false, in_stock: true },
  { id: '14', name: 'Cotton Roll', name_hi: 'कॉटन रोल', price: 30, image: '', category: 'first_aid', requires_prescription: false, in_stock: true },
  { id: '15', name: 'Burnol Cream', name_hi: 'बर्नोल क्रीम', price: 55, image: '', category: 'first_aid', requires_prescription: false, in_stock: true },
  { id: '16', name: 'Metformin 500mg', name_hi: 'मेटफॉर्मिन 500mg', price: 45, image: '', category: 'diabetes', requires_prescription: true, in_stock: true },
];

const bloodTests = [
  { id: 'cbc', name: 'Complete Blood Count (CBC)', name_hi: 'कम्पलीट ब्लड काउंट (CBC)', price: 350 },
  { id: 'sugar', name: 'Blood Sugar (Fasting)', name_hi: 'ब्लड शुगर (फास्टिंग)', price: 150 },
  { id: 'thyroid', name: 'Thyroid Profile', name_hi: 'थायरॉइड प्रोफाइल', price: 600 },
  { id: 'lipid', name: 'Lipid Profile', name_hi: 'लिपिड प्रोफाइल', price: 500 },
  { id: 'liver', name: 'Liver Function Test', name_hi: 'लिवर फंक्शन टेस्ट', price: 550 },
  { id: 'kidney', name: 'Kidney Function Test', name_hi: 'किडनी फंक्शन टेस्ट', price: 500 },
  { id: 'urine', name: 'Urine Routine', name_hi: 'यूरिन रूटीन', price: 200 },
  { id: 'vitamin_d', name: 'Vitamin D', name_hi: 'विटामिन D', price: 800 },
  { id: 'hba1c', name: 'HbA1c', name_hi: 'HbA1c', price: 450 },
];

// In-memory stores for mock
let users = JSON.parse(localStorage.getItem('o2_mock_users') || '[]');
let orders = JSON.parse(localStorage.getItem('o2_mock_orders') || '[]');
let bloodTestBookings = JSON.parse(localStorage.getItem('o2_mock_blood_tests') || '[]');
let prescriptions = JSON.parse(localStorage.getItem('o2_mock_prescriptions') || '[]');
let products = JSON.parse(localStorage.getItem('o2_mock_products') || 'null') || [...mockProducts];
let bloodTestsAdmin = JSON.parse(localStorage.getItem('o2_mock_blood_test_types') || 'null') || [...bloodTests];
let settings = JSON.parse(localStorage.getItem('o2_mock_settings') || '{"delivery_charge": 50}');

function persist() {
  localStorage.setItem('o2_mock_users', JSON.stringify(users));
  localStorage.setItem('o2_mock_orders', JSON.stringify(orders));
  localStorage.setItem('o2_mock_blood_tests', JSON.stringify(bloodTestBookings));
  localStorage.setItem('o2_mock_prescriptions', JSON.stringify(prescriptions));
  localStorage.setItem('o2_mock_products', JSON.stringify(products));
  localStorage.setItem('o2_mock_blood_test_types', JSON.stringify(bloodTestsAdmin));
  localStorage.setItem('o2_mock_settings', JSON.stringify(settings));
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
    } else {
      user.name = name;
      persist();
    }
    return user;
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
};

export default mockService;
