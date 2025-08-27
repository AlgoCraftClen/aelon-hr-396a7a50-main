
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Calendar,
  MapPin,
  Building
} from "lucide-react";
import { format } from "date-fns";

const statusColors = {
  'Not Started': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  'Completed': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  'Overdue': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
};

export default function OnboardingCard({ employee, onClick }) {
  const daysSinceStart = Math.floor((new Date() - new Date(employee.start_date)) / (1000 * 60 * 60 * 24));
  
  const totalOnboardingTasks = 6; // Based on the hardcoded tasks in OnboardingModal
  const completedTasksCount = employee.onboarding_completed_tasks?.length || 0;
  const progressPercentage = totalOnboardingTasks > 0 
    ? Math.round((completedTasksCount / totalOnboardingTasks) * 100)
    : 0;

  const getStatus = () => {
    if (completedTasksCount === totalOnboardingTasks) return 'Completed';
    if (daysSinceStart > 30 && completedTasksCount < totalOnboardingTasks) return 'Overdue';
    if (completedTasksCount > 0) return 'In Progress';
    return 'Not Started';
  };

  const status = getStatus();
  const StatusIcon = status === 'Completed' ? CheckCircle : 
                   status === 'Overdue' ? AlertCircle : Clock;

  return (
    <div 
      className="p-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
          {employee.first_name?.[0]?.toUpperCase()}{employee.last_name?.[0]?.toUpperCase()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                {employee.first_name} {employee.last_name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {employee.position} • {employee.department}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge className={statusColors[status]}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {status}
              </Badge>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Started {format(new Date(employee.start_date), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Building className="w-4 h-4" />
              <span>{employee.department}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{employee.location}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">Onboarding Progress</span>
              <span className="font-medium text-gray-900 dark:text-white">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {completedTasksCount} of {totalOnboardingTasks} tasks completed
            </p>
          </div>

          {employee.cultural_considerations && employee.cultural_considerations.length > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm">🏝️</span>
              <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                Cultural considerations noted
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
