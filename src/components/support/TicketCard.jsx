import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  User, 
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  PlayCircle
} from "lucide-react";
import { format } from "date-fns";

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

const categoryColors = {
  'IT Support': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  'HR Policy': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
  'Payroll': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  'Benefits': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
  'Training': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
  'Cultural Issues': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
  'Workplace Concern': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  'General Inquiry': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
};

export default function TicketCard({ ticket, employee, onClick, onStatusUpdate, showActions = true }) {
  const handleStatusChange = (newStatus) => {
    onStatusUpdate(ticket.id, newStatus);
  };

  return (
    <Card 
      className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] group"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {ticket.subject}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {ticket.description}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge className={statusColors[ticket.status]}>
                  {ticket.status}
                </Badge>
                <Badge className={priorityColors[ticket.priority]}>
                  {ticket.priority}
                </Badge>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <User className="w-4 h-4" />
                <span>
                  {ticket.is_anonymous ? 'Anonymous' : `${employee?.first_name} ${employee?.last_name}`}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{format(new Date(ticket.created_date), 'MMM d, yyyy')}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Badge className={categoryColors[ticket.category] || categoryColors['General Inquiry']}>
                  {ticket.category}
                </Badge>
              </div>
            </div>

            {ticket.cultural_sensitivity_flag && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm">🏝️</span>
                <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                  Cultural sensitivity flagged
                </span>
              </div>
            )}

            {ticket.assigned_to && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Assigned to: {ticket.assigned_to}
                  </span>
                </div>
              </div>
            )}

            {ticket.resolution && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    Resolution
                  </span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {ticket.resolution}
                </p>
              </div>
            )}

            {showActions && ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
              <div className="pt-3 border-t border-gray-100 dark:border-slate-600 flex gap-2">
                {ticket.status === 'Open' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange('In Progress');
                    }}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-700 dark:hover:bg-blue-900/20"
                  >
                    <PlayCircle className="w-3 h-3 mr-1" />
                    Start Work
                  </Button>
                )}
                
                {(ticket.status === 'In Progress' || ticket.status === 'Pending Response') && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange('Resolved');
                    }}
                    className="text-green-600 border-green-200 hover:bg-green-50 dark:text-green-400 dark:border-green-700 dark:hover:bg-green-900/20"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Resolve
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}