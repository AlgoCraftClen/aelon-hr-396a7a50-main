import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Calendar, 
  Users, 
  CheckCircle,
  Clock,
  Shield,
  Bot,
  Download
} from "lucide-react";
import { format } from "date-fns";

const statusColors = {
  'Active': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  'Draft': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  'Under Review': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  'Archived': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
};

export default function PolicyModal({ policy, isOpen, onClose, acknowledgments, employees, onUpdate }) {
  const [activeTab, setActiveTab] = useState("content");

  if (!policy) return null;

  const acknowledgedCount = acknowledgments.filter(a => a.status === 'Acknowledged').length;
  const totalEmployees = employees.filter(e => e.status === 'Active').length;
  const acknowledgmentRate = totalEmployees > 0 ? (acknowledgedCount / totalEmployees) * 100 : 0;
  
  const isOverdue = policy.review_date && new Date(policy.review_date) < new Date();

  const aiReview = policy.ai_review_notes ? JSON.parse(policy.ai_review_notes) : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-0">
        <DialogHeader className="border-b border-gray-200 dark:border-slate-700 pb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-orange-500 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            {policy.title}
          </DialogTitle>
          <div className="flex items-center gap-3 mt-3">
            <Badge className={statusColors[policy.status]}>
              {policy.status}
            </Badge>
            <Badge variant="outline">
              v{policy.version}
            </Badge>
            <Badge variant="outline">
              {policy.category}
            </Badge>
            {isOverdue && (
              <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                Review Overdue
              </Badge>
            )}
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-100 dark:bg-slate-700">
            <TabsTrigger value="content">Policy Content</TabsTrigger>
            <TabsTrigger value="acknowledgments">Acknowledgments</TabsTrigger>
            {aiReview && <TabsTrigger value="ai-review">AI Review</TabsTrigger>}
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <div className="prose max-w-none dark:prose-invert">
              <div className="p-6 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {policy.content}
                </p>
              </div>
            </div>

            {policy.cultural_considerations && (
              <div className="p-4 bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2 flex items-center gap-2">
                  <span className="text-lg">🏝️</span>
                  Cultural Considerations
                </h4>
                <p className="text-purple-600 dark:text-purple-400 text-sm">
                  {policy.cultural_considerations}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="acknowledgments" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {acknowledgedCount}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">Acknowledged</p>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                  {totalEmployees - acknowledgedCount}
                </p>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">Pending</p>
              </div>

              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {Math.round(acknowledgmentRate)}%
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">Completion Rate</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-900 dark:text-white">Acknowledgment Progress</h4>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {acknowledgedCount} of {totalEmployees} employees
                </span>
              </div>
              <Progress value={acknowledgmentRate} className="h-3" />
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">Employee Status</h4>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {employees.filter(e => e.status === 'Active').map(employee => {
                  const ack = acknowledgments.find(a => a.employee_id === employee.id);
                  return (
                    <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {employee.first_name} {employee.last_name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {employee.position} - {employee.department}
                        </p>
                      </div>
                      {ack?.status === 'Acknowledged' ? (
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">
                            {format(new Date(ack.acknowledged_date), 'MMM d')}
                          </span>
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                          Pending
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {aiReview && (
            <TabsContent value="ai-review" className="space-y-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-semibold text-blue-700 dark:text-blue-300">
                    AI Compliance Review
                  </h4>
                </div>
                
                {aiReview.compliance_score && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Compliance Score
                      </span>
                      <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
                        {Math.round(aiReview.compliance_score * 100)}%
                      </span>
                    </div>
                    <Progress value={aiReview.compliance_score * 100} className="h-2" />
                  </div>
                )}

                {aiReview.recommendations && aiReview.recommendations.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Recommendations</h5>
                    <ul className="space-y-1">
                      {aiReview.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-blue-600 dark:text-blue-400 flex items-start gap-2">
                          <span className="text-blue-400">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiReview.cultural_considerations && aiReview.cultural_considerations.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-medium text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-1">
                      <span className="text-sm">🏝️</span>
                      Cultural Considerations
                    </h5>
                    <ul className="space-y-1">
                      {aiReview.cultural_considerations.map((consideration, index) => (
                        <li key={index} className="text-sm text-blue-600 dark:text-blue-400 flex items-start gap-2">
                          <span className="text-blue-400">•</span>
                          {consideration}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiReview.legal_gaps && aiReview.legal_gaps.length > 0 && (
                  <div>
                    <h5 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Legal Gaps Identified</h5>
                    <ul className="space-y-1">
                      {aiReview.legal_gaps.map((gap, index) => (
                        <li key={index} className="text-sm text-blue-600 dark:text-blue-400 flex items-start gap-2">
                          <span className="text-blue-400">•</span>
                          {gap}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>
          )}

          <TabsContent value="details" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Effective Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {format(new Date(policy.effective_date), 'MMMM d, yyyy')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Review Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {policy.review_date ? format(new Date(policy.review_date), 'MMMM d, yyyy') : 'Not set'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Version</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {policy.version}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Requires Acknowledgment</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {policy.requires_acknowledgment ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Created</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {format(new Date(policy.created_date), 'MMMM d, yyyy')}
                    </p>
                  </div>
                </div>

                {policy.ai_review_notes && (
                  <div className="flex items-center gap-3">
                    <Bot className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">AI Enhanced</p>
                      <p className="font-medium text-purple-600 dark:text-purple-400">
                        Reviewed and optimized
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="border-t border-gray-200 dark:border-slate-700 pt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {policy.document_url && (
            <Button className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}