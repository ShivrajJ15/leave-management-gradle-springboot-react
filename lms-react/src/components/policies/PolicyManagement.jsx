import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Row, Col } from 'react-bootstrap';
import policyService from '../../services/policyService';

const PolicyManagement = () => {
  const [policies, setPolicies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPolicy, setCurrentPolicy] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    maxDays: 0,
    carryOver: false,
    maxCarryOverDays: 0
  });

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const response = await policyService.getAllPolicies();
      setPolicies(response.data);
    } catch (error) {
      console.error('Error fetching policies', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleEdit = (policy) => {
    setCurrentPolicy(policy);
    setFormData({
      type: policy.type,
      maxDays: policy.maxDays,
      carryOver: policy.carryOver,
      maxCarryOverDays: policy.maxCarryOverDays || 0
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentPolicy) {
        await policyService.updatePolicy(currentPolicy.type, formData);
      } else {
        await policyService.createPolicy(formData);
      }
      fetchPolicies();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving policy', error);
    }
  };

  const handleAddNew = () => {
    setCurrentPolicy(null);
    setFormData({
      type: '',
      maxDays: 0,
      carryOver: false,
      maxCarryOverDays: 0
    });
    setShowModal(true);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Leave Policies</h4>
        <Button variant="primary" onClick={handleAddNew}>
          Add New Policy
        </Button>
      </div>
      
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Type</th>
            <th>Max Days</th>
            <th>Carry Over</th>
            <th>Max Carry Over Days</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {policies.map(policy => (
            <tr key={policy.type}>
              <td>{policy.type}</td>
              <td>{policy.maxDays}</td>
              <td>{policy.carryOver ? 'Yes' : 'No'}</td>
              <td>{policy.maxCarryOverDays || 'N/A'}</td>
              <td>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => handleEdit(policy)}
                >
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentPolicy ? 'Edit Policy' : 'Add New Policy'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Leave Type</Form.Label>
              <Form.Select 
                name="type" 
                value={formData.type} 
                onChange={handleChange}
                disabled={!!currentPolicy}
              >
                <option value="">Select type</option>
                <option value="CASUAL">Casual Leave</option>
                <option value="SICK">Sick Leave</option>
                <option value="MATERNITY">Maternity Leave</option>
                <option value="PTO">Paid Time Off</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Max Days Per Year</Form.Label>
              <Form.Control
                type="number"
                name="maxDays"
                value={formData.maxDays}
                onChange={handleChange}
                min="0"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="carryOver"
                label="Allow Carry Over"
                checked={formData.carryOver}
                onChange={handleChange}
              />
            </Form.Group>
            
            {formData.carryOver && (
              <Form.Group className="mb-3">
                <Form.Label>Max Carry Over Days</Form.Label>
                <Form.Control
                  type="number"
                  name="maxCarryOverDays"
                  value={formData.maxCarryOverDays}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </Form.Group>
            )}
            
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Policy
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PolicyManagement;
