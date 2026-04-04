# 🚀 ShieldPay - Implementation Summary

ShieldPay is built as a full-stack system that combines real-time data, automation, and decision logic to protect gig workers from income loss.

## How It Works

1. User registers using phone number  
2. System stores and retrieves user data from MongoDB  
3. User verifies platform and uploads ID  
4. GPS location is captured and stored  
5. Orders are added and tracked per user  

## Core Logic

The system continuously evaluates:

- 🌧 Weather conditions  
- 📊 Daily vs average earnings  
- 📍 User location authenticity  

## Decision Engine

A scoring-based system determines payout eligibility:
