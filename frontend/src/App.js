import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Groups from './pages/Groups';
import GroupDetails from './pages/GroupDetails';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import './styles/index.css';

import Layout from './components/Layout';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

function AppRoutes() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route path="/" element={token ? <Navigate to="/dashboard" /> : <LandingPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/groups" 
        element={
          <PrivateRoute>
            <Groups />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/group/:groupId" 
        element={
          <PrivateRoute>
            <GroupDetails />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/payments" 
        element={
          <PrivateRoute>
            <Payments />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/reports" 
        element={
          <PrivateRoute>
            <Reports />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
