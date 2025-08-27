import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Calendar, 
  Users, 
  CheckCircle,
  AlertTriangle,
  Shield
} from "lucide-react";
import { format } from "date-fns";

const statusColors = {
  'Active': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  'Draft': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  'Under Review': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  'Archived': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
};

const categoryColors = {
  'Employment': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  'Safety': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  'Harassment': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
  'Leave': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  'Code of Conduct': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
  'IT Policy': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  'Cultural Guidelines': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
  'Compliance': 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400',
  'Remote Work': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400'
};

export default function PolicyCard({ policy, acknowledgments, employees, onClick }) {
  const acknowledgedCount = acknowledgments.filter(a => a.status === 'Acknowledged').length;
  const totalEmployees = employees.filter(e => e.status === 'Active').length;
  const acknowledgmentRate = totalEmployees > 0 ? (acknowledgedCount / totalEmployees) * 100 : 0;
  
  const isOverdue = policy.review_date && new Date(policy.review_date) < new Date();
  
  return (
    <Card 
      className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] group"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {policy.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {policy.content.substring(0, 150)}...
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge className={statusColors[policy.status]}>
                  {policy.status}
                </Badge>
                <Badge className={categoryColors[policy.category] || categoryColors['Employment']}>
                  {policy.category}
                </Badge>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>
                  Effective: {format(new Date(policy.effective_date), 'MMM d, yyyy')}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-xs">v{policy.version}</span>
                {isOverdue && (
                  <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-xs font-medium">Review Overdue</span>
                  </div>
                )}
              </div>
              
              {policy.requires_acknowledgment && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{acknowledgedCount}/{totalEmployees} acknowledged</span>
                </div>
              )}
            </div>

            {policy.cultural_considerations && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm">🏝️</span>
                <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                  Cultural considerations included
                </span>
              </div>
            )}

            {policy.requires_acknowledgment && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Acknowledgment Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {Math.round(acknowledgmentRate)}%
                  </span>
                </div>
                <Progress value={acknowledgmentRate} className="h-2" />
                {acknowledgmentRate < 100 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {totalEmployees - acknowledgedCount} employees need to acknowledge this policy
                  </p>
                )}
              </div>
            )}

            {policy.ai_review_notes && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    AI-Enhanced Policy
                  </span>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  This policy has been reviewed and enhanced by AI for compliance and cultural sensitivity.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}