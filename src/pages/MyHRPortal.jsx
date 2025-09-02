
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Employee } from '@/api/entities';
import { LeaveRequest } from '@/api/entities';
import { TrainingProgress } from '@/api/entities';
import { Training } from '@/api/entities';
import { Payslip } from '@/api/entities';
import { PolicyAcknowledgment } from '@/api/entities';
import { Policy } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  User as UserIcon,
  Calendar,
  GraduationCap,
  FileText,
  DollarSign,
  Clock,
  Award,
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

import { withErrorHandling } from '../components/utils/errorHandler';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorBoundary from '../components/common/ErrorBoundary';

export default function MyHRPortal() {
  const [user, setUser] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [trainingProgress, setTrainingProgress] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [payslips, setPayslips] = useState([]);
  const [policyAcknowledgments, setPolicyAcknowledgments] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await withErrorHandling(
        () => User.me(),
        null
      );
      setUser(currentUser);

      // If currentUser is null, it means fetching failed or user is not logged in.
      // We should stop loading and return. The !user check below will handle displaying an error.
      if (!currentUser) {
        setIsLoading(false);
        return;
      }

      // Find employee record for current user
      const employees = await withErrorHandling(
        () => Employee.list(),
        []
      );
      const userEmployee = employees.find(emp =>
        emp.first_name?.toLowerCase() === currentUser.full_name?.split(' ')[0]?.toLowerCase() ||
        emp.created_by === currentUser.email
      );
      setEmployee(userEmployee);

      if (userEmployee) {
        // Load employee-specific data with error handling
        const [
          userLeaveRequests,
          userTrainingProgress,
          allTrainings,
          userPayslips,
          allPolicies,
          userAcknowledgments
        ] = await Promise.all([
          withErrorHandling(() => LeaveRequest.filter({ employee_id: userEmployee.id }, '-created_date'), []),
          withErrorHandling(() => TrainingProgress.filter({ employee_id: userEmployee.id }), []),
          withErrorHandling(() => Training.list(), []),
          withErrorHandling(() => Payslip.filter({ employee_id: userEmployee.id }, '-pay_period_end'), []),
          withErrorHandling(() => Policy.list(), []),
          withErrorHandling(() => PolicyAcknowledgment.filter({ employee_id: userEmployee.id }), [])
        ]);

        setLeaveRequests(userLeaveRequests);
        setTrainingProgress(userTrainingProgress);
        setTrainings(allTrainings);
        setPayslips(userPayslips);
        setPolicies(allPolicies);
        setPolicyAcknowledgments(userAcknowledgments);
      }
    } catch (error) {
      console.error('Error loading My HR Portal data:', error);
    }
    setIsLoading(false);
  };

  const getLeaveBalance = () => {
    // Calculate leave balance based on employment type and leave requests
    const annualLeaveEntitlement = employee?.employment_type === 'Full-time' ? 20 : 10;
    const usedAnnualLeave = leaveRequests
      .filter(req => req.leave_type === 'Annual Leave' && req.status === 'Approved')
      .reduce((total, req) => total + (req.total_days || 0), 0);

    return {
      annual: Math.max(0, annualLeaveEntitlement - usedAnnualLeave),
      sick: 10, // Standard sick leave entitlement
      cultural: 5 // Cultural leave entitlement
    };
  };

  const getTrainingCompletionRate = () => {
    if (trainingProgress.length === 0) return 0;
    const completed = trainingProgress.filter(tp => tp.status === 'Completed').length;
    return Math.round((completed / trainingProgress.length) * 100);
  };

  const getPendingAcknowledgments = () => {
    const activePolicies = policies.filter(p => p.status === 'Active' && p.requires_acknowledgment);
    return activePolicies.filter(policy =>
      !policyAcknowledgments.some(ack =>
        ack.policy_id === policy.id && ack.status === 'Acknowledged'
      )
    );
  };

  if (isLoading) {
    return (
      <ErrorBoundary>
        <div className="p-6 md:p-8">
          <LoadingSpinner size="lg" text="Loading your HR portal..." />
        </div>
      </ErrorBoundary>
    );
  }

  // New error handling for when user cannot be loaded (e.g., network issue on User.me())
  if (!user) {
    return (
      <ErrorBoundary>
        <div className="p-6 md:p-8">
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="p-8">
              <UserIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Unable to Load Profile
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We're having trouble connecting to load your profile. Please check your internet connection and try again.
              </p>
              <Button onClick={loadData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </ErrorBoundary>
    );
  }

  // Original employee not found handling (user loaded, but no employee record matched)
  if (!employee) {
    return (
      <ErrorBoundary>
        <div className="p-6 md:p-8">
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="p-8">
              <UserIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Employee Profile Not Found
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Your employee profile hasn't been set up yet. Please contact HR to create your employee record.
              </p>
              <Button onClick={() => {
                try { const goTo = require('@/lib/navigation').default; goTo('Dashboard', { replace: true }); }
                catch (e) { try { window.location.href = createPageUrl('Dashboard'); } catch (_) { window.location.href = '/Dashboard'; } }
              }}>
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </ErrorBoundary>
    );
  }

  const leaveBalance = getLeaveBalance();
  const trainingCompletion = getTrainingCompletionRate();
  const pendingAcknowledgments = getPendingAcknowledgments();

  return (
    <ErrorBoundary>
      <div className="p-6 md:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-purple-500/50">
              <AvatarImage src={employee.profile_image_url} alt={employee.first_name} />
              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-500 text-white font-bold text-2xl">
                {employee.first_name?.[0]}{employee.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome, {employee.first_name}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {employee.position} • {employee.department}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              {employee.status}
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {employee.employment_type}
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Annual Leave</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{leaveBalance.annual}</p>
                  <p className="text-xs text-gray-500">days remaining</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Training Progress</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{trainingCompletion}%</p>
                  <p className="text-xs text-gray-500">completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending Reviews</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingAcknowledgments.length}</p>
                  <p className="text-xs text-gray-500">policies to review</p>
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Days Employed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.floor((new Date() - new Date(employee.start_date)) / (1000 * 60 * 60 * 24))}
                  </p>
                  <p className="text-xs text-gray-500">since {new Date(employee.start_date).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-purple-500" />
              My HR Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="leave">Leave</TabsTrigger>
                <TabsTrigger value="training">Training</TabsTrigger>
                <TabsTrigger value="payslips">Payslips</TabsTrigger>
                <TabsTrigger value="policies">Policies</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                {/* Pending Actions */}
                {pendingAcknowledgments.length > 0 && (
                  <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-300">
                        <AlertCircle className="w-5 h-5" />
                        Action Required
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-orange-700 dark:text-orange-400 mb-4">
                        You have {pendingAcknowledgments.length} policy document(s) that require your acknowledgment.
                      </p>
                      <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100" onClick={() => document.querySelector('button[data-state="inactive"][value="policies"]')?.click()}>
                        Review Policies
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Recent Activity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Leave Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {leaveRequests.slice(0, 3).map((request) => (
                        <div key={request.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                          <div>
                            <p className="font-medium">{request.leave_type}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={request.status === 'Approved' ? 'default' : request.status === 'Pending' ? 'secondary' : 'destructive'}>
                            {request.status}
                          </Badge>
                        </div>
                      ))}
                      {leaveRequests.length === 0 && (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">No leave requests found</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Training Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {trainingProgress.slice(0, 3).map((progress) => {
                        const training = trainings.find(t => t.id === progress.training_id);
                        return (
                          <div key={progress.id} className="space-y-2 py-2 border-b last:border-b-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{training?.title || 'Unknown Training'}</p>
                              <Badge variant={progress.status === 'Completed' ? 'default' : 'secondary'}>
                                {progress.status}
                              </Badge>
                            </div>
                            {progress.status === 'In Progress' && (
                              <Progress value={progress.progress_percentage || 0} className="h-2" />
                            )}
                          </div>
                        );
                      })}
                      {trainingProgress.length === 0 && (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">No training assigned</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="leave" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{leaveBalance.annual}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Annual Leave Days</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{leaveBalance.sick}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Sick Leave Days</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">{leaveBalance.cultural}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Cultural Leave Days</div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Leave History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {leaveRequests.length > 0 ? (
                        leaveRequests.map((request) => (
                          <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h4 className="font-medium">{request.leave_type}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {request.total_days} day(s) • {request.reason}
                              </p>
                            </div>
                            <Badge variant={request.status === 'Approved' ? 'default' : request.status === 'Pending' ? 'secondary' : 'destructive'}>
                              {request.status}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">No leave requests found</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="training" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {trainingProgress.length > 0 ? (
                    trainingProgress.map((progress) => {
                      const training = trainings.find(t => t.id === progress.training_id);
                      if (!training) return null; // Should not happen with proper data, but good for robustness

                      return (
                        <Card key={progress.id}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{training.title}</CardTitle>
                              <Badge variant={progress.status === 'Completed' ? 'default' : 'secondary'}>
                                {progress.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                              {training.description}
                            </p>
                            {progress.status === 'In Progress' && (
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Progress</span>
                                  <span>{progress.progress_percentage || 0}%</span>
                                </div>
                                <Progress value={progress.progress_percentage || 0} />
                              </div>
                            )}
                            {progress.status === 'Completed' && (
                              <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm">Completed on {new Date(progress.completed_date).toLocaleDateString()}</span>
                                {progress.certificate_url && (
                                  <Button size="sm" variant="outline" className="ml-auto" onClick={() => window.open(progress.certificate_url, '_blank')}>
                                    <Download className="w-4 h-4 mr-1" />
                                    Certificate
                                  </Button>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })
                  ) : (
                    <div className="md:col-span-2 text-gray-500 dark:text-gray-400 text-center py-4">No training assigned</div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="payslips" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Payslips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {payslips.length > 0 ? (
                      <div className="space-y-4">
                        {payslips.slice(0, 6).map((payslip) => (
                          <div key={payslip.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h4 className="font-medium">
                                {new Date(payslip.pay_period_start).toLocaleDateString()} - {new Date(payslip.pay_period_end).toLocaleDateString()}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Net Pay: ${payslip.net_salary?.toLocaleString() || 'N/A'}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={payslip.status === 'paid' ? 'default' : 'secondary'}>
                                {payslip.status}
                              </Badge>
                              {payslip.pdf_url && (
                                <Button size="sm" variant="outline" onClick={() => window.open(payslip.pdf_url, '_blank')}>
                                  <Download className="w-4 h-4 mr-1" />
                                  Download
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          No Payslips Available
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Your payslips will appear here once they're generated by HR.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="policies" className="space-y-6 mt-6">
                {pendingAcknowledgments.length > 0 && (
                  <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                    <CardHeader>
                      <CardTitle className="text-red-800 dark:text-red-300">Pending Acknowledgments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {pendingAcknowledgments.map((policy) => (
                          <div key={policy.id} className="flex items-center justify-between p-3 border border-red-200 rounded-lg">
                            <div>
                              <h4 className="font-medium text-red-800 dark:text-red-300">{policy.title}</h4>
                              <p className="text-sm text-red-600 dark:text-red-400">
                                Effective: {new Date(policy.effective_date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {policy.document_url && (
                                <Button size="sm" variant="outline" onClick={() => window.open(policy.document_url, '_blank')}>
                                  <Eye className="w-4 h-4 mr-1" />
                                  Review
                                </Button>
                              )}
                              <Button size="sm" onClick={async () => {
                                // Simulate acknowledgment, ideally this would call an API
                                console.log(`Acknowledging policy: ${policy.title}`);
                                // After successful acknowledgment, reload data to update state
                                // await PolicyAcknowledgment.create({ policy_id: policy.id, employee_id: employee.id, status: 'Acknowledged', acknowledged_date: new Date().toISOString() });
                                loadData();
                              }}>
                                Acknowledge
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Acknowledged Policies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {policyAcknowledgments
                        .filter(ack => ack.status === 'Acknowledged')
                        .map((acknowledgment) => {
                          const policy = policies.find(p => p.id === acknowledgment.policy_id);
                          if (!policy) return null;

                          return (
                            <div key={acknowledgment.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <h4 className="font-medium">{policy.title}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Acknowledged on {new Date(acknowledgment.acknowledged_date).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                {policy.document_url && (
                                  <Button size="sm" variant="outline" onClick={() => window.open(policy.document_url, '_blank')}>
                                    <Eye className="w-4 h-4 mr-1" />
                                    View
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      {policyAcknowledgments.filter(ack => ack.status === 'Acknowledged').length === 0 && (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">No policies acknowledged yet.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="profile" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Full Name</label>
                        <p className="text-gray-900 dark:text-white">{employee.first_name} {employee.middle_name} {employee.last_name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Employee ID</label>
                        <p className="text-gray-900 dark:text-white">{employee.employee_id || 'Not assigned'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Department</label>
                        <p className="text-gray-900 dark:text-white">{employee.department}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Position</label>
                        <p className="text-gray-900 dark:text-white">{employee.position}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Employment Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Employment Type</label>
                        <p className="text-gray-900 dark:text-white">{employee.employment_type}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Start Date</label>
                        <p className="text-gray-900 dark:text-white">{new Date(employee.start_date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Location</label>
                        <p className="text-gray-900 dark:text-white">{employee.location || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</label>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {employee.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {employee.work_permit && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Work Permit Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Permit Number</label>
                          <p className="text-gray-900 dark:text-white">{employee.work_permit.permit_number}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Expiry Date</label>
                          <p className="text-gray-900 dark:text-white">
                            {new Date(employee.work_permit.expiry_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {employee.cultural_considerations && employee.cultural_considerations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-lg">🏝️</span>
                        Cultural Considerations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {employee.cultural_considerations.map((consideration, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {consideration}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
