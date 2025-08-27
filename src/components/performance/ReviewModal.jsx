import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Star, 
  Target, 
  Plus,
  X,
  User,
  Calendar,
  TrendingUp
} from "lucide-react";
import { format } from "date-fns";
import { PerformanceReview } from "@/api/entities";

const goalStatuses = ["Not Started", "In Progress", "Completed", "Exceeded"];

export default function ReviewModal({ review, isOpen, onClose, employee, reviewer, onUpdate }) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    overall_rating: review.overall_rating || '',
    cultural_adaptability: review.cultural_adaptability || '',
    strengths: review.strengths || '',
    areas_for_improvement: review.areas_for_improvement || '',
    development_plan: review.development_plan || '',
    goals: review.goals || [],
    status: review.status || 'Draft'
  });

  if (!review || !employee) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addGoal = () => {
    setFormData(prev => ({
      ...prev,
      goals: [...prev.goals, { goal: '', status: 'Not Started', notes: '' }]
    }));
  };

  const updateGoal = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.map((goal, i) => 
        i === index ? { ...goal, [field]: value } : goal
      )
    }));
  };

  const removeGoal = (index) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index)
    }));
  };

  const renderStars = (rating, editable = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 cursor-pointer ${
          i < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300 dark:text-gray-600'
        } ${editable ? 'hover:text-yellow-300' : ''}`}
        onClick={editable ? () => handleInputChange('overall_rating', i + 1) : undefined}
      />
    ));
  };

  const handleSave = async () => {
    try {
      // Use the PerformanceReview entity to update the review
      await PerformanceReview.update(review.id, formData);
      setEditMode(false);
      onUpdate && onUpdate();
    } catch (error) {
      console.error("Error updating review:", error);
      alert("Failed to update review. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-0">
        <DialogHeader className="border-b border-gray-200 dark:border-slate-700 pb-6">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-orange-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-xl">
              {employee.first_name?.[0]?.toUpperCase()}{employee.last_name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Performance Review - {employee.first_name} {employee.last_name}
              </DialogTitle>
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-400">
                  {employee.position} • {employee.department}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(review.review_period_start), 'MMM yyyy')} - {format(new Date(review.review_period_end), 'MMM yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>Reviewer: {reviewer?.first_name} {reviewer?.last_name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                    {review.review_type}
                  </Badge>
                  <Badge className={
                    review.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                    review.status === 'Completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                  }>
                    {review.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-8 py-6">
          {/* Overall Rating */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Overall Rating</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {renderStars(formData.overall_rating, editMode)}
              </div>
              {formData.overall_rating && (
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  {formData.overall_rating}/5
                </span>
              )}
            </div>
          </div>

          {/* Cultural Adaptability */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="text-xl">🏝️</span>
              Cultural Adaptability
            </h3>
            {editMode ? (
              <Select value={formData.cultural_adaptability.toString()} onValueChange={(value) => handleInputChange('cultural_adaptability', parseInt(value))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(rating => (
                    <SelectItem key={rating} value={rating.toString()}>{rating}/5</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {renderStars(formData.cultural_adaptability)}
                </div>
                {formData.cultural_adaptability && (
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formData.cultural_adaptability}/5
                  </span>
                )}
              </div>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              How well the employee adapts to and respects Marshall Islands cultural practices and workplace customs.
            </p>
          </div>

          {/* Goals */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Target className="w-5 h-5" />
                Goals & Objectives
              </h3>
              {editMode && (
                <Button onClick={addGoal} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Goal
                </Button>
              )}
            </div>
            
            <div className="space-y-3">
              {formData.goals.map((goal, index) => (
                <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50">
                  {editMode ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Input
                          placeholder="Goal description..."
                          value={goal.goal}
                          onChange={(e) => updateGoal(index, 'goal', e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          onClick={() => removeGoal(index)}
                          size="icon"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <Select value={goal.status} onValueChange={(value) => updateGoal(index, 'status', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {goalStatuses.map(status => (
                              <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="Notes..."
                          value={goal.notes}
                          onChange={(e) => updateGoal(index, 'notes', e.target.value)}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="font-medium text-gray-900 dark:text-white">{goal.goal}</p>
                        <Badge className={
                          goal.status === 'Completed' || goal.status === 'Exceeded'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : goal.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                        }>
                          {goal.status}
                        </Badge>
                      </div>
                      {goal.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{goal.notes}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Sections */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Strengths</h3>
              {editMode ? (
                <Textarea
                  value={formData.strengths}
                  onChange={(e) => handleInputChange('strengths', e.target.value)}
                  placeholder="What are this employee's key strengths?"
                  className="h-32"
                />
              ) : (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-gray-900 dark:text-white">{formData.strengths || 'No strengths noted yet.'}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Areas for Improvement</h3>
              {editMode ? (
                <Textarea
                  value={formData.areas_for_improvement}
                  onChange={(e) => handleInputChange('areas_for_improvement', e.target.value)}
                  placeholder="What areas could be improved?"
                  className="h-32"
                />
              ) : (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-gray-900 dark:text-white">{formData.areas_for_improvement || 'No areas for improvement noted yet.'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Development Plan */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Development Plan
            </h3>
            {editMode ? (
              <Textarea
                value={formData.development_plan}
                onChange={(e) => handleInputChange('development_plan', e.target.value)}
                placeholder="What is the plan for this employee's professional development?"
                className="h-32"
              />
            ) : (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-gray-900 dark:text-white">{formData.development_plan || 'No development plan defined yet.'}</p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-slate-700 pt-6 flex justify-between">
          <div className="flex gap-3">
            {review.status !== 'Approved' && (
              <>
                {editMode ? (
                  <>
                    <Button onClick={handleSave} className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700">
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setEditMode(false)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setEditMode(true)} variant="outline">
                    Edit Review
                  </Button>
                )}
              </>
            )}
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}