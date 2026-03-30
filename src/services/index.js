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
export function getBloodTestTypes() {
  // This is sync since it's static data
  return mockService.getBloodTestTypes();
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
