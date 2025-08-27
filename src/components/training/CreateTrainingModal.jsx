
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
import { Checkbox } from "@/components/ui/checkbox";
import { GraduationCap } from "lucide-react";

const categories = [
  "Safety", "Compliance", "Skills Development", "Cultural Awareness", 
  "Leadership", "Harassment Prevention", "Company Culture", "Technical"
];

const types = ["Video", "Document", "Interactive", "Assessment", "SCORM"];

const culturalRelevanceLevels = ["High", "Medium", "Low", "Not Applicable"];

export default function CreateTrainingModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: '',
    content_url: '',
    duration_minutes: '',
    is_mandatory: false,
    expiry_months: '',
    passing_score: '',
    cultural_relevance: 'Not Applicable',
    target_roles: []
  });
  
  const [roleInput, setRoleInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addRole = () => {
    if (roleInput.trim() && !formData.target_roles.includes(roleInput.trim())) {
      setFormData(prev => ({
        ...prev,
        target_roles: [...prev.target_roles, roleInput.trim()]
      }));
      setRoleInput('');
    }
  };

  const removeRole = (roleToRemove) => {
    setFormData(prev => ({
      ...prev,
      target_roles: prev.target_roles.filter(role => role !== roleToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const submitData = {
        ...formData,
        duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : undefined,
        expiry_months: formData.expiry_months ? parseInt(formData.expiry_months) : undefined,
        passing_score: formData.passing_score ? parseInt(formData.passing_score) : undefined
      };
      
      await onSubmit(submitData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        type: '',
        content_url: '',
        duration_minutes: '',
        is_mandatory: false,
        expiry_months: '',
        passing_score: '',
        cultural_relevance: 'Not Applicable',
        target_roles: []
      });
    } catch (error) {
      console.error("Error creating training:", error);
    }
    
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-0">
        <DialogHeader className="border-b border-gray-200 dark:border-slate-700 pb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-orange-500 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            Create Training Program
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2">
              Basic Information
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-700 dark:text-gray-200">Training Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Workplace Safety Training"
                  required
                  className="bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration_minutes" className="text-gray-700 dark:text-gray-200">Duration (minutes)</Label>
                <Input
                  id="duration_minutes"
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => handleInputChange('duration_minutes', e.target.value)}
                  placeholder="30"
                  className="bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700 dark:text-gray-200">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what this training covers..."
                required
                className="bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-500 placeholder:text-gray-500 dark:placeholder:text-gray-400 h-24"
              />
            </div>
          </div>

          {/* Training Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2">
              Training Details
            </h3>
            
            <div className="grid md:grid-cols-3 gap-4">
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
                <Label htmlFor="type" className="text-gray-700 dark:text-gray-200">Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger className="bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-500">
                    <SelectValue placeholder="Select type" className="text-gray-500 dark:text-gray-400" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cultural_relevance" className="text-gray-700 dark:text-gray-200">Cultural Relevance</Label>
                <Select value={formData.cultural_relevance} onValueChange={(value) => handleInputChange('cultural_relevance', value)}>
                  <SelectTrigger className="bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-500">
                    <SelectValue className="text-gray-500 dark:text-gray-400" />
                  </SelectTrigger>
                  <SelectContent>
                    {culturalRelevanceLevels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content_url" className="text-gray-700 dark:text-gray-200">Content URL</Label>
              <Input
                id="content_url"
                value={formData.content_url}
                onChange={(e) => handleInputChange('content_url', e.target.value)}
                placeholder="https://..."
                className="bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Requirements & Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2">
              Requirements & Settings
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_mandatory"
                  checked={formData.is_mandatory}
                  onCheckedChange={(checked) => handleInputChange('is_mandatory', checked)}
                />
                <Label htmlFor="is_mandatory" className="text-sm font-medium">
                  This is a mandatory training
                </Label>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry_months" className="text-gray-700 dark:text-gray-200">Expires after (months)</Label>
                  <Input
                    id="expiry_months"
                    type="number"
                    value={formData.expiry_months}
                    onChange={(e) => handleInputChange('expiry_months', e.target.value)}
                    placeholder="12"
                    className="bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passing_score" className="text-gray-700 dark:text-gray-200">Passing Score (%)</Label>
                  <Input
                    id="passing_score"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.passing_score}
                    onChange={(e) => handleInputChange('passing_score', e.target.value)}
                    placeholder="80"
                    className="bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Target Roles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2">
              Target Roles (Optional)
            </h3>
            
            <div className="flex gap-2">
              <Input
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                placeholder="Add target role..."
                className="bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRole())}
              />
              <Button type="button" onClick={addRole} variant="outline">
                Add
              </Button>
            </div>
            
            {formData.target_roles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.target_roles.map((role, index) => (
                  <div key={index} className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-md text-sm">
                    {role}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRole(role)}
                      className="h-auto p-0 ml-1 text-purple-700 dark:text-purple-300 hover:text-red-600"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-slate-700 pt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700"
            >
              {isSubmitting ? 'Creating...' : 'Create Training'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
