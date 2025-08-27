
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin,
  Check,
  X,
  FileText,
  AlertCircle,
  AlertTriangle // Added AlertTriangle as it's used in the outline
} from "lucide-react";
import { format } from "date-fns";
import { LeaveRequest } from "@/api/entities";
import { User as UserEntity } from "@/api/entities"; // Added User entity import
import { Alert, AlertDescription } from "@/components/ui/alert"; // Added Alert components

const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  'Approved': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  'Cancelled': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
};

const leaveTypeColors = {
  'Annual Leave': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  'Sick Leave': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  'Cultural Leave': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
  'Bereavement Leave': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  'Maternity Leave': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
  'Paternity Leave': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
  'Emergency Leave': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
  'Unpaid Leave': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
};

export default function LeaveRequestModal({ request, isOpen, onClose, employee, onUpdate }) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionInput, setShowRejectionInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Added state for current user

  React.useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const user = await UserEntity.me(); // Call to fetch current user details
        setCurrentUser(user);
      } catch (error) {
        console.error("Error loading current user:", error);
        // Optionally handle error, e.g., show a toast notification
      }
    };
    if (isOpen) { // Load user only when the modal is open
      loadCurrentUser();
    }
  }, [isOpen]); // Depend on isOpen to re-fetch when modal opens

  if (!request) return null;

  // Determine if the current user has permission to approve/reject
  const canApproveLeave = currentUser && currentUser.role === 'General Manager';

  const handleStatusUpdate = async (leaveId, newStatus, reason = null) => {
    setIsProcessing(true);
    try {
      const updateData = {
        status: newStatus,
        approved_date: new Date().toISOString(),
        approved_by: currentUser?.full_name || 'General Manager', // Use current user's full name
        ...(reason && { rejection_reason: reason })
      };
      
      await LeaveRequest.update(leaveId, updateData);
      if(onUpdate) onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating leave status:", error);
      alert("Failed to update leave request. Please try again.");
    }
    setIsProcessing(false);
  };

  const handleApprove = () => {
    handleStatusUpdate(request.id, 'Approved');
  };

  const handleReject = () => {
    if (rejectionReason.trim()) {
      handleStatusUpdate(request.id, 'Rejected', rejectionReason);
    } else {
      alert("Please provide a reason for rejection.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-0">
        <DialogHeader className="border-b border-gray-200 dark:border-slate-700 pb-4">
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            Leave Request Details
          </DialogTitle>
        </DialogHeader>
        <div className="py-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              {employee?.first_name?.[0]?.toUpperCase() || 'U'}{employee?.last_name?.[0]?.toUpperCase() || ''}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                {employee?.first_name || 'Unknown'} {employee?.last_name || 'Employee'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {employee?.position || 'Unknown Position'} • {employee?.department || 'Unknown Department'}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Badge className={statusColors[request.status]}>{request.status}</Badge>
            <Badge className={leaveTypeColors[request.leave_type] || leaveTypeColors['Annual Leave']}>{request.leave_type}</Badge>
          </div>
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>
                  {format(new Date(request.start_date), 'MMM d')} - {format(new Date(request.end_date), 'MMM d, yyyy')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{request.total_days} day{request.total_days !== 1 ? 's' : ''}</span>
              </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Reason</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{request.reason}</p>
              </div>
            </div>
            {request.cultural_context && request.cultural_context !== 'Not Applicable' && (
                <div className="flex items-start gap-2">
                  <span className="text-sm mt-0.5">🏝️</span>
                  <div>
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Cultural Context</p>
                    <p className="text-sm text-purple-600 dark:text-purple-400">{request.cultural_context}</p>
                  </div>
                </div>
              )}
          </div>
          
          {request.status === 'Pending' && (
             <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-600">
                {!canApproveLeave ? ( // Display alert if user cannot approve
                  <Alert className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Only the General Manager has permission to take action on this request.
                      {currentUser && (
                        <span className="block mt-2 text-sm">
                          Your role: {currentUser.role}
                        </span>
                      )}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    {showRejectionInput ? (
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Please provide a reason for rejection..."
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="bg-white/70 dark:bg-slate-700/70"
                        />
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={handleReject} 
                            disabled={!rejectionReason.trim() || isProcessing} 
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            {isProcessing ? 'Processing...' : 'Confirm Rejection'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => {setShowRejectionInput(false); setRejectionReason('');}}
                            disabled={isProcessing}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-end">
                        <Button 
                          size="sm" 
                          onClick={handleApprove} 
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={isProcessing}
                        >
                          <Check className="w-4 h-4 mr-1" /> 
                          {isProcessing ? 'Processing...' : 'Approve'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setShowRejectionInput(true)} 
                          className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
                          disabled={isProcessing}
                        >
                          <X className="w-4 h-4 mr-1" /> Reject
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
          )}

          {request.rejection_reason && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">Rejection Reason</p>
                  <p className="text-sm text-red-600 dark:text-red-400">{request.rejection_reason}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
