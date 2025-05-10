import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UserForm from './UserForm';
import UserList from './UserList';
import TransactionPage from './TransactionPage';
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="app-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <h1 className="sidebar-title">Admin Panel</h1>
          <nav className="nav-links">
            <Link to="/">Add User</Link>
            <Link to="/users">View Users</Link>
            <Link to="/transactions">Transaction Monitoring</Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<UserForm />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/transactions" element={<TransactionPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
