import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Users,
  Calendar,
  GraduationCap,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  Building,
  Award,
  UserCheck,
  FileText,
  UserPlus,
  ArrowRight,
  Play,
  Eye,
  Star,
  Globe,
  MapPin,
  Phone,
  Mail
} from "lucide-react";

import { GuestActionButton } from "../components/auth/GuestActionBlocker";

// 🎯 GUEST DASHBOARD: PROFESSIONAL DEMO EXPERIENCE
// This is the dedicated guest dashboard with realistic sample data
// Purpose: Convert visitors to paying customers with professional demo

// Sample data for Marshall Islands HR demo
const demoStats = {
  totalEmployees: 47,
  pendingLeaves: 3,
  trainingProgress: 92,
  openTickets: 1,
  activeEmployees: 44,
  complianceRate: 96
};

const demoActivities = [
  {
    id: 1,
    type: "leave",
    title: "Cultural Leave Request",
    description: "Maria Kabua - Kemem Celebration",
    time: "2 hours ago",
    status: "Pending",
    cultural: true
  },
  {
    id: 2,
    type: "training",
    title: "Safety Training Completed",
    description: "John Loeak - Workplace Safety Course",
    time: "4 hours ago",
    status: "Completed",
    cultural: false
  },
  {
    id: 3,
    type: "ticket",
    title: "IT Support Request",
    description: "Network connectivity issue - Majuro office",
    time: "1 day ago",
    status: "In Progress", 
    cultural: false
  },
  {
    id: 4,
    type: "leave",
    title: "Annual Leave Approved",
    description: "Sarah Heine - Family visit to Outer Islands",
    time: "2 days ago",
    status: "Approved",
    cultural: false
  }
];

const quickActions = [
  {
    title: "Add New Employee",
    description: "Onboard a new team member",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
    action: "employee-add"
  },
  {
    title: "Request Leave",
    description: "Submit a leave request",
    icon: Calendar,
    color: "from-green-500 to-emerald-500",
    action: "leave-request"
  },
  {
    title: "Create Training",
    description: "Design new training module",
    icon: GraduationCap,
    color: "from-purple-500 to-pink-500",
    action: "training-create"
  },
  {
    title: "Generate Report",
    description: "Export HR analytics",
    icon: FileText,
    color: "from-orange-500 to-red-500",
    action: "report-generate"
  }
];

const demoEmployees = [
  { name: "Maria Kabua", role: "HR Manager", location: "Majuro", status: "Active" },
  { name: "John Loeak", role: "Operations Lead", location: "Ebeye", status: "Active" },
  { name: "Sarah Heine", role: "Finance Officer", location: "Majuro", status: "On Leave" },
  { name: "David Jetnil", role: "IT Specialist", location: "Remote", status: "Active" }
];

export default function GuestDashboard() {
  const navigate = useNavigate();
  const [expandedCard, setExpandedCard] = useState(null);

  const handleSignUp = () => {
    navigate(createPageUrl('Auth?mode=signup'));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Approved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'In Progress': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 min-h-screen">
      {/* Welcome Header - Now simplified since it's inside GuestLayout */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {getGreeting()}, Welcome to IAKWE HR! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Explore our comprehensive HR management system designed for the Marshall Islands.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800">
            <Eye className="w-3 h-3 mr-1" />
            Demo Mode
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
            <Building className="w-3 h-3 mr-1" />
            Marshall Islands
          </Badge>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{demoStats.totalEmployees}</p>
                <p className="text-xs text-green-600 dark:text-green-400">+12% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Leaves</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{demoStats.pendingLeaves}</p>
                <p className="text-xs text-orange-600 dark:text-orange-400">2 cultural events</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Training Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{demoStats.trainingProgress}%</p>
                <p className="text-xs text-green-600 dark:text-green-400">Above target</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Open Tickets</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{demoStats.openTickets}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Low priority</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-xl">
            <CardHeader className="border-b border-gray-100 dark:border-slate-700">
              <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-white">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <GuestActionButton key={index} feature={action.title}>
                      <Card className="group cursor-pointer hover:scale-105 transition-all duration-300 border-0 shadow-lg bg-white/80 hover:bg-white hover:shadow-xl dark:bg-slate-700/50 dark:hover:bg-slate-700">
                        <CardContent className="p-4 text-center">
                          <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center bg-gradient-to-r ${action.color} group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {action.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {action.description}
                          </p>
                        </CardContent>
                      </Card>
                    </GuestActionButton>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-xl">
            <CardHeader className="border-b border-gray-100 dark:border-slate-700">
              <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-white">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100 dark:divide-slate-700">
                {demoActivities.map((activity, index) => (
                  <div key={activity.id} className="p-4 hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-xl ${
                        activity.type === 'leave' 
                          ? 'bg-gradient-to-r from-blue-500 to-teal-500' 
                          : activity.type === 'training'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                          : 'bg-gradient-to-r from-orange-500 to-red-500'
                      } shadow-lg`}>
                        {activity.type === 'leave' && <Calendar className="w-4 h-4 text-white" />}
                        {activity.type === 'training' && <GraduationCap className="w-4 h-4 text-white" />}
                        {activity.type === 'ticket' && <AlertTriangle className="w-4 h-4 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {activity.title}
                              {activity.cultural && <span className="ml-2 text-sm">🏝️</span>}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {activity.description}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <Badge className={getStatusColor(activity.status)}>
                              {activity.status}
                            </Badge>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {activity.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-8">
          {/* Team Overview */}
          <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-xl">
            <CardHeader className="border-b border-gray-100 dark:border-slate-700">
              <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
                <Users className="w-5 h-5 text-purple-500" />
                Team Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {demoEmployees.map((employee, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {employee.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {employee.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {employee.role} • {employee.location}
                    </p>
                  </div>
                  <Badge 
                    variant="secondary"
                    className={employee.status === 'Active' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
                    }
                  >
                    {employee.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Cultural Calendar */}
          <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-xl">
            <CardHeader className="border-b border-gray-100 dark:border-slate-700">
              <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
                <span className="text-lg">🏝️</span>
                Cultural Calendar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                    MAR
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">Nuclear Victims Day</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">March 1 • National Holiday</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                    MAY
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">Constitution Day</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">May 1 • National Holiday</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Stats */}
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
                <span className="font-semibold text-gray-900 dark:text-white">{demoStats.activeEmployees}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Compliance Rate</span>
                </div>
                <span className="font-semibold text-green-600">{demoStats.complianceRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Pending Actions</span>
                </div>
                <span className="font-semibold text-orange-600">{demoStats.pendingLeaves + demoStats.openTickets}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}