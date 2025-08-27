import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon 
} from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";

export default function LeaveCalendar({ leaveRequests, employees }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getLeaveForDate = (date) => {
    return leaveRequests.filter(leave => {
      const startDate = new Date(leave.start_date);
      const endDate = new Date(leave.end_date);
      return date >= startDate && date <= endDate;
    });
  };

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  return (
    <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-0 shadow-lg">
      <CardHeader className="border-b border-gray-100 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            {format(currentDate, 'MMMM yyyy')}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={previousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {daysInMonth.map(date => {
            const leavesForDay = getLeaveForDate(date);
            const isToday = isSameDay(date, new Date());
            
            return (
              <div
                key={date.toISOString()}
                className={`min-h-24 p-2 border rounded-lg transition-colors ${
                  isToday 
                    ? 'bg-purple-100 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700' 
                    : 'bg-gray-50 dark:bg-slate-700/50 border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isToday 
                    ? 'text-purple-700 dark:text-purple-300' 
                    : isSameMonth(date, currentDate)
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-400 dark:text-gray-600'
                }`}>
                  {format(date, 'd')}
                </div>
                
                <div className="space-y-1">
                  {leavesForDay.slice(0, 2).map((leave, index) => {
                    const employee = employees.find(e => e.id === leave.employee_id);
                    return (
                      <div
                        key={index}
                        className="text-xs p-1 rounded bg-purple-200 dark:bg-purple-800/50 text-purple-800 dark:text-purple-200 truncate"
                        title={`${employee?.first_name} ${employee?.last_name} - ${leave.leave_type}`}
                      >
                        {employee?.first_name?.[0]}{employee?.last_name?.[0]} - {leave.leave_type.split(' ')[0]}
                      </div>
                    );
                  })}
                  {leavesForDay.length > 2 && (
                    <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
                      +{leavesForDay.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-600">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-200 dark:bg-purple-800/50 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Leave Period</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-100 dark:bg-purple-900/20 rounded border border-purple-300 dark:border-purple-700"></div>
              <span className="text-gray-600 dark:text-gray-400">Today</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}