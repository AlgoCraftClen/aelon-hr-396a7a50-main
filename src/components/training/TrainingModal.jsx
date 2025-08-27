import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  GraduationCap, 
  Users, 
  Clock, 
  Play,
  Edit,
  Save,
  X
} from "lucide-react";
import { format } from "date-fns";
import { Training } from "@/api/entities";

export default function TrainingModal({ training, isOpen, onClose, employees, progress, onUpdate }) {
  const [editMode, setEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    title: training?.title || '',
    description: training?.description || '',
    category: training?.category || '',
    type: training?.type || '',
    content_url: training?.content_url || '',
    duration_minutes: training?.duration_minutes || '',
    is_mandatory: training?.is_mandatory || false,
    expiry_months: training?.expiry_months || '',
    passing_score: training?.passing_score || '',
    cultural_relevance: training?.cultural_relevance || 'Not Applicable',
    target_roles: training?.target_roles || []
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveEdit = async () => {
    setIsUpdating(true);
    try {
      const updateData = {
        ...formData,
        duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : undefined,
        expiry_months: formData.expiry_months ? parseInt(formData.expiry_months) : undefined,
        passing_score: formData.passing_score ? parseInt(formData.passing_score) : undefined
      };
      
      await Training.update(training.id, updateData);
      setEditMode(false);
      onUpdate && onUpdate();
    } catch (error) {
      console.error("Error updating training:", error);
    }
    setIsUpdating(false);
  };

  const handleCancelEdit = () => {
    setFormData({
      title: training?.title || '',
      description: training?.description || '',
      category: training?.category || '',
      type: training?.type || '',
      content_url: training?.content_url || '',
      duration_minutes: training?.duration_minutes || '',
      is_mandatory: training?.is_mandatory || false,
      expiry_months: training?.expiry_months || '',
      passing_score: training?.passing_score || '',
      cultural_relevance: training?.cultural_relevance || 'Not Applicable',
      target_roles: training?.target_roles || []
    });
    setEditMode(false);
  };

  if (!training) return null;

  const completedCount = progress.filter(p => p.status === 'Completed').length;
  const inProgressCount = progress.filter(p => p.status === 'In Progress').length;
  const notStartedCount = employees.length - completedCount - inProgressCount;

  const categories = [
    "Safety", "Compliance", "Skills Development", "Cultural Awareness", 
    "Leadership", "Harassment Prevention", "Company Culture", "Technical"
  ];

  const types = ["Video", "Document", "Interactive", "Assessment", "SCORM"];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-0">
        <DialogHeader className="border-b border-gray-200 dark:border-slate-700 pb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {editMode ? (
                    <Input
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="text-2xl font-bold bg-transparent border-none p-0 h-auto focus:ring-0"
                    />
                  ) : (
                    training.title
                  )}
                </DialogTitle>
                <div className="flex items-center gap-3 flex-wrap">
                  {editMode ? (
                    <>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {types.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </>
                  ) : (
                    <>
                      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                        {training.category}
                      </Badge>
                      <Badge variant="outline">
                        {training.type}
                      </Badge>
                      {training.is_mandatory && (
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                          Mandatory
                        </Badge>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            {!editMode && (
              <Button
                onClick={() => setEditMode(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Training
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-8 py-6">
          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Description</h3>
            {editMode ? (
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="h-24 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            ) : (
              <p className="text-gray-700 dark:text-gray-300">{training.description}</p>
            )}
          </div>

          {/* Training Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Training Details</h3>
              
              {editMode ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Duration (minutes)</Label>
                      <Input
                        type="number"
                        value={formData.duration_minutes}
                        onChange={(e) => handleInputChange('duration_minutes', e.target.value)}
                        className="bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Passing Score (%)</Label>
                      <Input
                        type="number"
                        value={formData.passing_score}
                        onChange={(e) => handleInputChange('passing_score', e.target.value)}
                        className="bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Content URL</Label>
                    <Input
                      value={formData.content_url}
                      onChange={(e) => handleInputChange('content_url', e.target.value)}
                      className="bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_mandatory"
                      checked={formData.is_mandatory}
                      onCheckedChange={(checked) => handleInputChange('is_mandatory', checked)}
                    />
                    <Label htmlFor="is_mandatory">Mandatory Training</Label>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {training.duration_minutes && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{training.duration_minutes} minutes</span>
                    </div>
                  )}
                  {training.passing_score && (
                    <div className="flex items-center gap-2 text-sm">
                      <span>Passing Score: {training.passing_score}%</span>
                    </div>
                  )}
                  {training.content_url && (
                    <div className="flex items-center gap-2 text-sm">
                      <Play className="w-4 h-4 text-gray-400" />
                      <a 
                        href={training.content_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        View Training Content
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Progress Stats */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                Progress Overview
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-green-700 dark:text-green-300">Completed</span>
                  <Badge className="bg-green-500 text-white">{completedCount}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-blue-700 dark:text-blue-300">In Progress</span>
                  <Badge className="bg-blue-500 text-white">{inProgressCount}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Not Started</span>
                  <Badge variant="outline">{notStartedCount}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-slate-700 pt-6 flex justify-between">
          <div className="flex gap-3">
            {editMode ? (
              <>
                <Button 
                  onClick={handleSaveEdit} 
                  disabled={isUpdating}
                  className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="outline" onClick={handleCancelEdit} disabled={isUpdating}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </>
            ) : (
              <div />
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