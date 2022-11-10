import React from 'react';
import { Route, Routes } from 'react-router';
import HomePage from './pages/HomePage';
import './App.css';
import { AuthProvider } from './auth';
import PrivateRoute from './pages/PrivateRoute';
import Contact from './pages/Contact';
import LandingContainer from './pages/LandingContainer';
import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import HomeLanding from './pages/HomeLanding';
import Groups from './pages/Groups';
import Group from './pages/Group';

export const isToday = date => {
  const d = new Date(date)
  const today = new Date();
  return (d.getDate() === today.getDate() && 
  d.getMonth() === today.getMonth() && 
  d.getFullYear() === today.getFullYear())
}

export default function App() {
  return (
      <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingContainer />}>
          <Route exact path="/" element={<LandingPage />} />
          <Route path="contact" element={<Contact />} />
        </Route>
        <Route path="/home" element={<PrivateRoute><HomeLanding /></PrivateRoute>}>
          <Route exact path="/home" element={<HomePage />} />
          <Route path="/home/groups" element={<Groups />} />
          <Route path="/home/groups/:groupID" element={<Group />} />
        </Route>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      </AuthProvider>
  );
}