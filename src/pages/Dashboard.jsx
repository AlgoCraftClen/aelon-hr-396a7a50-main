
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Employee } from "@/api/entities";
import { LeaveRequest } from "@/api/entities";
import { Training } from "@/api/entities";
import { TrainingProgress } from "@/api/entities";
import { SupportTicket } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Users,
  Calendar,
  GraduationCap,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  Plus,
  ArrowRight,
  Building,
  Award,
  UserCheck,
  FileText
} from "lucide-react";

import StatsCard from "../components/dashboard/StatsCard";
import QuickActions from "../components/dashboard/QuickActions";
import RecentActivity from "../components/dashboard/RecentActivity";
import ComplianceAlerts from "../components/dashboard/ComplianceAlerts";
import CulturalCalendar from "../components/dashboard/CulturalCalendar";
import LeaveRequestModal from "../components/leave/LeaveRequestModal";
import { withErrorHandling } from '../components/utils/errorHandler';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { useGuestMode } from '../components/auth/GuestModeProvider'; // NEW: Import guest mode detection

// DEMO DATA FOR GUEST MODE - Marshall Islands specific
const demoData = {
  employees: [
    {
      id: "demo-1",
      first_name: "Maria",
      last_name: "Kabua",
      position: "HR Manager",
      department: "Human Resources",
      location: "Majuro",
      status: "Active",
      created_date: "2024-01-15T00:00:00Z"
    },
    {
      id: "demo-2", 
      first_name: "John",
      last_name: "Loeak",
      position: "Operations Lead",
      department: "Operations",
      location: "Ebeye",
      status: "Active",
      created_date: "2024-01-10T00:00:00Z"
    },
    {
      id: "demo-3",
      first_name: "Sarah",
      last_name: "Heine", 
      position: "Finance Officer",
      department: "Finance",
      location: "Majuro",
      status: "On Leave",
      created_date: "2024-01-05T00:00:00Z"
    }
  ],
  leaveRequests: [
    {
      id: "demo-leave-1",
      employee_id: "demo-1",
      leave_type: "Cultural Leave",
      start_date: "2024-03-01",
      end_date: "2024-03-03",
      total_days: 3,
      reason: "Kemem celebration for first grandchild",
      cultural_context: "Kemem",
      status: "Pending",
      created_date: "2024-02-20T00:00:00Z"
    },
    {
      id: "demo-leave-2",
      employee_id: "demo-2",
      leave_type: "Annual Leave",
      start_date: "2024-03-15",
      end_date: "2024-03-22",
      total_days: 7,
      reason: "Family visit to outer islands",
      cultural_context: "Not Applicable", 
      status: "Approved",
      created_date: "2024-02-18T00:00:00Z"
    }
  ],
  supportTickets: [
    {
      id: "demo-ticket-1",
      employee_id: "demo-3",
      subject: "IT Support - Network Issue",
      description: "Internet connectivity problems in Majuro office",
      category: "IT Support",
      priority: "Medium",
      status: "Open",
      created_date: "2024-02-25T00:00:00Z"
    }
  ],
  trainings: [
    {
      id: "demo-training-1",
      title: "Workplace Safety",
      category: "Safety",
      is_mandatory: true
    },
    {
      id: "demo-training-2", 
      title: "Cultural Sensitivity Training",
      category: "Cultural Awareness",
      is_mandatory: true
    }
  ],
  trainingProgress: [
    {
      id: "demo-progress-1",
      employee_id: "demo-1",
      training_id: "demo-training-1",
      status: "Completed",
      completed_date: "2024-02-15T00:00:00Z"
    },
    {
      id: "demo-progress-2",
      employee_id: "demo-2", 
      training_id: "demo-training-2",
      status: "In Progress",
      due_date: "2024-03-10"
    }
  ]
};

