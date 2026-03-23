# SwadPoint - Restaurant Management System

## 📋 Project Overview

SwadPoint is a comprehensive **Restaurant Management System** built with **Next.js + PostgreSQL** that handles orders, payments, inventory, reservations, and analytics for modern restaurants.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│           Frontend (Next.js + React)                    │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Dashboard (Orders, Billing, Inventory, etc.)  │   │
│  │  Customer Menu (Browse & Order)                │   │
│  │  Payment Gateway (UPI QR Codes)                │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼ (API Calls)
┌─────────────────────────────────────────────────────────┐
│        Backend API (Next.js Route Handlers)             │
│  ┌──────────────────────────────────────────────────┐   │
│  │  /api/orders       (Create, List, Update)      │   │
│  │  /api/payments     (Payment tracking)          │   │
│  │  /api/menu         (Menu management)           │   │
│  │  /api/inventory    (Stock management)          │   │
│  │  /api/customers    (Customer data)             │   │
│  │  /api/reservation  (Table booking)             │   │
│  │  /api/auth         (Authentication)            │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼ (Database Queries)
┌─────────────────────────────────────────────────────────┐
│        PostgreSQL Database                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Tables:                                         │   │
│  │  - app_users       (User accounts)              │   │
│  │  - orders          (Order data)                 │   │
│  │  - menu_items      (Menu items)                 │   │
│  │  - inventory_items (Stock data)                 │   │
│  │  - payments        (Payment records)            │   │
│  │  - reservations    (Table reservations)         │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Features

### **1. Order Management** ✅

- **Create Orders**: Customers browse menu and add items to cart
- **Track Orders**: Real-time order status updates (Pending → Preparing → Completed)
- **Search & Filter**: Search by Order ID, Customer Name, Mobile Number
- **Auto-Refresh**: Live updates every 30 seconds (configurable)
- **Order Timeline**: Visual progress tracker showing order states
- **Status Updates**: Staff to accept, prepare, and complete orders

### **2. Payment Processing** ✅

- **Payment Methods**: UPI (QR Code), Cash on Delivery, Card
- **UPI Integration**: Generate QR codes for instant payments
- **Payment Tracking**: Monitor success/pending/failed transactions
- **Invoice Generation**: Download and print invoices
- **Payment Reconciliation**: Automatic payment-order linking
- **Smart Search**: Find payments by ID, Order ID, or Customer details

### **3. Menu Management** ✅

- **Category Organization**: Main Course, Starter, Dessert, Beverage
- **CRUD Operations**: Add, Edit, Delete menu items
- **Price Management**: Set and update item prices
- **Duplicate Prevention**: Prevent same item in same category
- **Item Descriptions**: Detailed product information

### **4. Inventory Management** ✅

- **Stock Tracking**: Real-time inventory levels
- **Low Stock Alerts**: Automatic notifications when stock below minimum
- **Item Categories**: Organize inventory by type
- **Auto-Refresh**: Live updates every 30 seconds
- **Search Functionality**: Find items by name or supplier
- **Unit Management**: kg, gm, ltr, ml, pcs, pack, bottle

### **5. Customer Management** ✅

- **Customer Profiles**: Track customer details and history
- **Loyalty Tracking**: Points and frequent visitor counts
- **Order History**: Access to all customer orders
- **Payment Status**: View customer payment records
- **Search & Filter**: Find customers by name, phone, or email

### **6. Billing & Revenue** ✅

- **Payment Dashboard**: Overview of all transactions
- **Revenue Metrics**: Daily and total revenue tracking
- **Payment Status Filtering**: View success/pending/failed payments
- **Transaction Details**: Date, time, amount, method for each payment
- **QR Code Management**: Configure UPI ID and payee name

### **7. Reservation System** ✅

- **Table Booking**: Reserve tables for specific times
- **Guest Management**: Track guest count and preferences
- **Status Tracking**: Pending, Confirmed, Completed, Cancelled
- **Reservation Settings**: Configure reservation rules

### **8. Reports & Analytics** ✅

- **Sales Analytics**: Revenue trends and patterns
- **Order Analytics**: Order counts and performance
- **Customer Analytics**: Visitor trends and loyalty metrics
- **Advanced Charts**: Line, Bar, Pie, and Doughnut charts
- **Export Options**: Download reports for further analysis

### **9. Settings & Configuration** ✅

- **Restaurant Config**: Brand name, location, contact info
- **Payment Settings**: Tax percentage, service charge
- **Notification Settings**: Configure alerts for orders, stock, payments
- **Access Control**: Manager permissions, staff roles
- **QR Settings**: Customize QR code behavior

---

## 💻 Tech Stack

| Layer              | Technology                         |
| ------------------ | ---------------------------------- |
| **Frontend**       | Next.js 14, React 18, Tailwind CSS |
| **Backend**        | Next.js API Routes (Node.js)       |
| **Database**       | PostgreSQL 12+                     |
| **Authentication** | Session-based (Custom)             |
| **Payment**        | UPI (QR Code generation)           |
| **UI Components**  | Lucide Icons, React Hot Toast      |
| **Charts**         | Chart.js with React wrapper        |
| **Deployment**     | Vercel                             |
| **Styling**        | Tailwind CSS, PostCSS              |

