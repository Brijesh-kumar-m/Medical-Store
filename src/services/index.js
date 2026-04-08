// Service Abstraction Layer
// Switches between Firebase, Supabase, or Mock based on config
import config from '../config/backend.js';
import mockService from './mock.js';

let activeService = null;

async function initService() {
  if (config.useMockData) {
    activeService = mockService;
    console.log('[O2Clinic] Using mock data service');
    return;
  }

  if (config.backendProvider === 'firebase') {
    const { default: firebaseService } = await import('./firebase.js');
    activeService = firebaseService;
    console.log('[O2Clinic] Using Firebase service');
  } else {
    const { default: supabaseService } = await import('./supabase.js');
    activeService = supabaseService;
    console.log('[O2Clinic] Using Supabase service');
  }
}

// Initialize on load
const serviceReady = initService();

async function getService() {
  await serviceReady;
  return activeService;
}

// ============ EXPORTED API ============

// Auth
export async function loginSimple(name, mobile) {
  const svc = await getService();
  return svc.loginSimple(name, mobile);
}

export async function getUser(id) {
  const svc = await getService();
  return svc.getUser(id);
}

export async function updateUser(id, data) {
  const svc = await getService();
  return svc.updateUser(id, data);
}

export async function getAllUsers() {
  const svc = await getService();
  return svc.getAllUsers();
}

// Products
export async function getProducts(category) {
  const svc = await getService();
  return svc.getProducts(category);
}

export async function getProduct(id) {
  const svc = await getService();
  return svc.getProduct(id);
}

export async function addProduct(data) {
  const svc = await getService();
  return svc.addProduct(data);
}

export async function updateProduct(id, data) {
  const svc = await getService();
  return svc.updateProduct(id, data);
}

export async function deleteProduct(id) {
  const svc = await getService();
  return svc.deleteProduct(id);
}

// Orders
export async function createOrder(data) {
  const svc = await getService();
  return svc.createOrder(data);
}

export async function getOrders(userId) {
  const svc = await getService();
  return svc.getOrders(userId);
}

export async function getOrder(id) {
  const svc = await getService();
  return svc.getOrder(id);
}

export async function updateOrderStatus(id, status) {
  const svc = await getService();
  return svc.updateOrderStatus(id, status);
}

// Blood Tests
export async function getBloodTestTypes() {
  const svc = await getService();
  return svc.getBloodTestTypes();
}

export async function addBloodTestType(data) {
  const svc = await getService();
  return svc.addBloodTestType ? svc.addBloodTestType(data) : null;
}

export async function updateBloodTestType(id, data) {
  const svc = await getService();
  return svc.updateBloodTestType ? svc.updateBloodTestType(id, data) : null;
}

export async function deleteBloodTestType(id) {
  const svc = await getService();
  return svc.deleteBloodTestType ? svc.deleteBloodTestType(id) : null;
}

export async function bookBloodTest(data) {
  const svc = await getService();
  return svc.bookBloodTest(data);
}

export async function getBloodTestBookings(userId) {
  const svc = await getService();
  return svc.getBloodTestBookings(userId);
}

export async function updateBloodTestStatus(id, status, reportUrl) {
  const svc = await getService();
  return svc.updateBloodTestStatus(id, status, reportUrl);
}

// Prescriptions
export async function uploadPrescription(data) {
  const svc = await getService();
  return svc.uploadPrescription(data);
}

export async function getPrescriptions(userId) {
  const svc = await getService();
  return svc.getPrescriptions(userId);
}

export async function updatePrescriptionStatus(id, status) {
  const svc = await getService();
  return svc.updatePrescriptionStatus ? svc.updatePrescriptionStatus(id, status) : null;
}

// File Upload
export async function uploadFile(file, path) {
  const svc = await getService();
  return svc.uploadFile(file, path);
}

// Stats
export async function getStats() {
  const svc = await getService();
  return svc.getStats();
}

// Settings
export async function getSettings() {
  const svc = await getService();
  return svc.getSettings ? svc.getSettings() : { delivery_charge: 50 };
}

export async function updateSettings(data) {
  const svc = await getService();
  return svc.updateSettings ? svc.updateSettings(data) : data;
}

// Referrals
export async function getReferralStats(userId) {
  const svc = await getService();
  return svc.getReferralStats ? svc.getReferralStats(userId) : { total: 0, earned: 0, referrals: [] };
}

export async function createReferral(referrerId, inviteeMobile) {
  const svc = await getService();
  return svc.createReferral ? svc.createReferral(referrerId, inviteeMobile) : null;
}

// Push Notifications
export async function savePushToken(userId, token) {
  const svc = await getService();
  return svc.savePushToken ? svc.savePushToken(userId, token) : null;
}
