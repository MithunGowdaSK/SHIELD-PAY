# 🏗️ ShieldPay System Architecture

## Complete Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER JOURNEY                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────┐
│   SPLASH    │ (3 seconds)
└──────┬──────┘
       ↓
┌──────────────────────────────────┐
│   REGISTER PAGE                  │
│  Step 1: Enter Phone (10 digits) │
└──────┬───────────────────────────┘
       │ POST /api/users/register
       ↓
┌──────────────────────────────────────────┐
│   MONGODB CHECK                          │
│  ├─ IF NEW USER → Continue to Step 2    │
│  └─ IF EXISTS → Load data & goto dash   │
└──────┬───────────────────────────────────┘
       │ (for new users)
       ↓
┌──────────────────────────────────┐
│   REGISTER PAGE                  │
│  Step 2: Enter Name + City       │
│  PUT /api/users/:phone           │
└──────┬───────────────────────────┘
       │ Data saved to MongoDB ✅
       ↓
┌──────────────────────────────────┐
│   PLATFORM VERIFICATION          │
│  - Select Platform               │
│  - Upload Worker ID Proof        │
└──────┬───────────────────────────┘
       ↓
┌──────────────────────────────────┐
│   LOCATION PERMISSION            │
│  - Get GPS coordinates           │
│  - Store in MongoDB              │
└──────┬───────────────────────────┘
       ↓
┌──────────────────────────────────┐
│   SELECT INCOME TYPE             │
│  - Delivery orders               │
│  - Freelance work                │
└──────┬───────────────────────────┘
       ↓
┌──────────────────────────────────┐
│   SELECT PLANS                   │
│  - Basic/Standard/Premium        │
└──────┬───────────────────────────┘
       ↓
┌──────────────────────────────────┐
│   PAYMENT                        │
│  - UPI/Card/Wallet               │
│  POST /api/users/:phone/plan     │
└──────┬───────────────────────────┘
       │ Plan saved to MongoDB ✅
       ↓
┌──────────────────────────────────┐
│   DASHBOARD (HOME)               │
│  - Greeting with user name       │
│  - Today's earnings              │
│  - Weekly statistics             │
│  - Weather insights              │
│  - Plan status                   │
└──────┬───────────────────────────┘
       │
       ├─→ ORDERS
       │   POST /api/users/:phone/orders
       │   └─ Orders saved to MongoDB ✅
       │
       ├─→ WEATHER
       │   └─ AI analysis
       │
       ├─→ PAYOUTS
       │   POST /api/users/:phone/payouts
       │   └─ Payouts saved to MongoDB ✅
       │
       └─→ WALLET
           POST /api/users/:phone/wallet
           └─ Balance + topups in MongoDB ✅
