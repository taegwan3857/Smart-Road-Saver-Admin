import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DetectionList from './pages/DetectionList';
import DetectionDetail from './pages/DetectionDetail';
import ReportList from './pages/ReportList';
import ReportDetail from './pages/ReportDetail';
import UserList from './pages/UserList';
import UserDetail from './pages/UserDetail';
import VehicleList from './pages/VehicleList';
import VehicleDetail from './pages/VehicleDetail';
import DeviceList from './pages/DeviceList';
import DeviceDetail from './pages/DeviceDetail';

function Layout() {
  return (
    <div className="app-container">
      <aside className="sidebar"><Sidebar /></aside>
      <div className="main-wrapper">
        <header className="header"><Header /></header>
        <Outlet />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="detections" element={<DetectionList />} />
          <Route path="detections/:id" element={<DetectionDetail />} />
          <Route path="reports" element={<ReportList />} />
          <Route path="reports/:id" element={<ReportDetail />} />
          <Route path="users" element={<UserList />} />
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="vehicles" element={<VehicleList />} />
          <Route path="vehicles/:id" element={<VehicleDetail />} />
          <Route path="devices" element={<DeviceList />} />
          <Route path="devices/:id" element={<DeviceDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
