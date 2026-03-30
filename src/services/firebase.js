// Firebase service implementation
// This will be used when backendProvider is set to "firebase"
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import config from '../config/backend.js';

const app = initializeApp(config.firebase);
const db = getFirestore(app);
const storage = getStorage(app);

const firebaseService = {
  async loginSimple(name, mobile) {
    const q = query(collection(db, 'users'), where('mobile', '==', mobile));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0];
      await updateDoc(doc(db, 'users', userDoc.id), { name });
      return { id: userDoc.id, ...userDoc.data(), name };
    }
    const newUser = { name, mobile, role: 'user', created_at: new Date().toISOString() };
    const docRef = await addDoc(collection(db, 'users'), newUser);
    return { id: docRef.id, ...newUser };
  },

  async getUser(id) {
    const docSnap = await getDoc(doc(db, 'users', id));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  async updateUser(id, data) {
    await updateDoc(doc(db, 'users', id), data);
    return { id, ...data };
  },

  async getAllUsers() {
    const snapshot = await getDocs(collection(db, 'users'));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  async getProducts(category) {
    let q;
    if (category && category !== 'all') {
      q = query(collection(db, 'products'), where('category', '==', category));
    } else {
      q = collection(db, 'products');
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  async getProduct(id) {
    const docSnap = await getDoc(doc(db, 'products', id));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  async addProduct(data) {
    const docRef = await addDoc(collection(db, 'products'), data);
    return { id: docRef.id, ...data };
  },

  async updateProduct(id, data) {
    await updateDoc(doc(db, 'products', id), data);
    return { id, ...data };
  },

  async deleteProduct(id) {
    await deleteDoc(doc(db, 'products', id));
    return true;
  },

  async createOrder(data) {
    const order = { ...data, status: 'pending', created_at: new Date().toISOString() };
    const docRef = await addDoc(collection(db, 'orders'), order);
    return { id: docRef.id, ...order };
  },

  async getOrders(userId) {
    let q;
    if (userId) {
      q = query(collection(db, 'orders'), where('user_id', '==', userId), orderBy('created_at', 'desc'));
    } else {
      q = query(collection(db, 'orders'), orderBy('created_at', 'desc'));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  async getOrder(id) {
    const docSnap = await getDoc(doc(db, 'orders', id));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  async updateOrderStatus(id, status) {
    await updateDoc(doc(db, 'orders', id), { status });
    return { id, status };
  },

  getBloodTestTypes() {
    return [
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
  },

  async bookBloodTest(data) {
    const booking = { ...data, status: 'requested', report_url: null, created_at: new Date().toISOString() };
    const docRef = await addDoc(collection(db, 'blood_tests'), booking);
    return { id: docRef.id, ...booking };
  },

  async getBloodTestBookings(userId) {
    let q;
    if (userId) {
      q = query(collection(db, 'blood_tests'), where('user_id', '==', userId), orderBy('created_at', 'desc'));
    } else {
      q = query(collection(db, 'blood_tests'), orderBy('created_at', 'desc'));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  async updateBloodTestStatus(id, status, reportUrl) {
    const data = { status };
    if (reportUrl) data.report_url = reportUrl;
    await updateDoc(doc(db, 'blood_tests', id), data);
    return { id, ...data };
  },

  async uploadPrescription(data) {
    const rx = { ...data, created_at: new Date().toISOString() };
    const docRef = await addDoc(collection(db, 'prescriptions'), rx);
    return { id: docRef.id, ...rx };
  },

  async getPrescriptions(userId) {
    let q;
    if (userId) {
      q = query(collection(db, 'prescriptions'), where('user_id', '==', userId));
    } else {
      q = collection(db, 'prescriptions');
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  async uploadFile(file, path) {
    const storageRef = ref(storage, path + '/' + Date.now() + '_' + file.name);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  },

  async getStats() {
    const [ordersSnap, testsSnap, usersSnap] = await Promise.all([
      getDocs(collection(db, 'orders')),
      getDocs(collection(db, 'blood_tests')),
      getDocs(collection(db, 'users')),
    ]);
    const orders = ordersSnap.docs.map((d) => d.data());
    return {
      totalOrders: orders.length,
      totalTests: testsSnap.size,
      totalUsers: usersSnap.size,
      revenue: orders.reduce((sum, o) => sum + (o.total_price || 0), 0),
    };
  },
};

export default firebaseService;
