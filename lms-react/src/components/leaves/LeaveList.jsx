import React from 'react';
import { Table, Button } from 'react-bootstrap';
import LeaveStatusBadge from './LeaveStatusBadge';

const LeaveList = ({ leaves, onWithdraw, showActions = true }) => {
  // SAFETY CHECK: if leaves is not an array, return empty state
  if (!Array.isArray(leaves) || leaves.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted">No leave records found</p>
      </div>
    );
  }

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Type</th>
          <th>Days</th>
          <th>Status</th>
          {showActions && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {leaves.map((leave) => (
          <tr key={leave.id}>
            <td>{new Date(leave.startDate).toLocaleDateString()}</td>
            <td>{new Date(leave.endDate).toLocaleDateString()}</td>
            <td>{leave.type}</td>
            <td>
              {Math.ceil(
                (new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)
              ) + 1}
            </td>
            <td>
              <LeaveStatusBadge status={leave.status} />
            </td>
            {showActions && (
              <td>
                {leave.status === 'PENDING' && (
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => onWithdraw(leave.id)}
                  >
                    Withdraw
                  </Button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default LeaveList;
