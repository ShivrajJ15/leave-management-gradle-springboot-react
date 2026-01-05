import React from 'react';
import { Badge } from 'react-bootstrap';

const LeaveStatusBadge = ({ status }) => {
  const getVariant = () => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'danger';
      case 'WITHDRAWN':
        return 'secondary';
      default:
        return 'primary';
    }
  };

  const getText = () => {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'APPROVED':
        return 'Approved';
      case 'REJECTED':
        return 'Rejected';
      case 'WITHDRAWN':
        return 'Withdrawn';
      default:
        return status;
    }
  };

  return (
    <Badge pill bg={getVariant()} className="text-capitalize">
      {getText()}
    </Badge>
  );
};

export default LeaveStatusBadge;