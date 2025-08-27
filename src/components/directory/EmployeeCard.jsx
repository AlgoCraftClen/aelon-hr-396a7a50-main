import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Calendar, ShieldCheck } from "lucide-react";
import { format, parseISO } from "date-fns";

export default function EmployeeCard({ employee, onClick }) {
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "On Leave":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "Terminated":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  return (
    <div
      className="p-6 rounded-2xl bg-[#24243e]/80 backdrop-blur-sm border border-gray-700/50 hover:border-pink-500/50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-pink-500/10"
      onClick={() => onClick(employee)}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="w-16 h-16 border-2 border-pink-500/50">
          <AvatarImage src={employee.profile_image_url} alt={`${employee.first_name} ${employee.last_name}`} />
          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-500 text-white font-bold text-xl">
            {employee.first_name?.[0]}{employee.last_name?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white truncate">{employee.first_name} {employee.last_name}</h3>
          <p className="text-sm text-gray-400 truncate">{employee.position}</p>
        </div>
      </div>
      
      <Badge className={`mt-1 font-semibold ${getStatusBadgeClass(employee.status)}`}>
        {employee.status}
      </Badge>

      {/* Details */}
      <div className="mt-6 space-y-3 text-sm">
        <div className="flex items-center gap-3 text-gray-300">
          <Building className="w-4 h-4 text-gray-500" />
          <span>{employee.department}</span>
        </div>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>{employee.location}</span>
            </div>
            <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">{employee.location}</Badge>
        </div>
        <div className="flex items-center gap-3 text-gray-300">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span>Started {employee.start_date ? format(parseISO(employee.start_date), "MMM yyyy") : 'N/A'}</span>
        </div>
        
        {employee.work_permit?.permit_number && (
           <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-300">
                    <ShieldCheck className="w-4 h-4 text-gray-500" />
                    <span>Work Permit Holder</span>
                </div>
                <Badge variant="outline" className="border-blue-500/50 text-blue-300 bg-blue-900/30 text-xs">Valid</Badge>
            </div>
        )}
        
        {employee.cultural_considerations?.length > 0 && (
            <div className="flex items-center gap-3 text-purple-300 pt-2 border-t border-gray-700/50 mt-4">
              <span className="text-xl">🏝️</span>
              <span className="italic">Cultural considerations noted</span>
            </div>
        )}
      </div>
    </div>
  );
}