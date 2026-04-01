// Supabase service implementation
import { createClient } from '@supabase/supabase-js';
import config from '../config/backend.js';

const supabase = createClient(config.supabase.url, config.supabase.anonKey);

const supabaseService = {
  async loginSimple(name, mobile) {
    const { data: existing } = await supabase
      .from('users')
      .select('*')
      .eq('mobile', mobile)
      .single();

    if (existing) {
      await supabase.from('users').update({ name }).eq('id', existing.id);
      return { ...existing, name };
    }

    const { data: newUser, error } = await supabase
      .from('users')
      .insert({ name, mobile, role: 'user' })
      .select()
      .single();

    if (error) throw error;
    return newUser;
  },

  async getUser(id) {
    const { data } = await supabase.from('users').select('*').eq('id', id).single();
    return data;
  },

  async updateUser(id, userData) {
    const { data } = await supabase.from('users').update(userData).eq('id', id).select().single();
    return data;
  },

  async getAllUsers() {
    const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    return data || [];
  },

  async getProducts(category) {
    let q = supabase.from('products').select('*');
    if (category && category !== 'all') {
      q = q.eq('category', category);
    }
    const { data } = await q.order('name');
    return data || [];
  },

  async getProduct(id) {
    const { data } = await supabase.from('products').select('*').eq('id', id).single();
    return data;
  },

  async addProduct(productData) {
    const { data, error } = await supabase.from('products').insert(productData).select().single();
    if (error) throw error;
    return data;
  },

  async updateProduct(id, productData) {
    const { data } = await supabase.from('products').update(productData).eq('id', id).select().single();
    return data;
  },

  async deleteProduct(id) {
    await supabase.from('products').delete().eq('id', id);
    return true;
  },

  async createOrder(orderData) {
    const { data, error } = await supabase
      .from('orders')
      .insert({ ...orderData, status: 'pending' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getOrders(userId) {
    let q = supabase.from('orders').select('*');
    if (userId) q = q.eq('user_id', userId);
    const { data } = await q.order('created_at', { ascending: false });
    return data || [];
  },

  async getOrder(id) {
    const { data } = await supabase.from('orders').select('*').eq('id', id).single();
    return data;
  },

  async updateOrderStatus(id, status) {
    const { data } = await supabase.from('orders').update({ status }).eq('id', id).select().single();
    return data;
  },

  async getSettings() {
    const { data } = await supabase.from('admin_settings').select('value').eq('id', 'global').single();
    return data?.value || { delivery_charge: 50 };
  },

  async updateSettings(settingsData) {
    const { data, error } = await supabase
      .from('admin_settings')
      .upsert({ id: 'global', value: settingsData, updated_at: new Date() })
      .select().single();
    if (error) throw error;
    return data?.value || settingsData;
  },

  async getBloodTestTypes() {
    const { data } = await supabase.from('blood_test_types').select('*').order('created_at', { ascending: true });
    return data || [];
  },

  async addBloodTestType(testData) {
    const { data, error } = await supabase.from('blood_test_types').insert(testData).select().single();
    if (error) throw error;
    return data;
  },

  async updateBloodTestType(id, testData) {
    const { data, error } = await supabase.from('blood_test_types').update(testData).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteBloodTestType(id) {
    await supabase.from('blood_test_types').delete().eq('id', id);
    return true;
  },

  async bookBloodTest(data) {
    const { data: booking, error } = await supabase
      .from('blood_tests')
      .insert({ ...data, status: 'requested', report_url: null })
      .select()
      .single();
    if (error) throw error;
    return booking;
  },

  async getBloodTestBookings(userId) {
    let q = supabase.from('blood_tests').select('*');
    if (userId) q = q.eq('user_id', userId);
    const { data } = await q.order('created_at', { ascending: false });
    return data || [];
  },

  async updateBloodTestStatus(id, status, reportUrl) {
    const update = { status };
    if (reportUrl) update.report_url = reportUrl;
    const { data } = await supabase.from('blood_tests').update(update).eq('id', id).select().single();
    return data;
  },

  async uploadPrescription(data) {
    const { data: rx, error } = await supabase.from('prescriptions').insert(data).select().single();
    if (error) throw error;
    return rx;
  },

  async getPrescriptions(userId) {
    let q = supabase.from('prescriptions').select('*');
    if (userId) q = q.eq('user_id', userId);
    const { data } = await q.order('created_at', { ascending: false });
    return data || [];
  },

  async uploadFile(file, path) {
    const fileName = `${path}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('uploads').upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from('uploads').getPublicUrl(fileName);
    return data.publicUrl;
  },

  async getStats() {
    const [ordersRes, testsRes, usersRes] = await Promise.all([
      supabase.from('orders').select('total_price'),
      supabase.from('blood_tests').select('id', { count: 'exact' }),
      supabase.from('users').select('id', { count: 'exact' }),
    ]);
    return {
      totalOrders: ordersRes.data?.length || 0,
      totalTests: testsRes.count || 0,
      totalUsers: usersRes.count || 0,
      revenue: (ordersRes.data || []).reduce((sum, o) => sum + (o.total_price || 0), 0),
    };
  },
};

export default supabaseService;
