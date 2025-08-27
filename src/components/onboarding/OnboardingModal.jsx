
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  GraduationCap,
  Users,
  Shield,
  Heart,
  Building
} from "lucide-react";
import { format } from "date-fns";
import { Employee } from "@/api/entities";

const onboardingTasks = [
  {
    id: 'welcome_package',
    title: 'Welcome Package & Orientation',
    description: 'Provide welcome materials and company overview',
    icon: Heart,
    category: 'Welcome',
    dueDay: 1
  },
  {
    id: 'documentation',
    title: 'Complete Employment Documentation',
    description: 'Tax forms, emergency contacts, banking details',
    icon: FileText,
    category: 'Documentation',
    dueDay: 3
  },
  {
    id: 'cultural_orientation',
    title: 'Marshall Islands Cultural Orientation',
    description: 'Local customs, cultural sensitivity, and workplace norms',
    icon: Building,
    category: 'Cultural',
    dueDay: 5
  },
  {
    id: 'safety_training',
    title: 'Safety & Compliance Training',
    description: 'Workplace safety, emergency procedures, compliance policies',
    icon: Shield,
    category: 'Safety',
    dueDay: 7
  },
  {
    id: 'role_training',
    title: 'Role-Specific Training',
    description: 'Job-specific skills and responsibilities',
    icon: GraduationCap,
    category: 'Training',
    dueDay: 14
  },
  {
    id: 'team_integration',
    title: 'Team Integration Activities',
    description: 'Meet team members, understand workflows',
    icon: Users,
    category: 'Integration',
    dueDay: 21
  }
];

export default function OnboardingModal({ employee, isOpen, onClose, onUpdate }) {
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (employee) {
      setCompletedTasks(new Set(employee.onboarding_completed_tasks || []));
    }
  }, [employee]);
  
  if (!employee) return null;

  const daysSinceStart = Math.floor((new Date() - new Date(employee.start_date)) / (1000 * 60 * 60 * 24));
  
  const handleTaskToggle = (taskId, completed) => {
    const newCompleted = new Set(completedTasks);
    if (completed) {
      newCompleted.add(taskId);
    } else {
      newCompleted.delete(taskId);
    }
    setCompletedTasks(newCompleted);
  };

  const handleSaveProgress = async () => {
    setIsSaving(true);
    try {
      const completedTasksArray = Array.from(completedTasks);
      await Employee.update(employee.id, { onboarding_completed_tasks: completedTasksArray });
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error saving onboarding progress:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const getTaskStatus = (task) => {
    if (completedTasks.has(task.id)) return 'completed';
    if (daysSinceStart >= task.dueDay) return 'overdue';
    if (daysSinceStart >= task.dueDay - 2) return 'due';
    return 'pending';
  };

  const statusColors = {
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    due: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    pending: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  };

  const progress = (completedTasks.size / onboardingTasks.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-0">
        <DialogHeader className="border-b border-gray-200 dark:border-slate-700 pb-6">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-orange-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-xl">
              {employee.first_name?.[0]?.toUpperCase()}{employee.last_name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {employee.first_name} {employee.last_name} - Onboarding
              </DialogTitle>
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-400">
                  {employee.position} • {employee.department} • {employee.location}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Started {format(new Date(employee.start_date), 'MMMM d, yyyy')} • Day {daysSinceStart} of onboarding
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {completedTasks.size} of {onboardingTasks.length} tasks completed
            </p>
          </div>
        </DialogHeader>

        <div className="py-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Onboarding Checklist
            </h3>
            
            <div className="space-y-3">
              {onboardingTasks.map((task) => {
                const Icon = task.icon;
                const status = getTaskStatus(task);
                const isCompleted = completedTasks.has(task.id);
                
                return (
                  <div key={task.id} className={`p-4 rounded-xl border transition-all ${
                    isCompleted 
                      ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' 
                      : 'bg-white dark:bg-slate-700/50 border-gray-200 dark:border-slate-600'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={isCompleted}
                          onCheckedChange={(checked) => handleTaskToggle(task.id, checked)}
                          className="mt-1"
                        />
                        <div className={`p-2 rounded-lg ${
                          isCompleted 
                            ? 'bg-green-500' 
                            : status === 'overdue' 
                            ? 'bg-red-500' 
                            : status === 'due'
                            ? 'bg-yellow-500'
                            : 'bg-gray-400'
                        }`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className={`font-medium ${
                            isCompleted 
                              ? 'text-green-900 dark:text-green-100 line-through' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {task.title}
                          </h4>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge className={statusColors[status]}>
                              {status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                              {status === 'overdue' && 'Overdue'}
                              {status === 'due' && 'Due Soon'}
                              {status === 'pending' && 'Pending'}
                              {status === 'completed' && 'Complete'}
                            </Badge>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Day {task.dueDay}
                            </span>
                          </div>
                        </div>
                        <p className={`text-sm ${
                          isCompleted 
                            ? 'text-green-700 dark:text-green-300' 
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {task.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {employee.cultural_considerations && employee.cultural_considerations.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-xl">🏝️</span>
                Cultural Considerations
              </h3>
              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                <div className="flex flex-wrap gap-2 mb-3">
                  {employee.cultural_considerations.map((consideration, index) => (
                    <Badge 
                      key={index}
                      variant="outline" 
                      className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700"
                    >
                      {consideration}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  These cultural considerations should be taken into account during the onboarding process to ensure cultural sensitivity and proper accommodation.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-slate-700 pt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button 
            onClick={handleSaveProgress}
            disabled={isSaving}
            className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700"
          >
            {isSaving ? "Saving..." : "Save Progress"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
