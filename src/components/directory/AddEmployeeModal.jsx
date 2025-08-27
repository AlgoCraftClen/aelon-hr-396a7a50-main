
import React, { useState } from "react";
import { Employee } from "@/api/entities";
import { PrivacyConsent } from "@/api/entities";
import { UploadFile, ExtractDataFromUploadedFile } from "@/api/integrations";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  UserPlus,
  Upload,
  X,
  Bot,
  Shield,
  Plus,
  Loader2,
  Sparkles // Added Sparkles icon
} from "lucide-react";

const departments = ["Administration", "Finance", "Operations", "Human Resources", "IT", "Marketing", "Legal", "Other"];
const employmentTypes = ["Full-time", "Part-time", "Contract", "Temporary"];
const locations = ["Majuro", "Ebeye", "Outer Islands", "Remote"];
const culturalOptions = ["Kemem participation", "Traditional ceremonies", "Irooj obligations", "Mourning practices", "Traditional healing"];

export default function AddEmployeeModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    employee_id: '',
    first_name: '',
    last_name: '',
    middle_name: '',
    department: '',
    position: '',
    employment_type: '',
    start_date: '',
    location: '',
    salary: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    cultural_considerations: [],
    skills: [],
    permit_number: '',
    permit_expiry_date: ''
  });

  // 🔐 NEW: Privacy consent state
  const [privacyConsent, setPrivacyConsent] = useState({
    dataCollection: false,
    emergencyContact: false,
    performanceTracking: false
  });

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  
  // 🤖 AI FILE ANALYSIS STATES
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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

  const handleCulturalChange = (option, checked) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        cultural_considerations: [...prev.cultural_considerations, option]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        cultural_considerations: prev.cultural_considerations.filter(item => item !== option)
      }));
    }
  };

  // 🤖 NEW: AI File Analysis Function
  const handleFileAnalysis = async (file) => {
    if (!file) return;
    
    setIsAnalyzing(true);
    setAnalysisResult(null); // Clear previous analysis result
    try {
      const { file_url } = await UploadFile({ file });
      
      const extractionResult = await ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: "object",
          properties: {
            first_name: { type: "string" },
            last_name: { type: "string" },
            middle_name: { type: "string" },
            employee_id: { type: "string" },
            position: { type: "string" },
            department: { type: "string" },
            employment_type: { type: "string" },
            start_date: { type: "string", format: "date" },
            location: { type: "string" },
            phone: { type: "string" },
            email: { type: "string" },
            emergency_contact_name: { type: "string" },
            emergency_contact_phone: { type: "string" },
            emergency_contact_relationship: { type: "string" },
            skills: { type: "array", items: { type: "string" } },
            experience: { type: "string" },
            education: { type: "string" }
          }
        }
      });

      if (extractionResult.status === 'success' && extractionResult.output) {
        const extracted = extractionResult.output;
        
        // Auto-fill form with extracted data
        setFormData(prev => ({
          ...prev,
          first_name: extracted.first_name || prev.first_name,
          last_name: extracted.last_name || prev.last_name,
          middle_name: extracted.middle_name || prev.middle_name,
          employee_id: extracted.employee_id || prev.employee_id,
          position: extracted.position || prev.position,
          department: departments.includes(extracted.department) ? extracted.department : prev.department,
          employment_type: employmentTypes.includes(extracted.employment_type) ? extracted.employment_type : prev.employment_type,
          start_date: extracted.start_date || prev.start_date,
          location: locations.includes(extracted.location) ? extracted.location : prev.location,
          emergency_contact_name: extracted.emergency_contact_name || prev.emergency_contact_name,
          emergency_contact_phone: extracted.emergency_contact_phone || prev.emergency_contact_phone,
          emergency_contact_relationship: extracted.emergency_contact_relationship || prev.emergency_contact_relationship,
          skills: extracted.skills && Array.isArray(extracted.skills) ? extracted.skills : prev.skills
        }));

        setAnalysisResult({
          success: true,
          message: "Employee information extracted successfully! Please review and verify the auto-filled data.",
          extractedFields: Object.keys(extracted).filter(key => {
            const value = extracted[key];
            if (Array.isArray(value)) return value.length > 0;
            return value;
          })
        });
      } else {
        throw new Error(extractionResult.details || "Could not extract employee data from file");
      }
    } catch (error) {
      console.error("AI Analysis error:", error);
      setAnalysisResult({
        success: false,
        message: `Analysis failed: ${error.message}. Please fill the form manually.`
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setAnalysisResult(null);
      
      // Check if it's an image for profile picture
      if (file.type.startsWith('image/')) {
        setProfileImageFile(file);
        const reader = new FileReader();
        reader.onload = (event) => {
          setImagePreview(event.target.result);
        };
        reader.readAsDataURL(file);
      }
      // Analyze document (including images that might contain text) for employee data
      handleFileAnalysis(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = '';
      if (profileImageFile) {
        const uploadResult = await UploadFile({ file: profileImageFile });
        imageUrl = uploadResult.file_url;
      }

      const submitData = {
        ...formData,
        profile_image_url: imageUrl,
        salary: formData.salary ? parseFloat(formData.salary) : undefined,
        status: 'Active',
        work_permit: (formData.permit_number || formData.permit_expiry_date) ? {
            permit_number: formData.permit_number,
            expiry_date: formData.permit_expiry_date
        } : undefined
      };

      delete submitData.permit_number;
      delete submitData.permit_expiry_date;

      // Create employee record
      const newEmployee = await onSubmit(submitData);

      // 🔐 NEW: Create privacy consent records
      if (newEmployee && newEmployee.id) {
        const consentPromises = [];
        
        if (privacyConsent.dataCollection) {
          consentPromises.push(
            PrivacyConsent.create({
              employee_id: newEmployee.id,
              consent_type: 'data_collection',
              status: 'granted',
              granted_date: new Date().toISOString(),
              version: '1.0',
              data_categories: ['personal_info', 'employment_details', 'contact_info']
            })
          );
        }

        if (privacyConsent.emergencyContact) {
          consentPromises.push(
            PrivacyConsent.create({
              employee_id: newEmployee.id,
              consent_type: 'emergency_contact_sharing',
              status: 'granted',
              granted_date: new Date().toISOString(),
              version: '1.0',
              data_categories: ['emergency_contact']
            })
          );
        }

        if (privacyConsent.performanceTracking) {
          consentPromises.push(
            PrivacyConsent.create({
              employee_id: newEmployee.id,
              consent_type: 'performance_data',
              status: 'granted',
              granted_date: new Date().toISOString(),
              version: '1.0',
              data_categories: ['performance_metrics', 'training_records']
            })
          );
        }

        // Wait for all consent records to be created
        await Promise.all(consentPromises);
      }

      // Reset form and preview
      setFormData({
        employee_id: '',
        first_name: '',
        last_name: '',
        middle_name: '',
        department: '',
        position: '',
        employment_type: '',
        start_date: '',
        location: '',
        salary: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        emergency_contact_relationship: '',
        cultural_considerations: [],
        skills: [],
        permit_number: '',
        permit_expiry_date: ''
      });
      setPrivacyConsent({
        dataCollection: false,
        emergencyContact: false,
        performanceTracking: false
      });
      setProfileImageFile(null);
      setImagePreview(null);
      setUploadedFile(null); // Reset AI uploaded file state
      setAnalysisResult(null); // Reset AI analysis result state
      onClose();
    } catch (error) {
      console.error("Error adding employee:", error);
    }

    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto bg-white dark:bg-slate-800 backdrop-blur-xl border-0">
        <DialogHeader className="border-b border-gray-200 dark:border-slate-700 pb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-orange-500 rounded-xl flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            Add New Employee
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 py-6">
          {/* 🤖 AI-POWERED FILE UPLOAD SECTION */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2 flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-500" />
              AI-Powered Data Extraction
            </h3>
            <div className="p-4 bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
              <div className="flex items-start gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-1">
                    Smart Employee Onboarding
                  </h4>
                  <p className="text-sm text-purple-600 dark:text-purple-400">
                    Upload a resume, CV, or employee document and our AI will automatically extract and fill employee information for you.
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="ai_file_upload">Upload Employee Document or Photo</Label>
                <Input
                  id="ai_file_upload"
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                  className="bg-white/70 dark:bg-slate-700/70"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Supported: PDF, Word documents, text files, or profile images. AI will auto-fill relevant fields.
                </p>
                
                {isAnalyzing && (
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">AI is analyzing the document...</span>
                  </div>
                )}
                
                {analysisResult && (
                  <div className={`p-3 rounded-lg border ${
                    analysisResult.success 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                  }`}>
                    <p className="text-sm font-medium">{analysisResult.message}</p>
                    {analysisResult.success && analysisResult.extractedFields && (
                      <p className="text-xs mt-1">
                        Extracted: {analysisResult.extractedFields.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Picture Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2">
              Profile Picture
            </h3>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <UserPlus className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="profile-upload"
                />
                <Label htmlFor="profile-upload">
                  <Button type="button" variant="outline" className="cursor-pointer" asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </span>
                  </Button>
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Recommended: Square image, max 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="employee_id">Employee ID</Label>
                <Input
                  id="employee_id"
                  value={formData.employee_id}
                  onChange={(e) => handleInputChange('employee_id', e.target.value)}
                  placeholder="EMP001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middle_name">Middle Name</Label>
                <Input
                  id="middle_name"
                  value={formData.middle_name}
                  onChange={(e) => handleInputChange('middle_name', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2">
              Employment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                  <SelectTrigger>
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
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employment_type">Employment Type *</Label>
                <Select value={formData.employment_type} onValueChange={(value) => handleInputChange('employment_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {employmentTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(loc => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2">
              Skills & Competencies
            </h3>
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add a skill"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <Button type="button" onClick={addSkill}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-500" 
                    onClick={() => removeSkill(skill)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Cultural Considerations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2 flex items-center gap-2">
              <span className="text-lg">🏝️</span>
              Cultural Considerations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {culturalOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={option}
                    checked={formData.cultural_considerations.includes(option)}
                    onCheckedChange={(checked) => handleCulturalChange(option, checked)}
                  />
                  <Label htmlFor={option} className="text-sm">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Work Permit */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2">
              Work Permit Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="permit_number">Permit Number</Label>
                <Input
                  id="permit_number"
                  value={formData.permit_number}
                  onChange={(e) => handleInputChange('permit_number', e.target.value)}
                  placeholder="WP-2024-001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="permit_expiry_date">Permit Expiry Date</Label>
                <Input
                  id="permit_expiry_date"
                  type="date"
                  value={formData.permit_expiry_date}
                  onChange={(e) => handleInputChange('permit_expiry_date', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2">
              Emergency Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_name">Contact Name</Label>
                <Input
                  id="emergency_contact_name"
                  value={formData.emergency_contact_name}
                  onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_phone">Phone Number</Label>
                <Input
                  id="emergency_contact_phone"
                  value={formData.emergency_contact_phone}
                  onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_relationship">Relationship</Label>
                <Input
                  id="emergency_contact_relationship"
                  value={formData.emergency_contact_relationship}
                  onChange={(e) => handleInputChange('emergency_contact_relationship', e.target.value)}
                  placeholder="Spouse, Parent, etc."
                />
              </div>
            </div>
          </div>

          {/* 🔐 NEW: Privacy & Consent Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              Privacy & Data Consent
            </h3>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-400 mb-4">
                <strong>Data Protection Notice:</strong> By creating this employee record, you confirm that you have obtained the necessary consents from the employee for data processing in accordance with privacy regulations.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="consent-data"
                    checked={privacyConsent.dataCollection}
                    onCheckedChange={(checked) => setPrivacyConsent({...privacyConsent, dataCollection: checked})}
                  />
                  <div>
                    <Label htmlFor="consent-data" className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Basic Data Collection Consent
                    </Label>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Employee has consented to collection and processing of personal and employment information
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="consent-emergency"
                    checked={privacyConsent.emergencyContact}
                    onCheckedChange={(checked) => setPrivacyConsent({...privacyConsent, emergencyContact: checked})}
                  />
                  <div>
                    <Label htmlFor="consent-emergency" className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Emergency Contact Sharing
                    </Label>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Employee has consented to sharing emergency contact information when necessary
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="consent-performance"
                    checked={privacyConsent.performanceTracking}
                    onCheckedChange={(checked) => setPrivacyConsent({...privacyConsent, performanceTracking: checked})}
                  />
                  <div>
                    <Label htmlFor="consent-performance" className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Performance & Training Data
                    </Label>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Employee has consented to collection of performance metrics and training records
                    </p>
                  </div>
                </div>
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
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Employee'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
