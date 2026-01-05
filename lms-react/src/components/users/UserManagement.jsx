import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [managerId, setManagerId] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/v1/users');
        const data = response.data;

        if (Array.isArray(data)) {
          setUsers(data);
        } else if (Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          console.error('Unexpected users data format:', data);
        }
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };
    fetchUsers();
  }, []);

  const handleManagerChange = (user) => {
    setSelectedUser(user);
    setManagerId(user.manager?.id || '');
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`/api/v1/users/${selectedUser.id}/manager`, { managerId });
      const updatedUsers = users.map(u => 
        u.id === selectedUser.id ? { ...u, manager: users.find(m => m.id === managerId) } : u
      );
      setUsers(updatedUsers);
      setShowModal(false);
    } catch (error) {
      console.error('Error updating manager', error);
    }
  };

  return (
    <div>
      <h4 className="mb-4">User Management</h4>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Manager</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.manager?.name || 'None'}</td>
              <td>
                <Button 
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleManagerChange(user)}
                >
                  Change Manager
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Manager for {selectedUser?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Select Manager</Form.Label>
            <Form.Select 
              value={managerId} 
              onChange={(e) => setManagerId(e.target.value)}
            >
              <option value="">No Manager</option>
              {users
                .filter(u => u.role === 'MANAGER')
                .map(manager => (
                  <option key={manager.id} value={manager.id}>
                    {manager.name}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}