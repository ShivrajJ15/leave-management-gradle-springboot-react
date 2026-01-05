import React from 'react';
import { Card } from 'react-bootstrap';

const StatsCard = ({ title, value, icon, color = 'primary' }) => {
  return (
    <Card className="stats-card">
      <Card.Body className="d-flex align-items-center">
        <div className={`bg-${color} text-white rounded-circle d-flex align-items-center justify-content-center me-3`} 
             style={{ width: '50px', height: '50px' }}>
          <i className={`bi bi-${icon} fs-4`}></i>
        </div>
        <div>
          <div className="stats-value">{value}</div>
          <div className="stats-title">{title}</div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatsCard; // Default export