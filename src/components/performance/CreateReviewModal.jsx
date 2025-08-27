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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target } from "lucide-react";

const reviewTypes = ["Annual", "Mid-Year", "Probationary", "Project-Based", "360-Degree"];

export default function CreateReviewModal({ isOpen, onClose, onSubmit, employees }) {
  const [formData, setFormData] = useState({
    employee_id: '',
    reviewer_id: '',
    review_type: '',
    review_period_start: '',
    review_period_end: ''
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
      await onSubmit({
        ...formData,
        status: 'Draft'
      });
      
      // Reset form
      setFormData({
        employee_id: '',
        reviewer_id: '',
        review_type: '',
        review_period_start: '',
        review_period_end: ''
      });
    } catch (error) {
      console.error("Error creating performance review:", error);
    }
    
    setIsSubmitting(false);
  };

  const activeEmployees = employees.filter(emp => emp.status === 'Active');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-0">
        <DialogHeader className="border-b border-gray-200 dark:border-slate-700 pb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            Create Performance Review
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-6">
          {/* Employee Selection */}
          <div className="space-y-2">
            <Label htmlFor="employee_id">Employee *</Label>
            <Select value={formData.employee_id} onValueChange={(value) => handleInputChange('employee_id', value)}>
              <SelectTrigger className="bg-white/70 dark:bg-slate-700/70">
                <SelectValue placeholder="Select employee to review" />
              </SelectTrigger>
              <SelectContent>
                {activeEmployees.map(employee => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.first_name} {employee.last_name} - {employee.position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reviewer Selection */}
          <div className="space-y-2">
            <Label htmlFor="reviewer_id">Reviewer *</Label>
            <Select value={formData.reviewer_id} onValueChange={(value) => handleInputChange('reviewer_id', value)}>
              <SelectTrigger className="bg-white/70 dark:bg-slate-700/70">
                <SelectValue placeholder="Select reviewer" />
              </SelectTrigger>
              <SelectContent>
                {activeEmployees.map(employee => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.first_name} {employee.last_name} - {employee.position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Review Type */}
          <div className="space-y-2">
            <Label htmlFor="review_type">Review Type *</Label>
            <Select value={formData.review_type} onValueChange={(value) => handleInputChange('review_type', value)}>
              <SelectTrigger className="bg-white/70 dark:bg-slate-700/70">
                <SelectValue placeholder="Select review type" />
              </SelectTrigger>
              <SelectContent>
                {reviewTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Review Period */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="review_period_start">Review Period Start *</Label>
              <Input
                id="review_period_start"
                type="date"
                value={formData.review_period_start}
                onChange={(e) => handleInputChange('review_period_start', e.target.value)}
                required
                className="bg-white/70 dark:bg-slate-700/70"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="review_period_end">Review Period End *</Label>
              <Input
                id="review_period_end"
                type="date"
                value={formData.review_period_end}
                onChange={(e) => handleInputChange('review_period_end', e.target.value)}
                required
                min={formData.review_period_start}
                className="bg-white/70 dark:bg-slate-700/70"
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                  Review Setup
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  This will create a draft performance review. You can add goals, ratings, and feedback after creation.
                  The employee will be notified once the review is ready for their input.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-slate-700 pt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.employee_id || !formData.reviewer_id || !formData.review_type || !formData.review_period_start || !formData.review_period_end}
              className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700"
            >
              {isSubmitting ? 'Creating...' : 'Create Review'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}