
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";

const leaveTypes = [
  "Annual Leave", "Sick Leave", "Cultural Leave", "Bereavement Leave", 
  "Maternity Leave", "Paternity Leave", "Emergency Leave", "Unpaid Leave"
];

const culturalContexts = [
  "Not Applicable", 
  "Kemem Celebrations", 
  "Funeral/Mourning Period", 
  "Irooj Obligations", 
  "Traditional Healing",
  "Gospel Day Observance",
  "Nuclear Victims Remembrance",
  "Independence Day Activities",
  "Fisherman's Day Participation",
  "Constitution Day Events",
  "Other Cultural Event"
];

const publicHolidays = [
  { date: "01-01", name: "New Year's Day" },
  { date: "03-01", name: "Nuclear Victims Remembrance Day" },
  { date: "05-01", name: "Constitution Day" },
  { date: "07-01", name: "Fisherman's Day" },
  { date: "09-27", name: "Gospel Day" }, // Approximate - last Friday of September
  { date: "10-21", name: "Independence Day" },
  { date: "12-25", name: "Christmas Day" }
];

export default function CreateLeaveModal({ isOpen, onClose, onSubmit, employees }) {
  const [formData, setFormData] = useState({
    employee_id: '',
    leave_type: '',
    start_date: '',
    end_date: '',
    reason: '',
    cultural_context: 'Not Applicable'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [holidayWarning, setHolidayWarning] = useState('');

  const checkForPublicHolidays = (startDateStr, endDateStr) => {
    if (!startDateStr || !endDateStr) {
      setHolidayWarning('');
      return;
    }
    
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    start.setHours(0,0,0,0); // Normalize to start of day
    end.setHours(23,59,59,999); // Normalize to end of day

    const overlappingHolidays = new Set();
    
    const startYear = start.getFullYear();
    const endYear = end.getFullYear();

    for (let year = startYear; year <= endYear; year++) {
      publicHolidays.forEach(holiday => {
        const holidayParts = holiday.date.split('-');
        const month = parseInt(holidayParts[0], 10) - 1; // Month is 0-indexed
        const day = parseInt(holidayParts[1], 10);
        
        const holidayDate = new Date(year, month, day);
        holidayDate.setHours(0,0,0,0); // Normalize to start of day

        if (holidayDate >= start && holidayDate <= end) {
          overlappingHolidays.add(holiday.name);
        }
      });
    }
    
    if (overlappingHolidays.size > 0) {
      setHolidayWarning(`Note: Your leave period includes these public holidays: ${Array.from(overlappingHolidays).join(', ')}`);
    } else {
      setHolidayWarning('');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Calculate total days when dates change
      if ((field === 'start_date' || field === 'end_date') && updated.start_date && updated.end_date) {
        const start = new Date(updated.start_date);
        const end = new Date(updated.end_date);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
        updated.total_days = diffDays;
        
        // Check for public holidays
        checkForPublicHolidays(updated.start_date, updated.end_date);
      } else if (field === 'start_date' || field === 'end_date') {
        // If one date is cleared, clear total_days and warning
        updated.total_days = undefined;
        setHolidayWarning('');
      }
      
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        ...formData,
        status: 'Pending'
      });
      
      // Reset form
      setFormData({
        employee_id: '',
        leave_type: '',
        start_date: '',
        end_date: '',
        reason: '',
        cultural_context: 'Not Applicable'
      });
      setHolidayWarning(''); // Clear warning on submit
    } catch (error) {
      console.error("Error creating leave request:", error);
    }
    
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-0">
        <DialogHeader className="border-b border-gray-200 dark:border-slate-700 pb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            Request Leave
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-6">
          {/* Employee Selection */}
          <div className="space-y-2">
            <Label htmlFor="employee_id" className="text-gray-700 dark:text-gray-200">Employee *</Label>
            <Select value={formData.employee_id} onValueChange={(value) => handleInputChange('employee_id', value)}>
              <SelectTrigger className="bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-500">
                <SelectValue placeholder="Select employee" className="text-gray-500 dark:text-gray-400" />
              </SelectTrigger>
              <SelectContent>
                {employees.filter(emp => emp.status === 'Active').map(employee => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.first_name} {employee.last_name} - {employee.position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Leave Type and Cultural Context */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="leave_type" className="text-gray-700 dark:text-gray-200">Leave Type *</Label>
              <Select value={formData.leave_type} onValueChange={(value) => handleInputChange('leave_type', value)}>
                <SelectTrigger className="bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-500">
                  <SelectValue placeholder="Select leave type" className="text-gray-500 dark:text-gray-400" />
                </SelectTrigger>
                <SelectContent>
                  {leaveTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cultural_context" className="text-gray-700 dark:text-gray-200">Cultural Context</Label>
              <Select value={formData.cultural_context} onValueChange={(value) => handleInputChange('cultural_context', value)}>
                <SelectTrigger className="bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-500">
                  <SelectValue placeholder="Select context" className="text-gray-500 dark:text-gray-400" />
                </SelectTrigger>
                <SelectContent>
                  {culturalContexts.map(context => (
                    <SelectItem key={context} value={context}>
                      {context === 'Not Applicable' ? context : `🏝️ ${context}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date" className="text-gray-700 dark:text-gray-200">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                required
                className="bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date" className="text-gray-700 dark:text-gray-200">End Date *</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
                required
                min={formData.start_date}
                className="bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-500"
              />
            </div>
          </div>

          {/* Holiday Warning */}
          {holidayWarning && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                📅 {holidayWarning}
              </p>
            </div>
          )}

          {/* Total Days Display */}
          {formData.total_days && (
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Total leave duration: <span className="font-semibold">{formData.total_days} day{formData.total_days !== 1 ? 's' : ''}</span>
              </p>
            </div>
          )}

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-gray-700 dark:text-gray-200">Reason for Leave *</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              placeholder="Please provide details about your leave request..."
              required
              className="bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-500 placeholder:text-gray-500 dark:placeholder:text-gray-400 h-24"
            />
          </div>

          {/* Enhanced Cultural Context Help */}
          {formData.cultural_context !== 'Not Applicable' && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <span className="text-lg">🇲🇭</span>
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                    Marshall Islands Cultural Leave Guidelines
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
                    Cultural leave requests are given special consideration in accordance with Marshall Islands customs and traditions.
                  </p>
                  
                  {/* Specific guidance based on cultural context */}
                  {formData.cultural_context === 'Kemem Celebrations' && (
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      <strong>Kemem:</strong> First birthday celebrations are significant family events requiring cultural participation.
                    </p>
                  )}
                  {formData.cultural_context === 'Funeral/Mourning Period' && (
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      <strong>Mourning Period:</strong> Immediate family members are typically granted 3-5 days for funeral and mourning obligations.
                    </p>
                  )}
                  {formData.cultural_context === 'Irooj Obligations' && (
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      <strong>Irooj Obligations:</strong> Community participation in traditional ceremonies led by chiefs is an important cultural responsibility.
                    </p>
                  )}
                  {formData.cultural_context === 'Traditional Healing' && (
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      <strong>Traditional Healing:</strong> Traditional healing practices are recognized as valid cultural leave reasons.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 dark:border-slate-700 pt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.employee_id || !formData.leave_type || !formData.start_date || !formData.end_date || !formData.reason}
              className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700"
            >
              {isSubmitting ? 'Creating...' : 'Create Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
