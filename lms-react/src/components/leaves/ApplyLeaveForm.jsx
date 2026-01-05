import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

const ApplyLeaveForm = ({ show, onClose, onSubmit, leaveBalances }) => {
  const [formData, setFormData] = useState({
    startDate: new Date(),
    endDate: new Date(),
    type: 'CASUAL',
    reason: ''
  });
  const [error, setError] = useState('');
  const [days, setDays] = useState(1);
  
  const leaveTypes = [
    { value: 'CASUAL', label: 'Casual Leave', balance: leaveBalances.CASUAL || 0 },
    { value: 'SICK', label: 'Sick Leave', balance: leaveBalances.SICK || 0 },
    { value: 'MATERNITY', label: 'Maternity Leave', balance: leaveBalances.MATERNITY || 0 },
    { value: 'PTO', label: 'Paid Time Off', balance: leaveBalances.PTO || 0 },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date, field) => {
    setFormData({ ...formData, [field]: date });
    
    // Calculate days difference
    if (field === 'startDate' || field === 'endDate') {
      const start = field === 'startDate' ? date : formData.startDate;
      const end = field === 'endDate' ? date : formData.endDate;
      
      if (start && end) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setDays(diffDays);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate leave balance
    const selectedType = leaveTypes.find(t => t.value === formData.type);
    if (days > selectedType.balance) {
      setError(`You only have ${selectedType.balance} days available for ${selectedType.label}`);
      return;
    }
    
    // Format dates for backend
    const formattedData = {
      ...formData,
      startDate: formData.startDate.toISOString().split('T')[0],
      endDate: formData.endDate.toISOString().split('T')[0],
    };
    
    onSubmit(formattedData);
  };

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Apply for Leave</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Leave Type</Form.Label>
                <Form.Select 
                  name="type" 
                  value={formData.type} 
                  onChange={handleChange}
                >
                  {leaveTypes.map(type => (
                    <option 
                      key={type.value} 
                      value={type.value}
                      disabled={type.balance <= 0}
                    >
                      {type.label} ({type.balance} days available)
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <div className="days-card bg-light p-3 rounded text-center">
                <h5 className="mb-0">Total Days: {days}</h5>
              </div>
            </Col>
          </Row>
          
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Start Date</Form.Label>
                <DatePicker
                  selected={formData.startDate}
                  onChange={(date) => handleDateChange(date, 'startDate')}
                  minDate={new Date()}
                  className="form-control"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>End Date</Form.Label>
                <DatePicker
                  selected={formData.endDate}
                  onChange={(date) => handleDateChange(date, 'endDate')}
                  minDate={formData.startDate}
                  className="form-control"
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-3">
            <Form.Label>Reason</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
              placeholder="Briefly describe the reason for your leave"
            />
          </Form.Group>
          
          <div className="d-flex justify-content-end">
            <Button variant="secondary" className="me-2" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit Application
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ApplyLeaveForm;