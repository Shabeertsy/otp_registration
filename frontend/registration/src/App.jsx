import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Registration from './pages/Regstration';
import Landing from './pages/Landing';
import PhoneLogin from './pages/PhoneLogin';
import Home from './pages/Home';



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/register" element={<Registration />} />
        <Route path="/phone-login" element={<PhoneLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />

      </Routes>
    </BrowserRouter>
  )
}
