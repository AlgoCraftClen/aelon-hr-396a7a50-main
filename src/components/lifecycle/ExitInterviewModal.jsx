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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Star } from "lucide-react";

export default function ExitInterviewModal({ isOpen, onClose, employee, onSubmit }) {
  const [formData, setFormData] = useState({
    exit_date: new Date(),
    reason_for_leaving: '',
    satisfaction_rating: 3,
    would_recommend_company: true,
    feedback_positive: '',
    feedback_improvement: '',
    cultural_considerations: '',
    exit_checklist_completed: false,
    final_pay_processed: false,
    equipment_returned: false,
    access_revoked: false,
    rehire_eligible: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, satisfaction_rating: rating });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto bg-white/95 dark:bg-[#24243e]/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white">
        <DialogHeader className="border-b border-gray-200 dark:border-gray-700/50 pb-4">
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Exit Interview - {employee?.first_name} {employee?.last_name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Exit Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Exit Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-white">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(formData.exit_date, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.exit_date}
                      onSelect={(date) => setFormData({ ...formData, exit_date: date })}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Reason for Leaving</Label>
                <Select value={formData.reason_for_leaving} onValueChange={(value) => setFormData({ ...formData, reason_for_leaving: value })}>
                  <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="resignation">Resignation</SelectItem>
                    <SelectItem value="termination">Termination</SelectItem>
                    <SelectItem value="retirement">Retirement</SelectItem>
                    <SelectItem value="contract_end">Contract End</SelectItem>
                    <SelectItem value="relocation">Relocation</SelectItem>
                    <SelectItem value="family_reasons">Family Reasons</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Satisfaction Rating */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Feedback</h3>
            
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Overall Satisfaction Rating</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleRatingClick(rating)}
                    className={`p-2 rounded-lg transition-colors ${
                      formData.satisfaction_rating >= rating
                        ? 'text-yellow-400'
                        : 'text-gray-600'
                    }`}
                  >
                    <Star className="w-6 h-6 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">What did you enjoy most about working here?</Label>
              <Textarea
                value={formData.feedback_positive}
                onChange={(e) => setFormData({ ...formData, feedback_positive: e.target.value })}
                className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">What could we improve?</Label>
              <Textarea
                value={formData.feedback_improvement}
                onChange={(e) => setFormData({ ...formData, feedback_improvement: e.target.value })}
                className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Cultural Considerations (Marshall Islands specific)</Label>
              <Textarea
                value={formData.cultural_considerations}
                onChange={(e) => setFormData({ ...formData, cultural_considerations: e.target.value })}
                placeholder="Any cultural factors that influenced your experience or decision..."
                className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                rows={2}
              />
            </div>
          </div>

          {/* Exit Checklist */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Exit Checklist</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-gray-700 dark:text-gray-300">Exit checklist completed</Label>
                <Switch
                  checked={formData.exit_checklist_completed}
                  onCheckedChange={(checked) => setFormData({ ...formData, exit_checklist_completed: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-gray-700 dark:text-gray-300">Final pay processed</Label>
                <Switch
                  checked={formData.final_pay_processed}
                  onCheckedChange={(checked) => setFormData({ ...formData, final_pay_processed: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-gray-700 dark:text-gray-300">Equipment returned</Label>
                <Switch
                  checked={formData.equipment_returned}
                  onCheckedChange={(checked) => setFormData({ ...formData, equipment_returned: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-gray-700 dark:text-gray-300">System access revoked</Label>
                <Switch
                  checked={formData.access_revoked}
                  onCheckedChange={(checked) => setFormData({ ...formData, access_revoked: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-gray-700 dark:text-gray-300">Eligible for rehire</Label>
                <Switch
                  checked={formData.rehire_eligible}
                  onCheckedChange={(checked) => setFormData({ ...formData, rehire_eligible: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-gray-700 dark:text-gray-300">Would recommend company to others</Label>
                <Switch
                  checked={formData.would_recommend_company}
                  onCheckedChange={(checked) => setFormData({ ...formData, would_recommend_company: checked })}
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700/50">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700"
            >
              Complete Exit Interview
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}