
import React, { useState, useEffect } from "react";
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
import { UserCheck, Upload } from "lucide-react";
import { UploadFile } from "@/api/integrations";

const departments = [
  "Administration", "Finance", "Operations", "Human Resources", 
  "IT", "Marketing", "Legal", "Other"
];

const locations = ["Majuro", "Ebeye", "Outer Islands", "Remote"];

const employmentTypes = ["Full-time", "Part-time", "Contract", "Temporary"];

const statusOptions = ["Active", "On Leave", "Terminated", "Pending"];

const culturalConsiderations = [
  "Kemem participation",
  "Traditional ceremonies", 
  "Irooj obligations",
  "Mourning practices",
  "Traditional healing"
];

export default function EditEmployeeModal({ isOpen, onClose, onSubmit, employee }) {
  const [formData, setFormData] = useState({
    employee_id: '',
    first_name: '',
    last_name: '',
    middle_name: '',
    department: '',
    position: '',
    employment_type: '',
    start_date: '',
    status: 'Active',
    location: '',
    salary: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    cultural_considerations: [],
    skills: [],
    contract_end_date: '',
    permit_number: '',
    permit_expiry_date: '',
    profile_image_url: ''
  });
  
  const [skillInput, setSkillInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Load employee data when modal opens
  useEffect(() => {
    if (employee && isOpen) {
      setFormData({
        employee_id: employee.employee_id || '',
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        middle_name: employee.middle_name || '',
        department: employee.department || '',
        position: employee.position || '',
        employment_type: employee.employment_type || '',
        start_date: employee.start_date || '',
        status: employee.status || 'Active',
        location: employee.location || '',
        salary: employee.salary ? employee.salary.toString() : '',
        emergency_contact_name: employee.emergency_contact_name || '',
        emergency_contact_phone: employee.emergency_contact_phone || '',
        emergency_contact_relationship: employee.emergency_contact_relationship || '',
        cultural_considerations: employee.cultural_considerations || [],
        skills: employee.skills || [],
        contract_end_date: employee.contract_end_date || '',
        permit_number: employee.work_permit?.permit_number || '',
        permit_expiry_date: employee.work_permit?.expiry_date || '',
        profile_image_url: employee.profile_image_url || ''
      });
      setImagePreview(employee.profile_image_url || null);
      setProfileImageFile(null);
    }
  }, [employee, isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCulturalConsiderationChange = (consideration, checked) => {
    setFormData(prev => ({
      ...prev,
      cultural_considerations: checked
        ? [...prev.cultural_considerations, consideration]
        : prev.cultural_considerations.filter(item => item !== consideration)
    }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let imageUrl = employee.profile_image_url; // Keep old image by default
      if (profileImageFile) {
        const uploadResult = await UploadFile({ file: profileImageFile });
        imageUrl = uploadResult.file_url;
      }
      
      const submitData = {
        ...formData,
        profile_image_url: imageUrl,
        salary: formData.salary ? parseFloat(formData.salary) : undefined
      };

      if (formData.permit_number || formData.permit_expiry_date) {
        submitData.work_permit = {
          permit_number: formData.permit_number,
          expiry_date: formData.permit_expiry_date
        };
      }
      
      delete submitData.permit_number;
      delete submitData.permit_expiry_date;
      
      await onSubmit(employee.id, submitData);
    } catch (error) {
      console.error("Error updating employee:", error);
    }
    
    setIsSubmitting(false);
  };

  if (!employee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-0">
        <DialogHeader className="border-b border-gray-200 dark:border-slate-700 pb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-orange-500 rounded-xl flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            Edit Employee: {employee.first_name} {employee.last_name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 py-6">
          {/* Profile Picture Upload */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2">
              Profile Picture
            </h3>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                  <UserCheck className="w-10 h-10 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <Label htmlFor="profile_picture_edit" className="block mb-2">Change profile image</Label>
                <Input
                  id="profile_picture_edit"
                  type="file"
                  accept="image/png, image/jpeg, image/gif"
                  onChange={handleImageChange}
                  className="bg-white/70 dark:bg-slate-700/70 file:text-purple-700 file:dark:text-purple-300"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">PNG, JPG, or GIF. Max 5MB.</p>
              </div>
            </div>
          </div>
          
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2">
              Basic Information
            </h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employee_id">Employee ID *</Label>
                <Input
                  id="employee_id"
                  value={formData.employee_id}
                  onChange={(e) => handleInputChange('employee_id', e.target.value)}
                  required
                  className="bg-white/70 dark:bg-slate-700/70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  required
                  className="bg-white/70 dark:bg-slate-700/70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  required
                  className="bg-white/70 dark:bg-slate-700/70"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="middle_name">Middle Name</Label>
                <Input
                  id="middle_name"
                  value={formData.middle_name}
                  onChange={(e) => handleInputChange('middle_name', e.target.value)}
                  className="bg-white/70 dark:bg-slate-700/70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  required
                  className="bg-white/70 dark:bg-slate-700/70"
                />
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2">
              Employment Details
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                  <SelectTrigger className="bg-white/70 dark:bg-slate-700/70">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="employment_type">Employment Type *</Label>
                <Select value={formData.employment_type} onValueChange={(value) => handleInputChange('employment_type', value)}>
                  <SelectTrigger className="bg-white/70 dark:bg-slate-700/70">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {employmentTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                  required
                  className="bg-white/70 dark:bg-slate-700/70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger className="bg-white/70 dark:bg-slate-700/70">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                  <SelectTrigger className="bg-white/70 dark:bg-slate-700/70">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Salary (USD)</Label>
                <Input
                  id="salary"
                  type="number"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  className="bg-white/70 dark:bg-slate-700/70"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contract_end_date">Contract End Date</Label>
              <Input
                id="contract_end_date"
                type="date"
                value={formData.contract_end_date}
                onChange={(e) => handleInputChange('contract_end_date', e.target.value)}
                className="bg-white/70 dark:bg-slate-700/70 w-48"
              />
            </div>
          </div>

          {/* Cultural Considerations */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2 flex items-center gap-2">
              <span className="text-xl">🏝️</span>
              Cultural Considerations
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {culturalConsiderations.map((consideration) => (
                <div key={consideration} className="flex items-center space-x-2">
                  <Checkbox
                    id={consideration}
                    checked={formData.cultural_considerations.includes(consideration)}
                    onCheckedChange={(checked) => handleCulturalConsiderationChange(consideration, checked)}
                  />
                  <Label 
                    htmlFor={consideration}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {consideration}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2">
              Skills & Expertise
            </h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  className="bg-white/70 dark:bg-slate-700/70"
                />
                <Button type="button" onClick={addSkill} variant="outline">
                  Add
                </Button>
              </div>
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 text-purple-500 hover:text-purple-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Work Permit */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2">
              Work Permit Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="permit_number">Permit Number</Label>
                <Input
                  id="permit_number"
                  value={formData.permit_number}
                  onChange={(e) => handleInputChange('permit_number', e.target.value)}
                  className="bg-white/70 dark:bg-slate-700/70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="permit_expiry_date">Expiry Date</Label>
                <Input
                  id="permit_expiry_date"
                  type="date"
                  value={formData.permit_expiry_date}
                  onChange={(e) => handleInputChange('permit_expiry_date', e.target.value)}
                  className="bg-white/70 dark:bg-slate-700/70"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2">
              Emergency Contact
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_name">Contact Name</Label>
                <Input
                  id="emergency_contact_name"
                  value={formData.emergency_contact_name}
                  onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                  className="bg-white/70 dark:bg-slate-700/70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_phone">Contact Phone</Label>
                <Input
                  id="emergency_contact_phone"
                  value={formData.emergency_contact_phone}
                  onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                  className="bg-white/70 dark:bg-slate-700/70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_relationship">Relationship</Label>
                <Input
                  id="emergency_contact_relationship"
                  value={formData.emergency_contact_relationship}
                  onChange={(e) => handleInputChange('emergency_contact_relationship', e.target.value)}
                  placeholder="Spouse, Parent, etc."
                  className="bg-white/70 dark:bg-slate-700/70"
                />
              </div>
            </div>
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
              {isSubmitting ? 'Updating...' : 'Update Employee'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
