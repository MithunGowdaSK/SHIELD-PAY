# 🏗️ ShieldPay System Architecture

## Overview

ShieldPay is a full-stack system that connects frontend, backend, and real-time data sources to automate insurance payouts.

---

## Flow

User → Frontend → Backend → MongoDB  
         ↓  
   Weather API + GPS  
         ↓  
   Decision Engine  
         ↓  
   Payout System  

---

## Core Components

### 1. Frontend
- User interaction (React)
- Captures input, location, orders

### 2. Backend
- Express API
- Handles logic and validation

### 3. Database
- MongoDB
- Stores users, orders, payouts

---

## Decision Engine

Evaluates:

- Weather condition  
- Income drop  
- Location authenticity  

---

## Fraud Prevention

- Base location stored  
- Live location checked  
- Distance > 6.1 km → reject  

---

## Data Model (Simplified)

User:
- phone
- profile (name, city)
- orders[]
- payouts[]
- plan
- location

---

## Key Idea

The system replaces:

❌ Manual claims  
✔️ Automated verification  

Result:

👉 Faster  
👉 Smarter  
👉 Fraud-resistant system
