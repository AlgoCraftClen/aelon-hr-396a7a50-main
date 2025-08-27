
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { LeaveRequest } from "@/api/entities";
import { Employee } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Plus, 
  Clock, 
  Check, 
  X,
  AlertCircle,
  Users,
  CalendarDays,
  Filter
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import LeaveRequestCard from "../components/leave/LeaveRequestCard";
import CreateLeaveModal from "../components/leave/CreateLeaveModal";
import LeaveCalendar from "../components/leave/LeaveCalendar";

export default function LeaveManagement() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [isLoading, setIsLoading] = useState(true);
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("all");
  
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeFromUrl = params.get('leave_type');
    if (typeFromUrl) {
      setLeaveTypeFilter(typeFromUrl);
      setActiveTab('all'); // Assuming 'all' tab can show filtered results
    }
    loadData();
  }, [location.search]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [leaveData, employeeData] = await Promise.all([
        LeaveRequest.list('-created_date'),
        Employee.list()
      ]);
      
      setLeaveRequests(leaveData);
      setEmployees(employeeData);
    } catch (error) {
      console.error("Error loading leave data:", error);
    }
    setIsLoading(false);
  };

  const handleCreateLeave = async (leaveData) => {
    try {
      await LeaveRequest.create(leaveData);
      await loadData();
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating leave request:", error);
    }
  };

  const handleStatusUpdate = async (leaveId, newStatus, rejectionReason = null) => {
    try {
      const updateData = {
        status: newStatus,
        approved_date: new Date().toISOString(),
        approved_by: 'Current User', // In real app, get current user
        ...(rejectionReason && { rejection_reason: rejectionReason })
      };
      
      await LeaveRequest.update(leaveId, updateData);
      await loadData();
    } catch (error) {
      console.error("Error updating leave status:", error);
    }
  };
  
  const getFilteredRequests = (status) => {
    let requests = leaveRequests;
    if (status !== "all") {
      requests = requests.filter(req => req.status.toLowerCase() === status.toLowerCase());
    }
    if (leaveTypeFilter !== "all") {
      requests = requests.filter(req => req.leave_type === leaveTypeFilter);
    }
    return requests;
  };

  const pendingRequests = getFilteredRequests("pending");
  const approvedRequests = getFilteredRequests("approved");
  const rejectedRequests = getFilteredRequests("rejected");
  const culturalRequests = leaveRequests.filter(req => req.cultural_context !== 'Not Applicable');

  const allLeaveTypes = [...new Set(leaveRequests.map(r => r.leave_type))];

  return (
    <div className="p-6 md:p-8 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
            Leave & Attendance
          </h1>
          {/* FIXED: Enhanced contrast for subtitle */}
          <p className="text-gray-800 dark:text-gray-400 mt-1 font-medium">
            Manage employee leave requests and track attendance
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Leave Request
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingRequests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{approvedRequests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <X className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Rejected</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{rejectedRequests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <span className="text-xl">🏝️</span>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Cultural Leave</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{culturalRequests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leave Management Tabs */}
      <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-xl">
        <CardHeader className="border-b border-gray-100 dark:border-slate-700 flex flex-row items-center justify-between">
          <CardTitle className="text-xl text-gray-900 dark:text-white">
            Leave Requests
          </CardTitle>
          <div className="w-1/3">
             <Select value={leaveTypeFilter} onValueChange={setLeaveTypeFilter}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Leave Types</SelectItem>
                {allLeaveTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="p-6 pb-0">
              <TabsList className="bg-gray-100 dark:bg-slate-700">
                <TabsTrigger value="pending" className="relative">
                  Pending
                  {pendingRequests.length > 0 && (
                    <Badge className="ml-2 bg-yellow-500 text-white text-xs">
                      {pendingRequests.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
                <TabsTrigger value="cultural">Cultural Leave</TabsTrigger>
                <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="pending" className="mt-0">
                {isLoading ? (
                  <div className="space-y-4">
                    {Array(3).fill(0).map((_, i) => (
                      <div key={i} className="animate-pulse p-4 rounded-lg bg-gray-100 dark:bg-slate-700 h-24" />
                    ))}
                  </div>
                ) : pendingRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No Pending Requests
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      All leave requests have been processed
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <LeaveRequestCard
                        key={request.id}
                        request={request}
                        employee={employees.find(e => e.id === request.employee_id)}
                        onStatusUpdate={handleStatusUpdate}
                        showActions={true}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="approved" className="mt-0">
                <div className="space-y-4">
                  {approvedRequests.map((request) => (
                    <LeaveRequestCard
                      key={request.id}
                      request={request}
                      employee={employees.find(e => e.id === request.employee_id)}
                      showActions={false}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="rejected" className="mt-0">
                <div className="space-y-4">
                  {rejectedRequests.map((request) => (
                    <LeaveRequestCard
                      key={request.id}
                      request={request}
                      employee={employees.find(e => e.id === request.employee_id)}
                      showActions={false}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="cultural" className="mt-0">
                <div className="space-y-4">
                  {culturalRequests.map((request) => (
                    <LeaveRequestCard
                      key={request.id}
                      request={request}
                      employee={employees.find(e => e.id === request.employee_id)}
                      onStatusUpdate={handleStatusUpdate}
                      showActions={request.status === 'Pending'}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="calendar" className="mt-0">
                <LeaveCalendar 
                  leaveRequests={approvedRequests}
                  employees={employees}
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Create Leave Modal */}
      {showCreateModal && (
        <CreateLeaveModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateLeave}
          employees={employees}
        />
      )}
    </div>
  );
}
