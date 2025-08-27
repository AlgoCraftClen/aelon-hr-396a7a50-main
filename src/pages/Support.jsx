
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SupportTicket } from "@/api/entities";
import { Employee } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HelpCircle,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  Users
} from "lucide-react";

import TicketCard from "../components/support/TicketCard";
import CreateTicketModal from "../components/support/CreateTicketModal";
import TicketModal from "../components/support/TicketModal";

export default function Support() {
  const [tickets, setTickets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("open");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get('category');
    if (categoryFromUrl) {
      setCategoryFilter(categoryFromUrl);
      setActiveTab('all');
    }
    loadData();
  }, [location.search]); // Added location.search to dependencies

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [ticketData, employeeData] = await Promise.all([
        SupportTicket.list('-created_date'),
        Employee.list()
      ]);

      setTickets(ticketData);
      setEmployees(employeeData);
    } catch (error) {
      console.error("Error loading support data:", error);
    }
    setIsLoading(false);
  };

  const handleCreateTicket = async (ticketData) => {
    try {
      await SupportTicket.create({
        ...ticketData,
        status: 'Open'
      });
      await loadData();
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating support ticket:", error);
    }
  };

  const handleStatusUpdate = async (ticketId, newStatus, resolution = null) => {
    try {
      const updateData = {
        status: newStatus,
        ...(resolution && { resolution }),
        ...(newStatus === 'Resolved' && { resolved_date: new Date().toISOString() })
      };

      await SupportTicket.update(ticketId, updateData);
      await loadData();
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };

  const getFilteredTickets = (status) => {
    let filtered = tickets;

    if (status !== "all") {
      filtered = tickets.filter(ticket => ticket.status.toLowerCase() === status.toLowerCase());
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.category === categoryFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const openTickets = getFilteredTickets("open");
  const inProgressTickets = getFilteredTickets("in progress");
  const resolvedTickets = getFilteredTickets("resolved");

  // Calculate stats
  const totalTickets = tickets.length;
  const openCount = tickets.filter(t => t.status === 'Open').length;
  const urgentTickets = tickets.filter(t => t.priority === 'Urgent' && t.status !== 'Resolved').length;
  const culturalTickets = tickets.filter(t => t.cultural_sensitivity_flag).length;

  const categories = [
    "IT Support", "HR Policy", "Payroll", "Benefits", "Training",
    "Cultural Issues", "Workplace Concern", "General Inquiry"
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
            Support Center
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Employee support tickets and helpdesk management
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Tickets</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalTickets}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Open Tickets</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{openCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Urgent</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{urgentTickets}</p>
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Cultural Issues</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{culturalTickets}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/70 dark:bg-slate-700/70 border-gray-200 dark:border-slate-600"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="px-3 py-2 bg-white/70 dark:bg-slate-700/70 border border-gray-200 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Filter className="w-4 h-4" />
              {getFilteredTickets("all").length} tickets found
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Content */}
      <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-xl">
        <CardHeader className="border-b border-gray-100 dark:border-slate-700">
          <CardTitle className="text-xl text-gray-900 dark:text-white">
            Support Tickets
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="p-6 pb-0">
              <TabsList className="bg-gray-100 dark:bg-slate-700">
                <TabsTrigger value="open" className="relative">
                  Open
                  {openTickets.length > 0 && (
                    <Badge className="ml-2 bg-yellow-500 text-white text-xs">
                      {openTickets.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="in progress">In Progress</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
                <TabsTrigger value="all">All Tickets</TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="open" className="mt-0">
                {isLoading ? (
                  <div className="space-y-4">
                    {Array(3).fill(0).map((_, i) => (
                      <div key={i} className="animate-pulse p-6 rounded-lg bg-gray-100 dark:bg-slate-700 h-32" />
                    ))}
                  </div>
                ) : openTickets.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No Open Tickets
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      All support requests have been addressed
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {openTickets.map((ticket) => (
                      <TicketCard
                        key={ticket.id}
                        ticket={ticket}
                        employee={employees.find(e => e.id === ticket.employee_id)}
                        onClick={() => setSelectedTicket(ticket)}
                        onStatusUpdate={handleStatusUpdate}
                        showActions={true}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="in progress" className="mt-0">
                <div className="space-y-4">
                  {inProgressTickets.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      employee={employees.find(e => e.id === ticket.employee_id)}
                      onClick={() => setSelectedTicket(ticket)}
                      onStatusUpdate={handleStatusUpdate}
                      showActions={true}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="resolved" className="mt-0">
                <div className="space-y-4">
                  {resolvedTickets.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      employee={employees.find(e => e.id === ticket.employee_id)}
                      onClick={() => setSelectedTicket(ticket)}
                      onStatusUpdate={handleStatusUpdate}
                      showActions={false}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="all" className="mt-0">
                <div className="space-y-4">
                  {getFilteredTickets("all").map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      employee={employees.find(e => e.id === ticket.employee_id)}
                      onClick={() => setSelectedTicket(ticket)}
                      onStatusUpdate={handleStatusUpdate}
                      showActions={ticket.status !== 'Resolved' && ticket.status !== 'Closed'}
                    />
                  ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modals */}
      {showCreateModal && (
        <CreateTicketModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTicket}
          employees={employees}
        />
      )}

      {selectedTicket && (
        <TicketModal
          ticket={selectedTicket}
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          employee={employees.find(e => e.id === selectedTicket.employee_id)}
          onUpdate={loadData}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}
