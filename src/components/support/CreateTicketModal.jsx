
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
import { Switch } from "@/components/ui/switch";
import { HelpCircle } from "lucide-react";

const categories = [
  "IT Support", "HR Policy", "Payroll", "Benefits", "Training", 
  "Cultural Issues", "Workplace Concern", "General Inquiry"
];

const priorities = ["Low", "Medium", "High", "Urgent"];

export default function CreateTicketModal({ isOpen, onClose, onSubmit, employees }) {
  const [formData, setFormData] = useState({
    employee_id: '',
    subject: '',
    description: '',
    category: '',
    priority: 'Medium',
    is_anonymous: false,
    cultural_sensitivity_flag: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      
      // Reset form
      setFormData({
        employee_id: '',
        subject: '',
        description: '',
        category: '',
        priority: 'Medium',
        is_anonymous: false,
        cultural_sensitivity_flag: false
      });
    } catch (error) {
      console.error("Error creating support ticket:", error);
    }
    
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-0">
        <DialogHeader className="border-b border-gray-200 dark:border-slate-700 pb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-orange-500 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            Create Support Ticket
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-6">
          {/* Employee Selection */}
          {!formData.is_anonymous && (
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
          )}

          {/* Anonymous Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Submit Anonymously</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Hide your identity when submitting this ticket
              </p>
            </div>
            <Switch
              checked={formData.is_anonymous}
              onCheckedChange={(checked) => handleInputChange('is_anonymous', checked)}
            />
          </div>

          {/* Subject and Category */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-gray-700 dark:text-gray-200">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger className="bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-500">
                  <SelectValue placeholder="Select category" className="text-gray-500 dark:text-gray-400" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-gray-700 dark:text-gray-200">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                <SelectTrigger className="bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-500">
                  <SelectValue className="text-gray-500 dark:text-gray-400" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map(priority => (
                    <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-gray-700 dark:text-gray-200">Subject *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="Brief description of the issue"
              required
              className="bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700 dark:text-gray-200">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Provide detailed information about your request or issue..."
              required
              className="bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-500 placeholder:text-gray-500 dark:placeholder:text-gray-400 h-32"
            />
          </div>

          {/* Cultural Sensitivity Flag */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-lg">🏝️</span>
                Cultural Sensitivity Required
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Check if this issue involves Marshall Islands cultural practices or traditions
              </p>
            </div>
            <Switch
              checked={formData.cultural_sensitivity_flag}
              onCheckedChange={(checked) => handleInputChange('cultural_sensitivity_flag', checked)}
            />
          </div>

          {/* Cultural Sensitivity Help */}
          {formData.cultural_sensitivity_flag && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <span className="text-lg">🏝️</span>
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                    Cultural Awareness Notice
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    This ticket will be handled with special consideration for Marshall Islands cultural practices and traditions.
                    Our team will ensure cultural sensitivity in all communications and solutions.
                  </p>
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
              disabled={isSubmitting || !formData.subject || !formData.description || !formData.category || (!formData.is_anonymous && !formData.employee_id)}
              className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700"
            >
              {isSubmitting ? 'Creating...' : 'Create Ticket'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
