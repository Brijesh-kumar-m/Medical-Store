# 🏥 O2Clinic — Rural Healthcare PWA

A full-stack Progressive Web App for rural medical and healthcare services.

## ✨ Features

- 💊 **Medicine Ordering** — Browse & order OTC medicines with cart
- 🩸 **Blood Test Booking** — Home sample collection with scheduling
- 📋 **Prescription Upload** — Camera/file upload for prescriptions
- 📦 **Order Tracking** — Real-time order & test status
- 💬 **WhatsApp Integration** — Order via WhatsApp
- 🌐 **Bilingual** — Hindi & English with instant toggle
- 🔐 **Ultra-Simple Login** — Name + Mobile (no password!)
- 👤 **Guest Mode** — Browse without logging in
- 🛡️ **Admin Panel** — Full management dashboard
- 🔁 **Backend Switch** — Firebase ↔ Supabase toggle
- 📱 **PWA** — Installable, offline-capable

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server (mock mode)
npm run dev

# Build for production
npm run build
```

## ⚙️ Configuration

Copy `.env.example` to `.env` and fill in your values:

```env
# Use mock data (no backend needed)
VITE_USE_MOCK=true

# Supabase config
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Firebase config
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...

# Admin mobiles (comma-separated)
VITE_ADMIN_MOBILES=9999999999

# WhatsApp number
VITE_WHATSAPP_NUMBER=919999999999
```

## 🏗️ Architecture

```
src/
├── config/       → Backend configuration
├── services/     → Abstraction layer (mock/firebase/supabase)
├── contexts/     → React Context (Auth, Cart, Language)
├── components/   → Reusable UI components
├── pages/        → Route pages + admin panel
└── utils/        → WhatsApp helpers
```

## 👤 Admin Access

Login with a mobile number listed in `VITE_ADMIN_MOBILES` to access the admin panel.

Default admin number: `9999999999`

## 📋 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | TailwindCSS 3 |
| State | Context API |
| Backend (Option A) | Supabase (PostgreSQL + Auth + Storage) |
| Backend (Option B) | Firebase (Firestore + Auth + Storage) |
| PWA | vite-plugin-pwa + Workbox |
| Icons | Lucide React |

## 📄 License

MIT
