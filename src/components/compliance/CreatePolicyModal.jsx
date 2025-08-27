
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
import { Badge } from "@/components/ui/badge"; // Added Badge import
import { FileText, Bot, Upload, Loader2 } from "lucide-react";
import { UploadFile, ExtractDataFromUploadedFile, InvokeLLM } from "@/api/integrations"; // Added InvokeLLM import

const categories = [
  "Employment", "Safety", "Harassment", "Leave", "Code of Conduct",
  "IT Policy", "Cultural Guidelines", "Compliance", "Remote Work"
];

export default function CreatePolicyModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    effective_date: '',
    review_date: '',
    requires_acknowledgment: true,
    cultural_considerations: '',
    legal_references: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [policyFile, setPolicyFile] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState(null); // New state for AI suggestions

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e) => {
    setPolicyFile(e.target.files[0]);
    setAnalysisError("");
    setAiSuggestions(null); // Clear AI suggestions when a new file is selected
  };

  const handleAnalyzeFile = async () => {
    if (!policyFile) {
      setAnalysisError("Please select a file to analyze.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError("");
    setAiSuggestions(null); // Clear previous AI suggestions before new analysis

    try {
      const { file_url } = await UploadFile({ file: policyFile });

      const extractionResult = await ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: "object",
          properties: {
            title: { type: "string", description: "The main title of the policy document." },
            category: {
              type: "string",
              description: `A suitable category for this policy from this list: ${categories.join(', ')}`
            },
            content: { type: "string", description: "The full text content of the policy document, preserving all formatting like paragraphs and lists." }
          }
        }
      });

      if (extractionResult.status === 'success' && extractionResult.output) {
        const { title, category, content } = extractionResult.output;
        setFormData(prev => ({
          ...prev,
          title: title || prev.title,
          category: category || prev.category,
          content: content || prev.content,
        }));

        // 🤖 AI ENHANCEMENT: Get suggestions for improvement
        if (content) {
          const aiEnhancementResult = await InvokeLLM({ // Renamed variable to avoid conflict
            prompt: `Review this HR policy for the Marshall Islands context and provide suggestions for improvement:

Title: ${title}
Category: ${category}
Content: ${content}

Please analyze for:
1. Compliance with Marshall Islands labor laws
2. Cultural sensitivity for Marshallese customs and traditions
3. Clarity and enforceability
4. Missing sections that should be included
5. Specific recommendations for improvement

Provide a structured response with actionable suggestions.`,
            response_json_schema: {
              type: "object",
              properties: {
                compliance_score: { type: "number", description: "Score from 1-10 for legal compliance" },
                cultural_score: { type: "number", description: "Score from 1-10 for cultural sensitivity" },
                clarity_score: { type: "number", description: "Score from 1-10 for clarity" },
                recommendations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      type: { type: "string", enum: ["legal", "cultural", "clarity", "addition"] },
                      suggestion: { type: "string" },
                      priority: { type: "string", enum: ["high", "medium", "low"] }
                    }
                  }
                },
                improved_content: { type: "string", description: "Enhanced version of the policy content" },
                missing_sections: { type: "array", items: { type: "string" } }
              }
            }
          });

          // Assuming InvokeLLM returns { status: 'success', output: {...} } or directly the JSON object
          if (aiEnhancementResult.status === 'success' && aiEnhancementResult.output) {
            setAiSuggestions(aiEnhancementResult.output);
          } else if (aiEnhancementResult && !aiEnhancementResult.status) { // Case where InvokeLLM directly returns JSON
            setAiSuggestions(aiEnhancementResult);
          } else {
            console.warn("InvokeLLM did not return expected output structure:", aiEnhancementResult);
            setAnalysisError(`AI enhancement failed: ${aiEnhancementResult.details || "Unknown error"}`);
          }
        }
      } else {
        throw new Error(extractionResult.details || "Failed to extract data from the document.");
      }

    } catch (error) {
      console.error("Error analyzing file:", error);
      setAnalysisError(`Analysis failed: ${error.message}`);
    }

    setIsAnalyzing(false);
  };

  const applyAISuggestions = () => {
    if (aiSuggestions && aiSuggestions.improved_content) {
      setFormData(prev => ({
        ...prev,
        content: aiSuggestions.improved_content
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        ...formData,
        status: 'Draft',
        version: '1.0'
      });

      // Reset form
      setFormData({
        title: '',
        category: '',
        content: '',
        effective_date: '',
        review_date: '',
        requires_acknowledgment: true,
        cultural_considerations: '',
        legal_references: []
      });
      setPolicyFile(null); // Clear file input as well
      setAnalysisError(""); // Clear any analysis errors
      setAiSuggestions(null); // Clear AI suggestions on successful submission
    } catch (error) {
      console.error("Error creating policy:", error);
    }

    setIsSubmitting(false);
  };

  const generateReviewDate = () => {
    if (formData.effective_date) {
      const effectiveDate = new Date(formData.effective_date);
      const reviewDate = new Date(effectiveDate.setFullYear(effectiveDate.getFullYear() + 1));
      handleInputChange('review_date', reviewDate.toISOString().split('T')[0]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-0">
        <DialogHeader className="border-b border-gray-200 dark:border-slate-700 pb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-orange-500 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            Create New Policy
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-6">
          {/* 🤖 AI FILE UPLOAD & ANALYSIS */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2 flex items-center gap-2">
              <Bot className="w-5 h-5" />
              AI Document Analysis & Enhancement
            </h3>
            <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <Label htmlFor="policy_file">Upload Existing Policy (Optional)</Label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Upload a document (PDF, DOCX) and our AI will extract content and provide Marshall Islands-specific improvements.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  id="policy_file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt"
                  className="flex-1 bg-white/70 dark:bg-slate-700/70"
                />
                <Button
                  type="button"
                  onClick={handleAnalyzeFile}
                  disabled={isAnalyzing || !policyFile}
                  className="w-full sm:w-auto"
                >
                  {isAnalyzing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  Analyze with AI
                </Button>
              </div>
              {analysisError && <p className="text-red-500 text-sm mt-2">{analysisError}</p>}
            </div>

            {/* 🤖 AI SUGGESTIONS DISPLAY */}
            {aiSuggestions && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                    <Bot className="w-5 h-5" />
                    AI Analysis Results
                  </h4>
                  <Button
                    type="button"
                    onClick={applyAISuggestions}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Apply Improvements
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {aiSuggestions.compliance_score}/10
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Legal Compliance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {aiSuggestions.cultural_score}/10
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Cultural Sensitivity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {aiSuggestions.clarity_score}/10
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Clarity</div>
                  </div>
                </div>

                {aiSuggestions.recommendations && aiSuggestions.recommendations.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-medium text-blue-700 dark:text-blue-300">Recommendations:</h5>
                    {aiSuggestions.recommendations.slice(0, 3).map((rec, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <Badge className={
                          rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                          rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {rec.priority}
                        </Badge>
                        <span className="text-gray-700 dark:text-gray-300">{rec.suggestion}</span>
                      </div>
                    ))}
                    {aiSuggestions.recommendations.length > 3 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            ... more recommendations available upon full review.
                        </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2">
              Policy Information
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Policy Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Remote Work Policy"
                  required
                  className="bg-white/70 dark:bg-slate-700/70"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger className="bg-white/70 dark:bg-slate-700/70">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Policy Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Enter the full policy content here..."
                required
                className="h-64 bg-white/70 dark:bg-slate-700/70"
              />
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Bot className="w-4 h-4" />
                <span>AI will review and enhance this policy for compliance and cultural sensitivity</span>
              </div>
            </div>
          </div>

          {/* Dates and Settings */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2">
              Policy Settings
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="effective_date">Effective Date *</Label>
                <Input
                  id="effective_date"
                  type="date"
                  value={formData.effective_date}
                  onChange={(e) => {
                    handleInputChange('effective_date', e.target.value);
                    setTimeout(generateReviewDate, 100);
                  }}
                  required
                  className="bg-white/70 dark:bg-slate-700/70"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="review_date">Review Date</Label>
                <Input
                  id="review_date"
                  type="date"
                  value={formData.review_date}
                  onChange={(e) => handleInputChange('review_date', e.target.value)}
                  className="bg-white/70 dark:bg-slate-700/70"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  When this policy should be reviewed next
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Requires Employee Acknowledgment</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Employees must acknowledge they have read and understood this policy
                </p>
              </div>
              <Switch
                checked={formData.requires_acknowledgment}
                onCheckedChange={(checked) => handleInputChange('requires_acknowledgment', checked)}
              />
            </div>
          </div>

          {/* Cultural Considerations */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-2 flex items-center gap-2">
              <span className="text-xl">🏝️</span>
              Cultural Considerations
            </h3>

            <div className="space-y-2">
              <Label htmlFor="cultural_considerations">Cultural Guidelines</Label>
              <Textarea
                id="cultural_considerations"
                value={formData.cultural_considerations}
                onChange={(e) => handleInputChange('cultural_considerations', e.target.value)}
                placeholder="Describe any special considerations for Marshall Islands culture, traditions, or customs..."
                className="h-24 bg-white/70 dark:bg-slate-700/70"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Include any cultural sensitivities, traditional practices, or local customs that should be considered
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                  AI-Enhanced Policy Creation
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Our AI assistant will review your policy for compliance with Marshall Islands labor laws,
                  cultural sensitivity, and best practices. It will suggest improvements and ensure all
                  necessary legal requirements are covered.
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
              disabled={isSubmitting || !formData.title || !formData.category || !formData.content || !formData.effective_date}
              className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700"
            >
              {isSubmitting ? 'Creating & AI Reviewing...' : 'Create Policy'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