```

---

## 🗄️ MongoDB Data Model

```javascript
User Collection:
{
  _id: ObjectId,
  
  // AUTHENTICATION
  phone: "9999999999" (unique index),
  
  // PROFILE
  name: "John Doe",
  city: "Bangalore",
  
  // PLATFORM VERIFICATION
  platform: "Zomato",
  workerId: "ZMT12345678",
  proofUrl: "/uploads/proof.jpg",
  
  // LOCATION
  latitude: 28.7041,
  longitude: 77.1025,
  lastLocation: {
    latitude: 28.7041,
    longitude: 77.1025,
    timestamp: Date
  },
  
  // SUBSCRIPTION
  plan: {
    name: "Premium",
    price: 50,
    coverage: 2000,
    startDate: Date
  },
  
  // ORDERS (Array - Add items with $push)
  orders: [
    {
      id: "ORD123456",
      amount: 450,
      date: Date,
      latitude: 28.7041,
      longitude: 77.1025,
      platform: "Zomato",
      suspicious: false
    },
    // ... more orders
  ],
  
  // PAYOUTS (Array - Add items with $push)
  payouts: [
    {
      id: "PAY123456",
      amount: 1200,
      date: Date,
      triggeredBy: "Weather Disruption",
      status: "completed"
    },
    // ... more payouts
  ],
  
  // WALLET
  wallet: {
    balance: 5000,
    topUps: [
      {
        amount: 500,
        date: Date,
        reason: "Rain top-up"
      }
    ]
  },
  
  // METADATA
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🌐 API Architecture

```
BASE_URL: http://localhost:5000/api

USER ROUTES (/api/users)
├── POST   /register                  → Create/check user
├── GET    /phone/:phone              → Get user by phone
├── PUT    /:phone                    → Update profile
├── POST   /:phone/orders             → Add order
├── GET    /:phone/orders             → Get all orders
├── POST   /:phone/payouts            → Add payout
├── GET    /:phone/payouts            → Get all payouts
├── POST   /:phone/plan               → Update plan
└── POST   /:phone/wallet             → Update wallet

PLATFORM ROUTES (/api/platform)
├── POST   /                          → Register platform
├── GET    /:id                       → Get platform
└── PUT    /:id                       → Update platform

PAYOUT ROUTES (/api/payouts)
└── ... (additional payout endpoints)

PLAN ROUTES (/api/plans)
└── ... (plan endpoints)

ORDER ROUTES (/api/orders)
└── ... (order endpoints)
```

---

## 💾 Data Storage Strategy

```
┌────────────────────────────────────────┐
│         FRONTEND (React)               │
│  ┌──────────────────────────────────┐  │
│  │   localStorage (Fast Access)     │  │
│  │  ├─ phone                        │  │
│  │  ├─ userId                       │  │
│  │  ├─ name, city                   │  │
│  │  ├─ plan                         │  │
│  │  ├─ orders (optional sync)       │  │
│  │  └─ payouts (optional sync)      │  │
│  └──────────────────────────────────┘  │
└────────────────┬───────────────────────┘
                 │ (API Calls)
         ┌───────▼────────┐
         │  Express Server│
         │  :5000         │
         └───────┬────────┘
                 │ (Mongoose)
         ┌───────▼────────────────────┐
         │   MongoDB Database         │
         │  ├─ Users Collection       │
         │  ├─ Persistent Storage     │
         │  ├─ Full Order History     │
         │  ├─ Payout Records         │
         │  └─ Wallet Balance         │
         └────────────────────────────┘
```

---

## 🔄 Update Patterns Used in MongoDB

```javascript
// 1. ADD TO ARRAY (orders, payouts, topups)
User.findOneAndUpdate(
  { phone: "9999999999" },
  { $push: { orders: newOrder } },
  { new: true }
)

// 2. UPDATE SINGLE FIELD (plan, name, city)
User.findOneAndUpdate(
  { phone: "9999999999" },
  { $set: { plan: newPlan, updatedAt: Date.now() } },
  { new: true }
)

// 3. INCREMENT FIELD (wallet balance)
user.wallet.balance += amount;
await user.save();

// 4. GET FULL USER
User.findOne({ phone: "9999999999" })
```

---

## 🎯 Key Features Implemented

### ✅ Registration System
- Phone-based unique identification
- Two-step registration (phone → profile)
- Returning user detection
- Automatic data loading

### ✅ Data Persistence
- All user data stored in MongoDB
- Non-relational (flexible schema)
- Timestamps on all records
- Automatic updatedAt tracking

### ✅ Order Management
- Add orders with GPS coordinates
- Fraud detection flag
- Platform association
- Complete order history

### ✅ Payout System
- Record payouts with trigger reason
- Status tracking (pending/completed)
- Full payout history
- Amount tracking

### ✅ Plan Management
- Store active plan details
- Plan start date
- Coverage limits
- Renewal tracking

### ✅ Wallet System
- Balance tracking
- Top-up history with reasons
- Transaction records
- Multi-device access

---

## 🚀 How It Works: User Experience

### First Time User
```
1. Opens app → Splash screen
2. Taps "Register" → Enters phone 10999999999
3. API checks MongoDB → NOT FOUND (new user)
4. Enters name "Raj" + city "Delhi"
5. Data saved to MongoDB ✅
6. Completes platform verification
7. Dashboard shows: "Hello Raj 👋"
```

### Returning User (Next Day)
```
1. Opens app → Splash screen
2. Taps "Register" → Enters phone 10999999999
3. API checks MongoDB → FOUND (existing user)
4. Loads: name, city, plan, orders, payouts ✅
5. Toast: "Welcome back, Raj!" 
6. Redirects to Dashboard
7. All previous data displayed instantly
```

### Adding New Order
```
1. User adds order for ₹450
2. API: POST /api/users/:phone/orders
3. MongoDB: $push order to orders array
4. Order saved with timestamp & location
5. User sees order in history
6. Data persists forever ✅
```

---

## 🔐 Security Considerations

✅ **Phone Unique Index**: No duplicate registrations
✅ **Timestamps**: Audit trail of all changes
✅ **Suspicious Flag**: Fraud detection markers
✅ **Status Tracking**: Know state of each payout
✅ **Immutable Records**: Orders/payouts never deleted
✅ **User Association**: Everything linked to phone

---

## 📊 Database Queries Reference

```javascript
// Find user
User.findOne({ phone: "9999999999" })

// Get all orders for user
User.findOne({ phone }, { orders: 1 })

// Get user's total earnings
User.findOne({ phone }).then(u => 
  u.orders.reduce((sum, o) => sum + o.amount, 0)
)

// Get latest payout
User.findOne({ phone }, { payouts: { $slice: -1 } })

// Get wallet balance
User.findOne({ phone }, { "wallet.balance": 1 })

// Count total orders
User.findOne({ phone }).then(u => u.orders.length)

// Find fraudulent orders
User.findOne(
  { phone, "orders.suspicious": true },
  { "orders.$": 1 }
)
```

---

## 🎊 System Ready!

Your ShieldPay app now has:
- ✅ Complete MongoDB backend
- ✅ Persistent user registration
- ✅ Full data storage for orders, payouts, plans
- ✅ Automatic user detection (new vs returning)
- ✅ Multi-endpoint API
- ✅ Frontend integration

**Users will NEVER lose their data! 🎉**
