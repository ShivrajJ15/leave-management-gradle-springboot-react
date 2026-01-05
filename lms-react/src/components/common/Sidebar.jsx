import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Sidebar = ({ role, activeTab, setActiveTab }) => {
  const employeeItems = [
    { id: 'dashboard', title: 'Dashboard', icon: 'speedometer2' },
    { id: 'leaves', title: 'My Leaves', icon: 'calendar' }
  ];

  const managerItems = [
    { id: 'dashboard', title: 'Dashboard', icon: 'speedometer2' },
    { id: 'leaves', title: 'Team Leaves', icon: 'calendar' },
    { id: 'team', title: 'My Team', icon: 'people' }
  ];

  const adminItems = [
    { id: 'policies', title: 'Leave Policies', icon: 'file-earmark-text' },
    { id: 'users', title: 'User Management', icon: 'person-lines-fill' },
    { id: 'reports', title: 'Reports', icon: 'bar-chart' }
  ];

  const getItems = () => {
    switch (role) {
      case 'ADMIN':
        return adminItems;
      case 'MANAGER':
        return managerItems;
      default:
        return employeeItems;
    }
  };

  const items = getItems();

  return (
    <div className="sidebar d-none d-lg-block">
      <Nav className="flex-column mt-3">
        {items.map((item) => (
          <Nav.Item key={item.id}>
            <Nav.Link 
              as={Link} 
              to="#" 
              active={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
              className={`d-flex align-items-center ${activeTab === item.id ? 'active' : ''}`}
            >
              <i className={`bi bi-${item.icon} me-3`}></i>
              {item.title}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;