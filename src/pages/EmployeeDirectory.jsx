
// CHANGELOG REF: /components/changelog.md - Complete UI overhaul to match dark theme design.
import React, { useState, useEffect } from "react";
import { Employee } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  Users
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';
import EmployeeCard from "../components/directory/EmployeeCard";
import EmployeeModal from "../components/directory/EmployeeModal";
import AddEmployeeModal from "../components/directory/AddEmployeeModal";
import EditEmployeeModal from "../components/directory/EditEmployeeModal";
import { useGuestMode } from "../components/auth/GuestModeProvider";
import { GuestActionButton } from "../components/auth/GuestActionBlocker";
import { withErrorHandling } from '../components/utils/errorHandler';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorBoundary from '../components/common/ErrorBoundary';

export default function EmployeeDirectory() {
  const navigate = useNavigate();
  const { isGuestMode } = useGuestMode(); // Keep isGuestMode for potential future use or conditional messages
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [permitFilter, setPermitFilter] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
        const data = await withErrorHandling(
          () => Employee.list('-created_date'),
          []
        );
        setEmployees(data);
    } catch (error) {
        console.error("Error loading employee data:", error);
        // Set empty array as fallback
        setEmployees([]);
    }
    setIsLoading(false);
  };

  const handleShowAddModal = () => {
    setShowAddModal(true);
  };

  const handleCardClick = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleAddEmployee = async (employeeData) => {
    try {
      await Employee.create(employeeData);
      await loadData();
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding employee:", error);
      // Could show toast notification here
      alert("Unable to add employee. Please check your connection and try again.");
    }
  };

  const handleEditEmployee = async (employeeId, employeeData) => {
    try {
      await Employee.update(employeeId, employeeData);
      await loadData();
      setEditingEmployee(null);
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("Unable to update employee. Please check your connection and try again.");
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = !searchTerm ||
      `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter;
    const matchesLocation = locationFilter === "all" || employee.location === locationFilter;

    const hasPermit = employee.work_permit && employee.work_permit.permit_number;
    const matchesPermit = permitFilter === "all" ||
        (permitFilter === 'with' && hasPermit) ||
        (permitFilter === 'without' && !hasPermit);

    return matchesSearch && matchesDepartment && matchesLocation && matchesPermit;
  });

  const departments = [...new Set(employees.map(emp => emp.department).filter(Boolean))];
  const locations = [...new Set(employees.map(emp => emp.location).filter(Boolean))];

  if (isLoading) {
    return (
      <ErrorBoundary>
        <div className="p-6 md:p-8">
          <LoadingSpinner size="lg" text="Loading employee directory..." />
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="p-6 md:p-8 space-y-6 text-white">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Employee Directory
            </h1>
            {/* FIXED: Enhanced contrast for subtitle */}
            <p className="text-gray-300 dark:text-slate-300 mt-1 font-medium">
              Manage your team members and their information
            </p>
          </div>
          <GuestActionButton
            actionName="Add Employee"
          >
            <Button onClick={handleShowAddModal} className="btn-primary-gradient font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </GuestActionButton>
        </div>

        {/* Filters */}
        <div className="p-4 rounded-xl bg-[#24243e]/80 backdrop-blur-sm border border-gray-700/50">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-700 focus:border-pink-500"
                  // Removed disabled={isGuestMode} to allow guests to filter
                />
              </div>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="bg-gray-800/50 border-gray-700 focus:ring-pink-500">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="bg-gray-800/50 border-gray-700 focus:ring-pink-500">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={permitFilter} onValueChange={setPermitFilter}>
                <SelectTrigger className="bg-gray-800/50 border-gray-700 focus:ring-pink-500">
                  <SelectValue placeholder="Work Permit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Permit Status</SelectItem>
                  <SelectItem value="with">With Permit</SelectItem>
                  <SelectItem value="without">Without Permit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mt-4 px-1">
                <Users className="w-4 h-4" />
                <span>{filteredEmployees.length} of {employees.length} employees</span>
            </div>
        </div>

        {/* Employee Grid - REMOVED GuestActionButton wrapper to allow viewing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onClick={() => handleCardClick(employee)}
            />
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="p-12 text-center rounded-xl bg-[#24243e]/80">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              <h3 className="text-lg font-semibold text-white mb-2">
                No employees found
              </h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your search filters or add new employees to get started.
              </p>
              <GuestActionButton
                actionName="Add First Employee"
              >
                <Button onClick={handleShowAddModal} className="btn-primary-gradient font-semibold">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Employee
                </Button>
              </GuestActionButton>
          </div>
        )}

        {/* Modals - These will now be accessible to guests for viewing */}
        {selectedEmployee && (
          <EmployeeModal
            employee={selectedEmployee}
            isOpen={!!selectedEmployee}
            onClose={() => setSelectedEmployee(null)}
            onUpdate={loadData}
            onEdit={(employee) => {
              setSelectedEmployee(null);
              setEditingEmployee(employee);
            }}
          />
        )}
        {editingEmployee && (
          <EditEmployeeModal
            employee={editingEmployee}
            isOpen={!!editingEmployee}
            onClose={() => setEditingEmployee(null)}
            onSubmit={handleEditEmployee}
          />
        )}
        {showAddModal && (
          <AddEmployeeModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddEmployee}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
