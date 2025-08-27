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
import { Label } from "@/components/ui/label";
import { 
  MessageSquare, 
  User, 
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  PlayCircle,
  X
} from "lucide-react";
import { format } from "date-fns";
import { SupportTicket } from "@/api/entities";

const statusColors = {
  'Open': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  'Pending Response': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
  'Resolved': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  'Closed': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
};

const priorityColors = {
  'Low': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  'Medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  'High': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
  'Urgent': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
};

export default function TicketModal({ ticket, isOpen, onClose, employee, onUpdate }) {
  const [resolution, setResolution] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      if (newStatus === 'Resolved' && !resolution.trim()) {
        alert('Please provide a resolution before marking as resolved');
        setIsUpdating(false);
        return;
      }
      
      const updateData = {
        status: newStatus,
        ...(newStatus === 'Resolved' && { 
          resolution: resolution,
          resolved_date: new Date().toISOString()
        })
      };
      
      await SupportTicket.update(ticket.id, updateData);
      if (onUpdate) onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating ticket status:", error);
      alert("Failed to update ticket status. Please try again.");
    }
    setIsUpdating(false);
  };

  if (!ticket) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-0">
        <DialogHeader className="border-b border-gray-200 dark:border-slate-700 pb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-orange-500 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            Support Ticket Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {ticket.subject}
              </h3>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className={statusColors[ticket.status]}>
                  {ticket.status}
                </Badge>
                <Badge className={priorityColors[ticket.priority]}>
                  {ticket.priority} Priority
                </Badge>
                <Badge variant="outline">
                  {ticket.category}
                </Badge>
                {ticket.cultural_sensitivity_flag && (
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                    🏝️ Cultural Sensitive
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Submitted by</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {ticket.is_anonymous ? 'Anonymous User' : `${employee?.first_name || 'Unknown'} ${employee?.last_name || 'User'}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Created</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {format(new Date(ticket.created_date), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {ticket.assigned_to && (
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Assigned to</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {ticket.assigned_to}
                    </p>
                  </div>
                </div>
              )}

              {ticket.resolved_date && (
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Resolved</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {format(new Date(ticket.resolved_date), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">Description</h4>
            <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>
          </div>

          {ticket.cultural_sensitivity_flag && (
            <div className="p-4 bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-2">
                <span className="text-lg">🏝️</span>
                <div>
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">
                    Cultural Sensitivity Required
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400">
                    This ticket has been flagged as involving Marshall Islands cultural practices or traditions. 
                    Please handle with appropriate cultural awareness and sensitivity.
                  </p>
                </div>
              </div>
            </div>
          )}

          {ticket.resolution && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Resolution
              </h4>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-green-700 dark:text-green-300 whitespace-pre-wrap">
                  {ticket.resolution}
                </p>
              </div>
            </div>
          )}

          {ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
            <div className="space-y-3">
              <Label htmlFor="resolution">Add Resolution</Label>
              <Textarea
                id="resolution"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="Describe how this issue was resolved..."
                className="bg-white/70 dark:bg-slate-700/70 h-24"
              />
            </div>
          )}

          {ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-slate-700">
              {ticket.status === 'Open' && (
                <Button
                  onClick={() => handleStatusChange('In Progress')}
                  disabled={isUpdating}
                  variant="outline"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-700 dark:hover:bg-blue-900/20"
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  {isUpdating ? 'Updating...' : 'Start Working'}
                </Button>
              )}

              {(ticket.status === 'In Progress' || ticket.status === 'Pending Response') && (
                <Button
                  onClick={() => handleStatusChange('Resolved')}
                  disabled={isUpdating || !resolution.trim()}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {isUpdating ? 'Resolving...' : 'Mark as Resolved'}
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}