# 🧪 ShieldPay Testing Guide

## Test 1: New User

1. Open app  
2. Enter phone  
3. Complete profile  
4. Verify platform  

✅ User saved in database  

---

## Test 2: Returning User

1. Enter same phone  
2. System detects user  

✅ Auto login works  

---

## Test 3: Add Orders

1. Add order  
2. Check dashboard  

✅ Order stored per user  

---

## Test 4: Payout Logic

Conditions:
- Rain present  
- Earnings drop  
- Location valid  

✅ Payout triggered  

---

## Expected Result

- Data persists per user  
- No data mixing  
- Automation works correctly  
- No manual claim required  

---

## Status

✅ All major flows tested  
✅ System ready for demo
