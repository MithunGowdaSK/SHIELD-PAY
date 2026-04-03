import { Routes, Route } from "react-router-dom";

import Splash from "./pages/Splash";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Otp from "./pages/Otp";
import Platform from "./pages/Platform";
import Location from "./pages/Location";
import Income from "./pages/Income";
import Plans from "./pages/Plans";
import Payment from "./pages/Payment";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Weather from "./pages/Weather";
import Disruption from "./pages/Disruption";
import Approval from "./pages/Approval";
import Payout from "./pages/Payout";
import AIRisk from "./pages/AIRisk";
import FraudResult from "./pages/FraudResult";
import ProfileSetup from "./pages/ProfileSetup";
import SecurityCheck from "./pages/SecurityCheck";
// Ensure this component is imported
import FinalVerification from "./pages/FinalVerification"; 

export default function App() {
  return (
    <Routes>
      {/* MAIN FLOW */}
      <Route path="/" element={<Splash />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/otp" element={<Otp />} />
      <Route path="/platform" element={<Platform />} />
      <Route path="/location" element={<Location />} />
      <Route path="/income" element={<Income />} />
      <Route path="/plans" element={<Plans />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* FEATURES */}
      <Route path="/orders" element={<Orders />} />
      <Route path="/weather" element={<Weather />} />
      <Route path="/disruption" element={<Disruption />} />
      <Route path="/approval" element={<Approval />} />
      <Route path="/payout" element={<Payout />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/security" element={<SecurityCheck />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />

      {/* EXTRA */}
      <Route path="/risk" element={<AIRisk />} />
      <Route path="/fraud" element={<FraudResult />} />
      
      {/* Moved inside the Routes block */}
      <Route path="/final" element={<FinalVerification />} />
    </Routes>
  );
}