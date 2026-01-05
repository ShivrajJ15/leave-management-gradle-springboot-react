import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Tab, Tabs, Table, Button } from 'react-bootstrap';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import LeaveList from '../leaves/LeaveList';
import axios from 'axios';
import LeaveStatusBadge from '../leaves/LeaveStatusBadge';

const ManagerDashboard = () => {
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [teamLeaves, setTeamLeaves] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pendingResponse = await axios.get('/api/v1/leaves/pending');
        setPendingLeaves(Array.isArray(pendingResponse.data) ? pendingResponse.data : []);

        const teamResponse = await axios.get('/api/v1/leaves/team');
        setTeamLeaves(Array.isArray(teamResponse.data) ? teamResponse.data : []);

        const membersResponse = await axios.get('/api/v1/users/my-team');
        setTeamMembers(Array.isArray(membersResponse.data) ? membersResponse.data : []);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchData();
  }, []);

  const handleApproveReject = async (id, status) => {
    try {
      await axios.put(`/api/v1/leaves/${id}/${status}`);
      setPendingLeaves(prev => prev.filter(leave => leave.id !== id));
      setTeamLeaves(prev =>
        prev.map(leave => (leave.id === id ? { ...leave, status } : leave))
      );
    } catch (error) {
      console.error('Error updating leave status', error);
    }
  };

  return (
    <div className="dashboard-container">
      <Header />
      <div className="d-flex">
        <Sidebar role="manager" activeTab={activeTab} setActiveTab={setActiveTab} />
        <Container fluid className="main-content py-4">
          <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
            <Tab eventKey="dashboard" title="Dashboard">
              <Row className="mb-4">
                <Col md={6}>
                  <Card className="mb-4">
                    <Card.Header>
                      <h5 className="mb-0">Pending Approvals</h5>
                    </Card.Header>
                    <Card.Body>
                      {Array.isArray(pendingLeaves) && pendingLeaves.length === 0 ? (
                        <p className="text-center text-muted">No pending leave requests</p>
                      ) : (
                        <Table hover responsive>
                          <thead>
                            <tr>
                              <th>Employee</th>
                              <th>Dates</th>
                              <th>Type</th>
                              <th>Days</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pendingLeaves.map(leave => (
                              <tr key={leave.id}>
                                <td>{leave.user?.name || 'Unknown'}</td>
                                <td>
                                  {new Date(leave.startDate).toLocaleDateString()} -{' '}
                                  {new Date(leave.endDate).toLocaleDateString()}
                                </td>
                                <td>{leave.type}</td>
                                <td>
                                  {Math.ceil(
                                    (new Date(leave.endDate) - new Date(leave.startDate)) /
                                      (1000 * 60 * 60 * 24)
                                  ) + 1}
                                </td>
                                <td>
                                  <Button
                                    variant="success"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleApproveReject(leave.id, 'approve')}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleApproveReject(leave.id, 'reject')}
                                  >
                                    Reject
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card>
                    <Card.Header>
                      <h5 className="mb-0">My Team</h5>
                    </Card.Header>
                    <Card.Body>
                      {Array.isArray(teamMembers) && teamMembers.length === 0 ? (
                        <p className="text-center text-muted">No team members</p>
                      ) : (
                        <Table hover responsive>
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Role</th>
                              <th>Leaves This Month</th>
                            </tr>
                          </thead>
                          <tbody>
                            {teamMembers.map(member => (
                              <tr key={member.id}>
                                <td>{member.name}</td>
                                <td>{member.email}</td>
                                <td>{member.role}</td>
                                <td>{member.leaveCount || 0}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="leaves" title="Team Leaves">
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Team Leave History</h5>
                </Card.Header>
                <Card.Body>
                  <LeaveList leaves={teamLeaves} showActions={false} />
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Container>
      </div>
    </div>
  );
};

export default ManagerDashboard;
