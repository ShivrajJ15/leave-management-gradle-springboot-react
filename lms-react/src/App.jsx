import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import EmployeeDashboard from './components/dashboard/EmployeeDashboard';
import ManagerDashboard from './components/dashboard/ManagerDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import Header from './components/common/Header';
import './index.css';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <div className="app-container">
        {user && <Header />}
        <div className="main-content">
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
            <Route 
              path="/dashboard" 
              element={user ? 
                (user.role === 'ADMIN' ? <AdminDashboard /> : 
                 user.role === 'MANAGER' ? <ManagerDashboard /> : <EmployeeDashboard />) : 
                <Navigate to="/login" />} 
            />
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;