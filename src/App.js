import React from 'react'
import { Route, Routes } from 'react-router'
import HomePage from './pages/HomePage';
import './App.css';
import { AuthProvider } from './auth';
import PrivateRoute from './pages/PrivateRoute';
import Contact from './pages/Contact';
import LandingContainer from './pages/LandingContainer';
import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';
import Login from './pages/Login';

export default function App() {
  return (
    <>
    <AuthProvider>
    <Routes>
      <Route path="/" element={<LandingContainer />}>
        <Route exact path="/" element={<LandingPage />} />
        <Route path="contact" element={<Contact />} />
      </Route>
      <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
    </Routes>
    </AuthProvider>
    </>
  );
}