export default function Dashboard() {
  const { isGuestMode } = useGuestMode(); // NEW: Detect if user is in guest mode
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    overdueTraining: 0,
    openTickets: 0,
    complianceRate: 0,
    activeEmployees: 0
  });
  const [employees, setEmployees] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // NEW: Check if we're in guest mode
      if (isGuestMode) {
        console.log("👁️ GUEST MODE: Loading demo data instead of real API calls");
        await loadDemoData();
      } else {
        console.log("🔐 AUTHENTICATED MODE: Loading real data from APIs");
        await loadRealData();
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError("Unable to load some dashboard data. Operating in limited mode.");
    }
    
    setIsLoading(false);
  };

  // NEW: Load demo data for guests
  const loadDemoData = async () => {
    // Simulate a brief loading delay for realism
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const currentUser = {
      full_name: 'Demo User',
      email: 'demo@example.com'
    };
    setUser(currentUser);

    // Use our demo data
    setEmployees(demoData.employees);
    setLeaveRequests(demoData.leaveRequests);
    setSupportTickets(demoData.supportTickets);

    // Calculate demo stats
    const pendingLeaves = demoData.leaveRequests.filter(leave => leave.status === 'Pending').length;
    const activeEmployees = demoData.employees.filter(emp => emp.status === 'Active').length;
    const openTickets = demoData.supportTickets.filter(ticket => ticket.status === 'Open').length;
    
    const overdueTraining = demoData.trainingProgress.filter(progress => {
      if (progress.status === 'Completed') return false;
      if (!progress.due_date) return false;
      return new Date(progress.due_date) < new Date();
    }).length;

    const completedTraining = demoData.trainingProgress.filter(p => p.status === 'Completed').length;
    const totalTrainingRequired = demoData.trainingProgress.length;
    const complianceRate = totalTrainingRequired > 0 ? Math.round((completedTraining / totalTrainingRequired) * 100) : 100;

    setStats({
      totalEmployees: demoData.employees.length,
      activeEmployees,
      pendingLeaves,
      overdueTraining,
      openTickets,
      complianceRate
    });

    // Demo upcoming events
    setUpcomingEvents([
      {
        id: 1,
        title: 'Nuclear Victims Day',
        date: new Date('2024-03-01'),
        type: 'national_holiday',
        description: 'National remembrance day'
      },
      {
        id: 2,
        title: 'Constitution Day',
        date: new Date('2024-05-01'),
        type: 'national_holiday', 
        description: 'Marshall Islands Constitution Day'
      }
    ]);
  };

  // EXISTING: Load real data for authenticated users
  const loadRealData = async () => {
    const currentUser = await withErrorHandling(
      () => User.me(),
      { full_name: 'Guest User', email: 'guest@example.com' }
    );
    setUser(currentUser);

    const [
      employeeData,
      leaveRequestsData,
      trainings,
      trainingProgress,
      supportTicketsData
    ] = await Promise.all([
      withErrorHandling(() => Employee.list(), []),
      withErrorHandling(() => LeaveRequest.list('-created_date', 8), []),
      withErrorHandling(() => Training.list(), []),
      withErrorHandling(() => TrainingProgress.list(), []),
      withErrorHandling(() => SupportTicket.list('-created_date', 8), [])
    ]);

    setEmployees(employeeData);
    setLeaveRequests(leaveRequestsData);
    setSupportTickets(supportTicketsData);

    // Calculate stats with error handling
    const pendingLeaves = leaveRequestsData.filter(leave => leave.status === 'Pending').length;
    const activeEmployees = employeeData.filter(emp => emp.status === 'Active').length;
    const openTickets = supportTicketsData.filter(ticket => ticket.status === 'Open').length;
    
    const overdueTraining = trainingProgress.filter(progress => {
      if (progress.status === 'Completed') return false;
      if (!progress.due_date) return false;
      return new Date(progress.due_date) < new Date();
    }).length;

    const completedTraining = trainingProgress.filter(p => p.status === 'Completed').length;
    const totalTrainingRequired = trainingProgress.length;
    const complianceRate = totalTrainingRequired > 0 ? Math.round((completedTraining / totalTrainingRequired) * 100) : 100;

    setStats({
      totalEmployees: employeeData.length,
      activeEmployees,
      pendingLeaves,
      overdueTraining,
      openTickets,
      complianceRate
    });

    // Sample upcoming events
    setUpcomingEvents([
      {
        id: 1,
        title: 'Nuclear Victims Day',
        date: new Date('2024-03-01'),
        type: 'national_holiday',
        description: 'National remembrance day'
      },
      {
        id: 2,
        title: 'Constitution Day',
        date: new Date('2024-05-01'),
        type: 'national_holiday',
        description: 'Marshall Islands Constitution Day'
      }
    ]);
  };

  const handleActivityClick = (activity) => {
    if (activity.type === 'leave') {
      setSelectedActivity(activity);
    }
  };

  const handleCloseModal = () => {
    setSelectedActivity(null);
    loadDashboardData();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  if (isLoading) {
    return (
      <ErrorBoundary>
        <div className="p-6 md:p-8">
          <LoadingSpinner size="lg" text="Loading your dashboard..." />
        </div>
      </ErrorBoundary>
    );
  }

  if (error) {
    return (
      <ErrorBoundary>
        <div className="p-6 md:p-8 space-y-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Limited Connectivity
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                <Button onClick={loadDashboardData}>
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="p-6 md:p-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {getGreeting()}, {user?.full_name?.split(' ')[0] || 'User'}! 👋
            </h1>
            {/* FIXED: Enhanced contrast for subtitle */}
            <p className="text-gray-800 dark:text-gray-400 mt-1 font-medium">
              Here's what's happening with your HR operations today.
              {isGuestMode && (
                <span className="block text-purple-700 dark:text-purple-400 text-sm mt-1 font-semibold">
                  👁️ You're viewing demo data in guest mode
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 font-medium">
              <Building className="w-3 h-3 mr-1" />
              Marshall Islands
            </Badge>
            <Badge variant="outline" className={isGuestMode 
              ? "bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800 font-medium"
              : "bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 font-medium"
            }>
              <CheckCircle className="w-3 h-3 mr-1" />
              {isGuestMode ? 'Demo Mode' : 'System Active'}
            </Badge>
          </div>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Employees"
            value={stats.totalEmployees}
            change="+12%"
            changeType="positive"
            icon={Users}
            color="from-blue-500 to-cyan-500"
          />
          <StatsCard
            title="Pending Leaves"
            value={stats.pendingLeaves}
            change="-8%"
            changeType="negative"
            icon={Calendar}
            color="from-orange-500 to-red-500"
          />
          <StatsCard
            title="Training Progress"
            value={`${stats.complianceRate}%`}
            change="+5%"
            changeType="positive"
            icon={GraduationCap}
            color="from-green-500 to-emerald-500"
          />
          <StatsCard
            title="Open Tickets"
            value={stats.openTickets}
            change="0%"
            changeType="neutral"
            icon={AlertTriangle}
            color="from-purple-500 to-pink-500"
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <QuickActions />

            {/* Recent Activity */}
            <RecentActivity 
              leaveRequests={leaveRequests}
              supportTickets={supportTickets}
              onActivityClick={handleActivityClick}
            />

            {/* Compliance Alerts */}
            <ComplianceAlerts overdueTraining={stats.overdueTraining} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Cultural Calendar */}
            <CulturalCalendar events={upcomingEvents} />

            {/* Quick Stats */}
            <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-xl">
              <CardHeader className="border-b border-gray-100 dark:border-slate-700">
                <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  This Month
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Active Employees</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">{stats.activeEmployees}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Compliance Rate</span>
                  </div>
                  <span className="font-semibold text-green-600">{stats.complianceRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Pending Actions</span>
                  </div>
                  <span className="font-semibold text-orange-600">{stats.pendingLeaves + stats.openTickets}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-xl">
              <CardHeader className="border-b border-gray-100 dark:border-slate-700">
                <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
                  <FileText className="w-5 h-5 text-purple-500" />
                  Quick Links
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <Link to={createPageUrl("EmployeeDirectory")}>
                    <Button variant="ghost" className="w-full justify-start text-left">
                      <Users className="w-4 h-4 mr-2 text-green-500" />
                      Employee Directory
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </Button>
                  </Link>
                  <Link to={createPageUrl("TrainingCenter")}>
                    <Button variant="ghost" className="w-full justify-start text-left">
                      <GraduationCap className="w-4 h-4 mr-2 text-purple-500" />
                      Training Center
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </Button>
                  </Link>
                  <Link to={createPageUrl("LeaveManagement")}>
                    <Button variant="ghost" className="w-full justify-start text-left">
                      <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                      Leave Management
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </Button>
                  </Link>
                  <Link to={createPageUrl("Support")}>
                    <Button variant="ghost" className="w-full justify-start text-left">
                      <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
                      Support Center
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {selectedActivity && selectedActivity.type === 'leave' && (
          <LeaveRequestModal
              request={selectedActivity}
              isOpen={!!selectedActivity}
              onClose={handleCloseModal}
              employee={employees.find(e => e.id === selectedActivity.employee_id)}
              onUpdate={handleCloseModal}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
