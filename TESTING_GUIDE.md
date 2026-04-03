# 🧪 Quick Testing Guide - MongoDB Registration System

## ⚡ Quick Start

### 1. Ensure Both Servers Are Running
```bash
# Terminal 1: Backend
cd server
node server.js
# Should show: "Server running on 5000" + "MongoDB Connected 🔥"

# Terminal 2: Frontend
cd client
npm run dev
# Should show: "http://localhost:5174"
```

### 2. Open the App
```
http://localhost:5174
```

---

## 🧪 Test Case 1: Register New User

### Steps:
1. App opens → Splash screen (wait 3 seconds)
2. Automatically redirects to `/register`
3. **Enter Phone**: `9999999999`
4. Click "Continue"
5. **Enter Name**: `Test User`
6. **Enter City**: `Bangalore`
7. Click "Complete Registration"
8. Should show success animation
9. Redirects to `/platform` page

### Verify:
- ✅ New user document created in MongoDB
- ✅ Name and city saved
- ✅ Timestamp recorded

---

## 🧪 Test Case 2: Returning User Auto-Load

### Steps:
1. **Open in New Tab/Incognito Mode** (or clear localStorage)
2. Go to `http://localhost:5174`
3. Wait for Splash → Register page
4. **Enter Same Phone**: `9999999999`
5. Should see: **"Welcome back, Test User!"** ✅
6. Toast notification appears
7. Automatically redirects to Dashboard
8. Dashboard shows: **"Hello Test User 👋"**

### Verify:
- ✅ User found in MongoDB ✅
- ✅ Data loaded successfully ✅
- ✅ Auto-redirect to dashboard ✅
- ✅ All user info displayed ✅

---

## 🧪 Test Case 3: Add Order

### Steps:
1. From Dashboard, click **"My Orders"** or navigate to `/orders`
2. Click **"Add Order"** button
3. Enter:
   - Order ID: `ORD123456`
   - Amount: `450`
4. Location should be auto-captured
5. Click **"Add Order"** button
6. Toast: "Order added ✅"
7. Order appears in list

### Verify in MongoDB:
```
db.users.findOne({ phone: "9999999999" })
# Should show order in orders array:
"orders": [
  {
    "id": "ORD123456",
    "amount": 450,
    "date": "2024-04-03T...",
    "platform": "...",
    "suspicious": false
  }
]
```

---

## 🧪 Test Case 4: Add Payout

### Steps:
1. Navigate to `/payout` or click Payout button
2. Should see option to record payout
3. Enter:
   - Amount: `1200`
   - Triggered By: `Weather Disruption`
4. Click "Record Payout"
5. Toast: "Payout added ✅"

### Verify in MongoDB:
```
db.users.findOne({ phone: "9999999999" })
# Should show payout in payouts array:
"payouts": [
  {
    "id": "...",
    "amount": 1200,
    "date": "2024-04-03T...",
    "triggeredBy": "Weather Disruption",
    "status": "pending"
  }
]
```

---

## 🧪 Test Case 5: Select Plan & Save

### Steps:
1. Navigate to `/plans`
2. Select a plan (e.g., Premium - ₹50/week)
3. Navigate to `/payment`
4. Select payment method (UPI/Card/Wallet)
5. Click "Pay Now"
6. Should see success

### Verify in MongoDB:
```
db.users.findOne({ phone: "9999999999" })
# Should show plan:
"plan": {
  "name": "Premium",
  "price": 50,
  "coverage": 2000,
  "startDate": "2024-04-03T..."
}
```

---

## 📱 Test Different Phone Numbers

### Create Multiple Test Users:

**User 1:**
- Phone: `9999999999`
- Name: `Raj Kumar`
- City: `Bangalore`

**User 2:**
- Phone: `8888888888`
- Name: `Priya Singh`
- City: `Delhi`

**User 3:**
- Phone: `7777777777`
- Name: `Arjun Patel`
- City: `Mumbai`

### Verify:
1. Each user has their own document in MongoDB
2. Data is not mixed between users
3. Each phone number is unique

---

## 🔍 MongoDB Verification Commands

### Check All Users
```javascript
db.users.find({})
```

### Find Specific User
```javascript
db.users.findOne({ phone: "9999999999" })
```

### Count Total Users
```javascript
db.users.countDocuments({})
```

### Check Orders for User
```javascript
db.users.findOne(
  { phone: "9999999999" },
  { orders: 1 }
)
```

### Check Payouts for User
```javascript
db.users.findOne(
  { phone: "9999999999" },
  { payouts: 1 }
)
```

### Check User Plan
```javascript
db.users.findOne(
  { phone: "9999999999" },
  { plan: 1 }
)
```

---

## 🚨 Troubleshooting

### Issue: "MongoDB Connection Error"
**Solution:**
- Check `.env` file has correct `MONGO_URI`
- Verify MongoDB cluster is accessible
- Check internet connection
- Restart server: `node server.js`

### Issue: "User not found after registration"
**Solution:**
- Check network tab - POST to `/api/users/register` should return 200
- Check MongoDB directly if document was created
- Check browser console for errors
- Try clearing cache and retrying

### Issue: "Orders not appearing"
**Solution:**
- Verify location permission is enabled
- Check API response in network tab
- Confirm phone number is correct
- Check MongoDB if order was actually saved

### Issue: "Welcome back message not showing"
**Solution:**
- Ensure phone number is exactly the same (10 digits)
- Check MongoDB - phone should have unique index
- Try different phone number to verify it's not registered
- Check browser console for fetch errors

### Issue: "Spinner keeps spinning"
**Solution:**
- Check backend is running on 5000
- Check network tab for API errors
- Check browser console for JavaScript errors
- Restart both frontend and backend

---

## 📊 Performance Tips

### Reduce Data Transfer
```javascript
// Instead of loading all orders
db.users.findOne({ phone: "9999999999" })

// Load specific fields only
db.users.findOne(
  { phone: "9999999999" },
  { orders: 1, name: 1, city: 1 }
)
```

### Pagination for Large Arrays
```javascript
// Get last 10 orders
db.users.findOne(
  { phone: "9999999999" },
  { orders: { $slice: -10 } }
)
```

---

## ✨ Expected Results

After running all test cases:

✅ **MongoDB should have:**
- 3+ user documents
- Each with complete profile data
- Multiple orders per user
- Payouts recorded
- Plans selected
- Wallet balances

✅ **Frontend should:**
- Load user data instantly
- Show correct user name on dashboard
- Display all orders and payouts
- Remember users between sessions
- Show no errors in console

✅ **API should:**
- Respond with 200 status
- Return correct user data
- Save all changes to MongoDB
- Prevent duplicate registrations

---

## 🎯 Success Criteria

| Criteria | Status | Notes |
|----------|--------|-------|
| New user registers | ✅ | Data saved to MongoDB |
| User data persists | ✅ | Visible after refresh |
| Returning user loads | ✅ | Auto-detect from phone |
| Orders stored | ✅ | Array grows with each add |
| Payouts recorded | ✅ | Full history available |
| Plans saved | ✅ | Retrieved on dashboard |
| No data loss | ✅ | Everything in MongoDB |
| Fast loading | ✅ | Instant user recognition |

---

## 📞 Support

If you encounter any issues:

1. Check error in browser console (F12)
2. Check network tab (XHR requests)
3. Verify server logs (`terminal 1` output)
4. Check MongoDB directly using MongoDB Compass
5. Verify all .env variables are set

---

**System Ready for Testing! 🚀**
