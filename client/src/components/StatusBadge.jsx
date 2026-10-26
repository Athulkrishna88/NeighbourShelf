import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertTriangle, 
  CheckCheck, 
  EyeOff, 
  HelpCircle 
} from 'lucide-react';

export default function StatusBadge({ status }) {
  const getBadgeConfig = () => {
    switch (status) {
      case 'available':
        return { label: 'Available Now', className: 'badge-available', icon: CheckCircle2 };
      case 'on_loan':
        return { label: 'On Loan', className: 'badge-on_loan', icon: Clock };
      case 'hidden':
        return { label: 'Temporarily Hidden', className: 'badge-hidden', icon: EyeOff };
      case 'pending':
        return { label: 'Pending Approval', className: 'badge-pending', icon: Clock };
      case 'approved':
        return { label: 'Active Loan (Approved)', className: 'badge-approved', icon: CheckCircle2 };
      case 'declined':
        return { label: 'Declined', className: 'badge-declined', icon: XCircle };
      case 'cancelled':
        return { label: 'Cancelled', className: 'badge-cancelled', icon: XCircle };
      case 'returned':
        return { label: 'Returned', className: 'badge-returned', icon: CheckCheck };
      case 'overdue':
        return { label: 'Overdue!', className: 'badge-overdue', icon: AlertTriangle };
      default:
        return { label: status, className: 'badge-hidden', icon: HelpCircle };
    }
  };

  const { label, className, icon: Icon } = getBadgeConfig();

  return (
    <span className={`badge ${className}`}>
      <Icon size={12} />
      <span>{label}</span>
    </span>
  );
}
