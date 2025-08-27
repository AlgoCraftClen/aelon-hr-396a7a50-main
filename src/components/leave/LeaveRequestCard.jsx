
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin,
  Check,
  X,
  FileText,
  AlertCircle,
  AlertTriangle,
  MessageSquare
} from "lucide-react";
import { format } from "date-fns";
import { User as UserEntity } from "@/api/entities";

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

export default function LeaveRequestCard({ request, employee, onStatusUpdate, showActions = false }) {
  const [showRejectionInput, setShowRejectionInput] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  React.useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        // This is a placeholder for actual user loading logic.
        // In a real application, UserEntity.me() would fetch user data from an API.
        const user = await UserEntity.me(); 
        setCurrentUser(user);
      } catch (error) {
        console.error("Error loading current user:", error);
        // Optionally, handle error state or set a default user
        setCurrentUser({ id: 'guest', role: 'Employee', first_name: 'Guest', last_name: 'User' });
      }
    };
    loadCurrentUser();
  }, []);

  const canApproveLeave = currentUser && currentUser.role === 'General Manager';

  const handleApprove = () => {
    onStatusUpdate && onStatusUpdate(request.id, 'Approved');
  };

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onStatusUpdate && onStatusUpdate(request.id, 'Rejected', rejectionReason);
      setShowRejectionInput(false);
      setRejectionReason('');
    }
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      // In a real implementation, you'd save this comment to the database
      console.log('Adding comment:', comment);
      setShowCommentInput(false);
      setComment('');
    }
  };

  return (
    <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-0 shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
            {employee?.first_name?.[0]?.toUpperCase()}{employee?.last_name?.[0]?.toUpperCase()}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {employee?.first_name} {employee?.last_name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {employee?.position} • {employee?.department}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge className={statusColors[request.status]}>
                  {request.status}
                </Badge>
                <Badge className={leaveTypeColors[request.leave_type] || leaveTypeColors['Annual Leave']}>
                  {request.leave_type}
                </Badge>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
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
              {employee?.location && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{employee.location}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Reason</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{request.reason}</p>
                </div>
              </div>

              {request.cultural_context && request.cultural_context !== 'Not Applicable' && (
                <div className="flex items-start gap-2">
                  <span className="text-sm mt-0.5">🏝️</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Cultural Context</p>
                    <p className="text-sm text-purple-600 dark:text-purple-400">{request.cultural_context}</p>
                  </div>
                </div>
              )}

              {request.rejection_reason && (
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-red-700 dark:text-red-300">Rejection Reason</p>
                    <p className="text-sm text-red-600 dark:text-red-400">{request.rejection_reason}</p>
                  </div>
                </div>
              )}

              {request.approved_by && request.status === 'Approved' && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Approved by {request.approved_by} on {format(new Date(request.approved_date), 'MMM d, yyyy')}
                </div>
              )}
            </div>

            {/* Role-based action section */}
            {showActions && request.status === 'Pending' && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-600">
                {!canApproveLeave ? (
                  <Alert className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Only the General Manager has permission to take action on this request.
                      {currentUser && currentUser.role !== 'General Manager' && (
                        <span className="block mt-2 text-sm">
                          Your role: {currentUser.role}
                        </span>
                      )}
                    </AlertDescription>
                  </Alert>
                ) : null}

                {/* Comments section for non-GM users */}
                {!canApproveLeave && currentUser && (
                  <div className="mb-4">
                    {showCommentInput ? (
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Add a comment about this leave request..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="bg-white/70 dark:bg-slate-700/70"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={handleAddComment}
                            disabled={!comment.trim()}
                            variant="outline"
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Add Comment
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setShowCommentInput(false);
                              setComment('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowCommentInput(true)}
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Add Comment
                      </Button>
                    )}
                  </div>
                )}

                {/* Approval/Rejection buttons - only for GM */}
                {canApproveLeave && (
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
                            disabled={!rejectionReason.trim()}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Confirm Rejection
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setShowRejectionInput(false);
                              setRejectionReason('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleApprove}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowRejectionInput(true)}
                          className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
