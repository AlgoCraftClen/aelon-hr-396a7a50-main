import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  Calendar,
  Award,
  Building,
  Heart,
  Star
} from "lucide-react";
import { format } from "date-fns";

export default function AlumniTracker({ terminatedEmployees, exitInterviews }) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredAlumni = terminatedEmployees.filter(employee => {
    const fullName = `${employee.first_name} ${employee.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) ||
           employee.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           employee.position?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getExitInterview = (employeeId) => {
    return exitInterviews.find(interview => interview.employee_id === employeeId);
  };

  const getExitReason = (employeeId) => {
    const interview = getExitInterview(employeeId);
    return interview ? interview.reason_for_leaving : 'Not specified';
  };

  const getRehireEligibility = (employeeId) => {
    const interview = getExitInterview(employeeId);
    return interview ? interview.rehire_eligible : null;
  };

  const getSatisfactionRating = (employeeId) => {
    const interview = getExitInterview(employeeId);
    return interview ? interview.satisfaction_rating : null;
  };

  const getYearsOfService = (startDate, endDate) => {
    if (!startDate) return 0;
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const years = (end - start) / (1000 * 60 * 60 * 24 * 365);
    return Math.round(years * 10) / 10;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Alumni Network</h3>
          <p className="text-sm text-gray-400">Maintain relationships with former employees</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search alumni..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-700 focus:border-purple-500 text-white"
            />
          </div>
          <Button 
            variant="outline" 
            className="border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
            disabled
          >
            <Mail className="w-4 h-4 mr-2" />
            Send Newsletter (Soon)
          </Button>
        </div>
      </div>

      {/* Alumni Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800/50 border border-gray-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Total Alumni</p>
                <p className="text-xl font-bold text-white">{terminatedEmployees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border border-gray-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Rehire Eligible</p>
                <p className="text-xl font-bold text-white">
                  {terminatedEmployees.filter(emp => getRehireEligibility(emp.id) === true).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border border-gray-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-sm text-gray-400">Avg Satisfaction</p>
                <p className="text-xl font-bold text-white">
                  {exitInterviews.length > 0 
                    ? (exitInterviews.reduce((sum, interview) => sum + (interview.satisfaction_rating || 0), 0) / exitInterviews.length).toFixed(1)
                    : '—'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border border-gray-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Long Service (5+ years)</p>
                <p className="text-xl font-bold text-white">
                  {terminatedEmployees.filter(emp => getYearsOfService(emp.start_date, emp.contract_end_date) >= 5).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alumni Directory */}
      <Card className="bg-gray-800/50 border border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white">Alumni Directory</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAlumni.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-500" />
              <h3 className="text-lg font-semibold text-white mb-2">
                {terminatedEmployees.length === 0 ? 'No Alumni Yet' : 'No Alumni Found'}
              </h3>
              <p className="text-gray-400">
                {terminatedEmployees.length === 0 
                  ? 'Former employees will appear here to maintain professional relationships'
                  : 'Try adjusting your search terms'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredAlumni.map((employee) => {
                const exitInterview = getExitInterview(employee.id);
                const yearsOfService = getYearsOfService(employee.start_date, employee.contract_end_date);
                const satisfactionRating = getSatisfactionRating(employee.id);
                const isRehireEligible = getRehireEligibility(employee.id);
                
                return (
                  <div key={employee.id} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-white">
                            {employee.first_name} {employee.last_name}
                          </h4>
                          {isRehireEligible === true && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              Rehire Eligible
                            </Badge>
                          )}
                          {yearsOfService >= 5 && (
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                              Long Service
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4" />
                              <span>{employee.position} • {employee.department}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {employee.start_date ? format(new Date(employee.start_date), 'MMM yyyy') : 'Unknown'} - 
                                {employee.contract_end_date ? format(new Date(employee.contract_end_date), 'MMM yyyy') : 'Present'}
                                ({yearsOfService} years)
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <p><strong>Exit Reason:</strong> {getExitReason(employee.id)}</p>
                            {satisfactionRating && (
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400" />
                                <span>{satisfactionRating}/5 satisfaction</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {exitInterview?.cultural_considerations && (
                          <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/30 rounded">
                            <p className="text-sm text-blue-300">
                              <strong>Cultural Notes:</strong> {exitInterview.cultural_considerations}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline" disabled>
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" disabled>
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Future Features Preview */}
      <Card className="bg-gray-800/50 border border-gray-700/50">
        <CardContent className="p-6">
          <h4 className="font-semibold text-white mb-4">Coming Soon: Alumni Engagement Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
              <Mail className="w-8 h-8 text-blue-400 mb-2" />
              <h5 className="font-medium text-white mb-1">Newsletter System</h5>
              <p className="text-sm text-gray-400">Send regular updates and job opportunities to alumni</p>
            </div>
            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
              <Users className="w-8 h-8 text-green-400 mb-2" />
              <h5 className="font-medium text-white mb-1">Referral Program</h5>
              <p className="text-sm text-gray-400">Track and reward alumni who refer successful candidates</p>
            </div>
            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
              <Heart className="w-8 h-8 text-purple-400 mb-2" />
              <h5 className="font-medium text-white mb-1">Events & Reunions</h5>
              <p className="text-sm text-gray-400">Organize cultural celebrations and professional networking events</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}