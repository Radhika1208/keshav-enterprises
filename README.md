# Keshav Enterprises — Surgical E-commerce (MERN)

A full-stack e-commerce site for a surgical instruments & disposables wholesaler, built with MongoDB, Express, React (Vite) and Node.js.

## Features
- Product catalog with categories, search, filters, sorting, pagination
- Product detail pages with specs, stock, and sterile/reusable badges
- Cart (persisted in browser) and multi-step checkout
- Customer accounts: register, login (JWT), profile, order history
- Razorpay payment integration (order creation + signature verification) plus Cash on Delivery
- Admin panel: dashboard stats, product CRUD, category CRUD, order status management
- GST (18%) and shipping calculated server-side at order time
- Seed script with 20 sample surgical products across 5 categories + a demo admin account

## Stack
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, bcrypt, Razorpay SDK
- **Frontend:** React 18, Vite, React Router, Axios, plain CSS design system (no UI framework dependency)

## Project structure
```
keshav-enterprises/
  backend/     Express API, MongoDB models, Razorpay integration
  frontend/    React storefront + admin panel (Vite)
```

## 1. Prerequisites
- Node.js 18+
- MongoDB running locally, or a MongoDB Atlas connection string
- A free Razorpay account (test mode keys) if you want working payments — https://dashboard.razorpay.com/

## 2. Backend setup
```bash
cd backend
cp .env.example .env
# edit .env: set MONGO_URI, JWT_SECRET, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
npm install
npm run seed      # loads categories, 20 sample products, and an admin user
npm run dev        # starts API on http://localhost:5000
```

Demo admin login (created by the seeder):
- Email: `admin@keshaventerprises.com`
- Password: `Admin@12345`

**Change this password (or delete the account) before deploying anywhere real.**

## 3. Frontend setup
```bash
cd frontend
cp .env.example .env
# edit .env: set VITE_API_URL and VITE_RAZORPAY_KEY_ID (same key as backend)
npm install
npm run dev         # starts the app on http://localhost:5173
```

The Vite dev server proxies `/api` to `http://localhost:5000`, so the two run side by side without a CORS dance in development.

## 4. Using it
- Visit `/` for the storefront, `/products` for the full catalog.
- Register a customer account, add items to cart, and check out — choose Razorpay (test mode: card `4111 1111 1111 1111`, any future expiry/CVV) or Cash on Delivery.
- Log in as the admin account and go to `/admin` to manage products, categories and order status.

## 5. Notes on production readiness
This is a solid functional foundation, not a production-hardened deployment. Before going live you should add:
- Rate limiting and helmet-style security headers on the API
- Image upload handling (currently product images are entered as URLs)
- Server-side pagination/caching tuning for larger catalogs
- Email notifications for order confirmation/shipping
- Proper Razorpay webhook handling (in addition to client-side verification) for payment reconciliation
- HTTPS, environment secrets management, and a process manager (PM2/Docker) for the Node server
