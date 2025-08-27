import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, HelpCircle, User } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  'Approved': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  'Open': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  'Resolved': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
};

const culturalLeaveTypes = {
  'Cultural Leave': '🏝️',
  'Bereavement Leave': '🕊️',
  'Annual Leave': '🏖️',
  'Sick Leave': '🏥'
};

export default function RecentActivity({ leaveRequests = [], supportTickets = [], onActivityClick }) {
  const combinedActivity = [
    ...leaveRequests.map(req => ({
      ...req,
      type: 'leave',
      id: req.id,
      title: `${req.leave_type} Request`,
      subtitle: `${req.total_days} days - ${req.cultural_context || 'Standard request'}`,
      status: req.status,
      date: req.created_date,
      icon: Calendar,
      cultural: req.cultural_context !== 'Not Applicable'
    })),
    ...supportTickets.map(ticket => ({
      ...ticket,
      type: 'ticket',
      id: ticket.id,
      title: ticket.subject,
      subtitle: ticket.category,
      status: ticket.status,
      date: ticket.created_date,
      icon: HelpCircle,
      cultural: ticket.cultural_sensitivity_flag
    }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);

  return (
    <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-xl">
      <CardHeader className="border-b border-gray-100 dark:border-slate-700">
        <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-white">
          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100 dark:divide-slate-700">
          {combinedActivity.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium mb-1">No recent activity</p>
              <p className="text-sm">Activity will appear here as employees interact with the system</p>
            </div>
          ) : (
            combinedActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div 
                  key={`${activity.type}-${activity.id}-${index}`} 
                  className="p-4 hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                  onClick={() => onActivityClick(activity)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-xl ${
                      activity.type === 'leave' 
                        ? 'bg-gradient-to-r from-blue-500 to-teal-500' 
                        : 'bg-gradient-to-r from-orange-500 to-red-500'
                    } shadow-lg`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white truncate">
                            {activity.title}
                            {activity.cultural && (
                              <span className="ml-2 text-sm">🏝️</span>
                            )}
                          </h4>
                          <Link 
                            to={activity.type === 'leave' 
                              ? createPageUrl(`LeaveManagement?leave_type=${encodeURIComponent(activity.leave_type)}`)
                              : createPageUrl(`Support?category=${encodeURIComponent(activity.subtitle)}`)
                            }
                            onClick={(e) => e.stopPropagation()}
                            className="inline-block"
                          >
                            <Badge variant="outline" className="mt-1 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors">
                              {activity.type === 'leave' ? activity.leave_type : activity.subtitle}
                            </Badge>
                          </Link>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <Badge 
                            variant="secondary"
                            className={statusColors[activity.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}
                          >
                            {activity.status}
                          </Badge>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {format(new Date(activity.date), 'MMM d')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}