---

## 📦 Project Structure

```
swadpoint/
├── app/
│   ├── (dashboard)/              # Dashboard layout group
│   │   ├── Sidebar.jsx           # Navigation sidebar
│   │   └── dashboard/
│   │       ├── orders/           # Orders management
│   │       ├── billing/          # Payments & invoicing
│   │       ├── menu/             # Menu management
│   │       ├── inventory/        # Stock management
│   │       ├── customers/        # Customer list
│   │       ├── reservation/      # Table bookings
│   │       ├── reports/          # Analytics
│   │       └── settings/         # Configuration
│   ├── (welcome)/                # Public pages layout
│   │   ├── about-us/
│   │   ├── features/
│   │   ├── faq/
│   │   └── contact/
│   ├── api/                      # Backend API routes
│   │   ├── auth/                 # Authentication
│   │   ├── orders/               # Order endpoints
│   │   ├── payments/             # Payment endpoints
│   │   ├── menu/                 # Menu CRUD
│   │   ├── inventory/            # Stock management
│   │   └── ...
│   ├── cart/                     # Shopping cart page
│   ├── login/                    # Auth pages
│   ├── menu/                     # Customer menu
│   └── layout.jsx                # Root layout
├── components/
│   ├── auth/                     # Auth UI components
│   │   ├── Login.jsx
│   │   ├── Navbar.jsx
│   │   └── ...
│   ├── dashboard/                # Dashboard components
│   │   ├── CategoriesTable.jsx
│   │   └── StatsCards.jsx
│   └── ui/                       # Reusable UI elements
├── lib/
│   ├── db.js                     # PostgreSQL connection
│   ├── db-schema.js              # Database initialization
│   ├── auth.js                   # Authentication logic
│   ├── inventory-alerts.js       # Stock alert system
│   ├── order-events.js           # Order event system
│   └── reservation-settings-defaults.js
├── helper/
│   ├── storage.js                # LocalStorage utilities
│   ├── invoice.js                # Invoice generation
│   ├── businessProfile.js        # Restaurant config
│   └── utils.js                  # Utility functions
├── styles/
│   ├── globals.css               # Global styles
│   └── dashboard.css             # Dashboard styles
├── public/                       # Static assets
└── package.json                  # Dependencies
```

---

## 🚀 Getting Started

### **1. Prerequisites**

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### **2. Installation**

```bash
# Clone repository
git clone <repo-url>
cd swadpoint

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your database credentials

# Initialize database
npm run db:init

# Start development server
npm run dev
```

### **3. Environment Variables** (.env.local)

```
DATABASE_URL=postgresql://user:password@localhost:5432/swadpoint
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### **4. Database Setup**

```bash
# Runs postgres-init.sql to create tables
npm run db:init

