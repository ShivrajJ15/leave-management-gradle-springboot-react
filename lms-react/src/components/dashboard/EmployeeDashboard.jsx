import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Tab, Tabs } from 'react-bootstrap';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import StatsCard from '../common/StatsCard';
import ApplyLeaveForm from '../leaves/ApplyLeaveForm';
import LeaveList from '../leaves/LeaveList';
import axios from 'axios';

const EmployeeDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState({});
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leavesResponse = await axios.get('/api/v1/leaves/mine');
        const leavesData = Array.isArray(leavesResponse.data) ? leavesResponse.data : [];
        setLeaves(leavesData);

        const userResponse = await axios.get('/api/v1/users/me');
        const balances = {};
        const balanceArray = userResponse.data.leaveBalances;
        if (Array.isArray(balanceArray)) {
          balanceArray.forEach(balance => {
            balances[balance.type] = balance.balance;
          });
        }
        setLeaveBalances(balances);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  const handleApplyLeave = async (leaveData) => {
    try {
      const response = await axios.post('/api/v1/leaves/apply', leaveData);
      setLeaves([...leaves, response.data]);
      setShowApplyForm(false);

      const days =
        Math.ceil((new Date(leaveData.endDate) - new Date(leaveData.startDate)) / (1000 * 60 * 60 * 24)) + 1;

      setLeaveBalances({
        ...leaveBalances,
        [leaveData.type]: (leaveBalances[leaveData.type] || 0) - days,
      });
    } catch (error) {
      console.error('Error applying leave', error);
    }
  };

  const handleWithdraw = async (id) => {
    try {
      await axios.put(`/api/v1/leaves/${id}/withdraw`);
      const updatedLeaves = leaves.map(leave =>
        leave.id === id ? { ...leave, status: 'WITHDRAWN' } : leave
      );
      setLeaves(updatedLeaves);
    } catch (error) {
      console.error('Error withdrawing leave', error);
    }
  };

  return (
    <div className="dashboard-container">
      <Header />
      <div className="d-flex">
        <Sidebar role="employee" activeTab={activeTab} setActiveTab={setActiveTab} />

        <Container fluid className="main-content py-4">
          <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
            <Tab eventKey="dashboard" title="Dashboard">
              <Row className="mb-4">
                <Col md={3}>
                  <StatsCard title="Casual Leave" value={leaveBalances.CASUAL || 0} icon="calendar-check" color="primary" />
                </Col>
                <Col md={3}>
                  <StatsCard title="Sick Leave" value={leaveBalances.SICK || 0} icon="heart-pulse" color="success" />
                </Col>
                <Col md={3}>
                  <StatsCard title="PTO" value={leaveBalances.PTO || 0} icon="umbrella-beach" color="info" />
                </Col>
                <Col md={3}>
                  <StatsCard title="Maternity" value={leaveBalances.MATERNITY || 0} icon="baby-carriage" color="warning" />
                </Col>
              </Row>

              <Card className="mb-4">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Recent Leave Applications</h5>
                  <Button variant="primary" onClick={() => setShowApplyForm(true)}>
                    Apply for Leave
                  </Button>
                </Card.Header>
                <Card.Body>
                  <LeaveList leaves={leaves} onWithdraw={handleWithdraw} />
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="leaves" title="My Leaves">
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">My Leave History</h5>
                  <Button variant="primary" onClick={() => setShowApplyForm(true)}>
                    Apply for Leave
                  </Button>
                </Card.Header>
                <Card.Body>
                  <LeaveList leaves={leaves} onWithdraw={handleWithdraw} />
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Container>
      </div>

      <ApplyLeaveForm
        show={showApplyForm}
        onClose={() => setShowApplyForm(false)}
        onSubmit={handleApplyLeave}
        leaveBalances={leaveBalances}
      />
    </div>
  );
};

export default EmployeeDashboard;
