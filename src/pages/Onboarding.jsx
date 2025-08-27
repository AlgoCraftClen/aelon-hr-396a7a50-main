import React, { useState, useEffect } from "react";
import { Employee } from "@/api/entities";
import { TrainingProgress } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  UserPlus, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileText,
  Users,
  Calendar,
  Award
} from "lucide-react";

import OnboardingCard from "../components/onboarding/OnboardingCard";
import OnboardingModal from "../components/onboarding/OnboardingModal";

export default function Onboarding() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setIsLoading(true);
    try {
      const data = await Employee.list('-start_date');
      setEmployees(data);
    } catch (error) {
      console.error("Error loading employees:", error);
    }
    setIsLoading(false);
  };

  // Filter employees for onboarding (new hires in last 90 days)
  const onboardingEmployees = employees.filter(emp => {
    const startDate = new Date(emp.start_date);
    const daysSinceStart = (new Date() - startDate) / (1000 * 60 * 60 * 24);
    return daysSinceStart <= 90 && emp.status === 'Active';
  });

  const pendingOnboarding = onboardingEmployees.filter(emp => {
    const daysSinceStart = (new Date() - new Date(emp.start_date)) / (1000 * 60 * 60 * 24);
    return daysSinceStart <= 30;
  });

  return (
    <div className="p-6 md:p-8 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
            Employee Onboarding
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track new hire progress and ensure successful integration
          </p>
        </div>
        <Badge variant="outline" className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 border-green-200 dark:border-green-700">
          {pendingOnboarding.length} Active Onboardings
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">New Hires (90 days)</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{onboardingEmployees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingOnboarding.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {onboardingEmployees.length - pendingOnboarding.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {onboardingEmployees.length > 0 
                    ? Math.round(((onboardingEmployees.length - pendingOnboarding.length) / onboardingEmployees.length) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onboarding List */}
      <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-xl">
        <CardHeader className="border-b border-gray-100 dark:border-slate-700">
          <CardTitle className="text-xl text-gray-900 dark:text-white">
            Active Onboarding Sessions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Loading onboarding data...</p>
            </div>
          ) : onboardingEmployees.length === 0 ? (
            <div className="p-12 text-center">
              <UserPlus className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Active Onboarding
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                New employees will appear here for onboarding tracking
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-slate-700">
              {onboardingEmployees.map((employee) => (
                <OnboardingCard
                  key={employee.id}
                  employee={employee}
                  onClick={() => setSelectedEmployee(employee)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Onboarding Modal */}
      {selectedEmployee && (
        <OnboardingModal
          employee={selectedEmployee}
          isOpen={!!selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          onUpdate={loadEmployees}
        />
      )}
    </div>
  );
}