# Or manually:
psql -U postgres -d swadpoint -f documentation/sql/postgres-init.sql
```

---

## 📊 Core API Endpoints

### **Orders**

```
GET    /api/orders              # List all orders
POST   /api/orders              # Create new order
PATCH  /api/orders              # Update order status
GET    /api/orders/stream       # Real-time order updates
```

### **Payments**

```
GET    /api/payments            # List all payments
POST   /api/payments            # Create payment record
PATCH  /api/payments            # Update payment status
GET    /api/payment-config      # Get UPI settings
PUT    /api/payment-config      # Update UPI settings
```

### **Menu**

```
GET    /api/menu                # List all menu items
PUT    /api/menu                # Update menu items
POST   /api/menu                # Add menu item
DELETE /api/menu                # Delete menu item
```

### **Inventory**

```
GET    /api/inventory           # List inventory items
POST   /api/inventory           # Add stock item
PATCH  /api/inventory/:id       # Update stock level
DELETE /api/inventory/:id       # Remove item
```

### **Customers**

```
GET    /api/user                # Get user info
POST   /api/auth/register       # Register user
POST   /api/auth/login          # Login user
POST   /api/auth/logout         # Logout user
```

### **Reservations**

```
GET    /api/reservation-settings    # Get settings
PUT    /api/reservation-settings    # Update settings
POST   /api/reservation             # Create booking
GET    /api/tables                  # List tables
```

---

## 🎨 Dashboard Features Overview

### **Orders Page** ✅

```
Features Implemented:
✓ Auto-Refresh (10s, 20s, 30s, 60s intervals)
✓ Order Timeline (Visual progress tracker)
✓ Search by Order ID, Customer Name, Mobile
✓ Filter by Order Type (Takeaway, Delivery, Table, Dine In)
✓ Filter by Status (New, Preparing, Completed, Cancelled)
✓ Real-time status updates
✓ Payment method tracking
✓ Prep time estimation
```

### **Billing Page** ✅

```
Features Implemented:
✓ Auto-Refresh (10s, 20s, 30s, 60s intervals)
✓ Search by Payment ID, Order ID, Customer, Mobile
✓ Filter by Status (All, Success, Pending, Failed)
✓ Revenue metrics dashboard
✓ Payment reconciliation
✓ Invoice generation (Print/Download)
✓ UPI QR code configuration
✓ Transaction details
```

### **Menu Page** ✅

```
Features:
✓ Category filter
✓ Add/Edit/Delete items
✓ Price management
✓ Description field
✓ Duplicate prevention
```

### **Inventory Page** ✅

```
Features:
✓ Auto-Refresh
✓ Stock level tracking
✓ Low stock alerts
✓ Search functionality
✓ Add/Edit/Delete items
```

### **Reservation Page**

```
Features:
✓ Table booking management
✓ Reservation status tracking
✓ Guest count management
```

### **Settings Page**

```
Features:
✓ Restaurant configuration
✓ Payment settings
✓ Notification preferences
✓ Access control
```

---

## 📈 Recent Updates (Latest Features)

### **High-Priority Features Added:**

#### **1. Orders Page - Complete Feature Set** ✅

- **Auto-Refresh Tool**: Toggle on/off, 4 interval options (10s-60s)
- **Order Timeline**: Visual progression tracker (Placed → Accepted → Preparing → Completed)
- **Advanced Search**: Multi-field search (Order ID, Customer Name, Mobile)
- **Combined Filters**: Order Type + Status + Search results

#### **2. Billing Page - Enhanced Features** ✅

- **Auto-Refresh Integration**: Configurable 10-60 second intervals
- **Smart Search**: Payment ID, Order ID, Customer Name, Mobile number
- **Status Filtering**: All, Success, Pending, Failed
- **Live Sync Display**: Shows last sync timestamp
- **Search Counter**: Displays matching payment count

### **Planned Features** (in progress)

- [ ] Customers - Auto-refresh + Search
- [ ] Menu - Auto-refresh + Category filter
- [ ] Offers - Status toggle + Search
- [ ] Reservation - Status timeline + Search
- [ ] Inventory - Low stock alerts + Search
- [ ] Reports - Live metrics refresh
- [ ] Settings - Configuration persistence

---

## 🔐 Authentication & Security

- **Session-based Authentication**: Secure login/logout flow
- **Password Hashing**: bcrypt for secure password storage
- **Role-based Access**: Admin, Manager, Staff, Customer roles
- **CORS Protection**: API endpoint protection
- **SQL Injection Prevention**: Parameterized queries
- **Input Validation**: Sanitization and validation on all inputs

---

## 🚨 Error Handling

The application implements comprehensive error handling:

```javascript
// API Error Response Format
{
  success: false,
  error: "Descriptive error message"
  status: 400 // HTTP status code
}

// Try-catch blocks for async operations
try {
  const data = await fetch('/api/orders');
  if (!data.ok) throw new Error(data.message);
  return data;
} catch (error) {
  console.error('Error:', error.message);
}
```

---

## 📱 Responsive Design

- **Mobile-first approach**: Optimized for all screen sizes
- **Tailwind CSS**: Responsive utility classes
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch-friendly**: Large buttons and inputs for mobile
- **Responsive Tables**: Horizontal scroll on mobile

---

## 🧪 Testing (Recommended)

### **Manual Testing**

```bash
# Test Orders page
1. Create test order
2. Verify auto-refresh
3. Test search functionality
4. Change status

# Test Billing page
1. Create test payment
2. Verify auto-refresh
3. Test search
4. Generate invoice
```

---

## 📚 Database Schema

### **Key Tables**

**Orders Table**

```sql
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  userid TEXT REFERENCES app_users(id),
  total NUMERIC,
  status VARCHAR(20),
  created_at TIMESTAMP,
  ...
);
```

**Inventory Items Table**

```sql
CREATE TABLE inventory_items (
  id TEXT PRIMARY KEY,
  name VARCHAR(100),
  current_stock INTEGER,
  min_stock INTEGER,
  category VARCHAR(80),
  ...
);
```

**Payments Table**

```sql
CREATE TABLE payments (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES orders(id),
  amount NUMERIC,
  status VARCHAR(20),
  payment_method VARCHAR(50),
  ...
);
```

---

## 🐛 Common Issues & Solutions

| Issue                      | Solution                                      |
| -------------------------- | --------------------------------------------- |
| Database connection fails  | Check DATABASE_URL in .env.local              |
| Auto-refresh not working   | Clear browser cache, check console for errors |
| Search not finding results | Verify search query matches data format       |
| Orders not updating        | Check API endpoint is responding              |
| Payment QR not generating  | Verify UPI ID format (user@bank)              |

---

## 📞 Support & Questions

For issues or questions:

1. Check error messages in browser console
2. Review API response in Network tab
3. Check database logs
4. Verify environment variables

---

## 📄 License

This project is proprietary software. All rights reserved.

---

**Last Updated**: March 23, 2026  
**Version**: 1.0.0  
**Status**: Development
