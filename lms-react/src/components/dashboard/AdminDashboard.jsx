import React, { useState } from 'react';
import { Container, Tab, Tabs } from 'react-bootstrap';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import PolicyManagement from '../policies/PolicyManagement';
import UserManagement from '../users/UserManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('policies');

  return (
    <div className="dashboard-container">
      <Header />
      <div className="d-flex">
        <Sidebar role="admin" activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <Container fluid className="main-content py-4">
          <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
            <Tab eventKey="policies" title="Leave Policies">
              <PolicyManagement />
            </Tab>
            <Tab eventKey="users" title="User Management">
              <UserManagement />
            </Tab>
            <Tab eventKey="reports" title="Reports">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Leave Reports</h5>
                  <p className="text-muted">Comprehensive reports will be available here.</p>
                  {/* Reports content would go here */}
                </div>
              </div>
            </Tab>
          </Tabs>
        </Container>
      </div>
    </div>
  );
};

export default AdminDashboard;