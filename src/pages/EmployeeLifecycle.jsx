import React, { useState, useEffect } from "react";
import { Employee } from "@/api/entities";
import { ExitInterview } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UserPlus,
  Users,
  UserX,
  Calendar,
  TrendingUp,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

import RecruitmentOverview from "../components/lifecycle/RecruitmentOverview";
import ExitInterviewModal from "../components/lifecycle/ExitInterviewModal";
import AlumniTracker from "../components/lifecycle/AlumniTracker";

export default function EmployeeLifecycle() {
  const [employees, setEmployees] = useState([]);
  const [exitInterviews, setExitInterviews] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [employeeData, exitData] = await Promise.all([
        Employee.list('-start_date'),
        ExitInterview.list('-created_date')
      ]);
      
      setEmployees(employeeData);
      setExitInterviews(exitData);
    } catch (error) {
      console.error("Error loading lifecycle data:", error);
    }
    setIsLoading(false);
  };

  const activeEmployees = employees.filter(emp => emp.status === 'Active');
  const recentHires = employees.filter(emp => {
    const startDate = new Date(emp.start_date);
    const daysSinceStart = (new Date() - startDate) / (1000 * 60 * 60 * 24);
    return daysSinceStart <= 90 && emp.status === 'Active';
  });
  const terminatedEmployees = employees.filter(emp => emp.status === 'Terminated');

  const handleExitInterview = (employee) => {
    setSelectedEmployee(employee);
    setShowExitModal(true);
  };

  const handleExitInterviewSubmit = async (interviewData) => {
    try {
      await ExitInterview.create({
        ...interviewData,
        employee_id: selectedEmployee.id,
        interviewer_id: (await User.me()).id
      });
      
      // Update employee status
      await Employee.update(selectedEmployee.id, { status: 'Terminated' });
      
      await loadData();
      setShowExitModal(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error("Error creating exit interview:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2 text-white">Loading employee lifecycle data...</span>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 text-gray-900 dark:text-white">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
            Employee Lifecycle Management
          </h1>
          <p className="text-gray-400 mt-1">
            Track employees from recruitment to alumni status
          </p>
        </div>
      </div>

      {/* Lifecycle Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
  <Card className="bg-white/50 dark:bg-[#24243e]/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Active Employees</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeEmployees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

  <Card className="bg-white/50 dark:bg-[#24243e]/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Recent Hires (90d)</p>
                <p className="text-2xl font-bold text-white">{recentHires.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

  <Card className="bg-white/50 dark:bg-[#24243e]/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <UserX className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Exit Interviews</p>
                <p className="text-2xl font-bold text-white">{exitInterviews.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

  <Card className="bg-white/50 dark:bg-[#24243e]/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Retention Rate</p>
                <p className="text-2xl font-bold text-white">
                  {employees.length > 0 ? Math.round((activeEmployees.length / employees.length) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
  <Card className="bg-white/50 dark:bg-[#24243e]/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="p-6 border-b border-gray-700/50">
              <TabsList className="bg-gray-800/50">
                <TabsTrigger value="overview">Lifecycle Overview</TabsTrigger>
                <TabsTrigger value="recruitment">Recruitment Pipeline</TabsTrigger>
                <TabsTrigger value="exits">Exit Management</TabsTrigger>
                <TabsTrigger value="alumni">Alumni Network</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Employee Journey Timeline</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-gray-800/50 border border-gray-700/50">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-green-400" />
                        Recent New Hires
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {recentHires.slice(0, 5).map((employee) => (
                          <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                            <div>
                              <p className="font-medium text-white">
                                {employee.first_name} {employee.last_name}
                              </p>
                              <p className="text-sm text-gray-400">
                                {employee.position} • Started {new Date(employee.start_date).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              New
                            </Badge>
                          </div>
                        ))}
                        {recentHires.length === 0 && (
                          <p className="text-gray-400 text-center py-4">No recent hires</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/50 border border-gray-700/50">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Clock className="w-5 h-5 text-yellow-400" />
                        Employees Requiring Attention
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {employees.filter(emp => {
                          const workPermit = emp.work_permit;
                          if (workPermit && workPermit.expiry_date) {
                            const daysUntilExpiry = (new Date(workPermit.expiry_date) - new Date()) / (1000 * 60 * 60 * 24);
                            return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
                          }
                          return false;
                        }).slice(0, 5).map((employee) => (
                          <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                            <div>
                              <p className="font-medium text-white">
                                {employee.first_name} {employee.last_name}
                              </p>
                              <p className="text-sm text-gray-400">
                                Work permit expires soon
                              </p>
                            </div>
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                              Action Needed
                            </Badge>
                          </div>
                        ))}
                        <p className="text-gray-400 text-center py-4">All employees up to date</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="recruitment" className="p-6">
              <RecruitmentOverview />
            </TabsContent>

            <TabsContent value="exits" className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Exit Interview Management</h3>
                  <Button 
                    onClick={() => setShowExitModal(true)}
                    className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Conduct Exit Interview
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-gray-800/50 border border-gray-700/50">
                    <CardHeader>
                      <CardTitle className="text-gray-900 dark:text-white">Active Employees</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {activeEmployees.map((employee) => (
                          <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                            <div>
                              <p className="font-medium text-white">
                                {employee.first_name} {employee.last_name}
                              </p>
                              <p className="text-sm text-gray-400">
                                {employee.position} • {employee.department}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleExitInterview(employee)}
                              className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                            >
                              Exit Interview
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/50 border border-gray-700/50">
                    <CardHeader>
                      <CardTitle className="text-gray-900 dark:text-white">Completed Exit Interviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {exitInterviews.map((interview) => {
                          const employee = employees.find(emp => emp.id === interview.employee_id);
                          return (
                            <div key={interview.id} className="p-3 bg-gray-900/50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <p className="font-medium text-white">
                                  {employee ? `${employee.first_name} ${employee.last_name}` : 'Unknown Employee'}
                                </p>
                                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                                  Completed
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-400">
                                Reason: {interview.reason_for_leaving} • 
                                Exit Date: {new Date(interview.exit_date).toLocaleDateString()}
                              </p>
                              {interview.satisfaction_rating && (
                                <p className="text-sm text-gray-400">
                                  Satisfaction: {interview.satisfaction_rating}/5 stars
                                </p>
                              )}
                            </div>
                          );
                        })}
                        {exitInterviews.length === 0 && (
                          <p className="text-gray-400 text-center py-4">No exit interviews completed</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="alumni" className="p-6">
              <AlumniTracker 
                terminatedEmployees={terminatedEmployees}
                exitInterviews={exitInterviews}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Exit Interview Modal */}
      {showExitModal && (
        <ExitInterviewModal
          isOpen={showExitModal}
          onClose={() => {
            setShowExitModal(false);
            setSelectedEmployee(null);
          }}
          employee={selectedEmployee}
          onSubmit={handleExitInterviewSubmit}
        />
      )}
    </div>
  );
}