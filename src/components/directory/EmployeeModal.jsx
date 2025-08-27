import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Briefcase,
  FileText,
  Shield,
  Edit,
  Building,
  Clock,
  Users,
  Award,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { GuestActionButton } from "../auth/GuestActionBlocker";

export default function EmployeeModal({ 
  employee, 
  isOpen, 
  onClose, 
  onUpdate, 
  onEdit 
}) {
  const [activeTab, setActiveTab] = useState("overview");

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'On Leave': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'Terminated': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getEmploymentTypeColor = (type) => {
    switch(type) {
      case 'Full-time': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Part-time': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'Contract': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
        <DialogHeader className="border-b border-slate-700 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {employee.first_name?.[0]}{employee.last_name?.[0]}
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white">
                  {employee.first_name} {employee.last_name}
                </DialogTitle>
                <DialogDescription className="text-slate-300">
                  {employee.position} • {employee.department}
                </DialogDescription>
              </div>
            </div>
            <GuestActionButton actionName="Edit Employee">
              <Button
                onClick={() => onEdit(employee)}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Employee
              </Button>
            </GuestActionButton>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="bg-slate-700">
            <TabsTrigger value="overview" className="text-slate-300 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="documents" className="text-slate-300 data-[state=active]:text-white">
              Documents
            </TabsTrigger>
            <TabsTrigger value="payroll" className="text-slate-300 data-[state=active]:text-white">
              Payroll
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-400" />
                    Employee Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Status</span>
                    <Badge className={getStatusColor(employee.status)}>
                      {employee.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Employment Type</span>
                    <Badge className={getEmploymentTypeColor(employee.employment_type)}>
                      {employee.employment_type}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Employee ID</span>
                    <span className="text-white font-medium">{employee.employee_id || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Start Date</span>
                    <span className="text-white font-medium">
                      {employee.start_date ? format(new Date(employee.start_date), 'MMM dd, yyyy') : 'N/A'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-400" />
                    Location & Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Location</span>
                    <span className="text-white font-medium">{employee.location || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Department</span>
                    <span className="text-white font-medium">{employee.department}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Position</span>
                    <span className="text-white font-medium">{employee.position}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {employee.emergency_contact_name && (
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Phone className="w-5 h-5 text-green-400" />
                    Emergency Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-slate-400 text-sm">Name</span>
                    <p className="text-white font-medium">{employee.emergency_contact_name}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-sm">Phone</span>
                    <p className="text-white font-medium">{employee.emergency_contact_phone || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-sm">Relationship</span>
                    <p className="text-white font-medium">{employee.emergency_contact_relationship || 'N/A'}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {employee.cultural_considerations && employee.cultural_considerations.length > 0 && (
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <span className="text-xl">🏝️</span>
                    Cultural Considerations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {employee.cultural_considerations.map((consideration, index) => (
                      <Badge key={index} variant="outline" className="border-purple-500/30 text-purple-300">
                        {consideration}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {employee.skills && employee.skills.length > 0 && (
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-400" />
                    Skills & Competencies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {employee.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="border-blue-500/30 text-blue-300">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {employee.work_permit && employee.work_permit.permit_number && (
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-400" />
                    Work Permit Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 text-sm">Permit Number</span>
                    <p className="text-white font-medium">{employee.work_permit.permit_number}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-sm">Expiry Date</span>
                    <p className="text-white font-medium">
                      {employee.work_permit.expiry_date 
                        ? format(new Date(employee.work_permit.expiry_date), 'MMM dd, yyyy')
                        : 'N/A'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  Employee Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                {employee.documents && employee.documents.length > 0 ? (
                  <div className="space-y-3">
                    {employee.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-600/50 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{doc.name}</p>
                          <p className="text-slate-400 text-sm">{doc.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-400 text-sm">
                            Uploaded: {doc.upload_date ? format(new Date(doc.upload_date), 'MMM dd, yyyy') : 'N/A'}
                          </p>
                          {doc.expiry_date && (
                            <p className="text-orange-400 text-sm">
                              Expires: {format(new Date(doc.expiry_date), 'MMM dd, yyyy')}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-slate-500" />
                    <p className="text-slate-400">No documents uploaded</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payroll" className="mt-6">
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-green-400" />
                  Payroll Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {employee.payroll ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-400 text-sm">Base Salary</span>
                        <p className="text-white font-medium text-lg">
                          ${employee.payroll.base_salary?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-sm">Pay Grade</span>
                        <p className="text-white font-medium">{employee.payroll.pay_grade || 'N/A'}</p>
                      </div>
                    </div>

                    {employee.payroll.deductions && employee.payroll.deductions.length > 0 && (
                      <div>
                        <h4 className="text-white font-medium mb-2">Deductions</h4>
                        <div className="space-y-2">
                          {employee.payroll.deductions.map((deduction, index) => (
                            <div key={index} className="flex justify-between p-2 bg-slate-600/50 rounded">
                              <span className="text-slate-300">{deduction.name}</span>
                              <span className="text-white">${deduction.amount}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {employee.payroll.bonuses && employee.payroll.bonuses.length > 0 && (
                      <div>
                        <h4 className="text-white font-medium mb-2">Bonuses</h4>
                        <div className="space-y-2">
                          {employee.payroll.bonuses.map((bonus, index) => (
                            <div key={index} className="flex justify-between p-2 bg-slate-600/50 rounded">
                              <span className="text-slate-300">{bonus.name}</span>
                              <span className="text-green-400">${bonus.amount}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 text-slate-500" />
                    <p className="text-slate-400">No payroll information available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}