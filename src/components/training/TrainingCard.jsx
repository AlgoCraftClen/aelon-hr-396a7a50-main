import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  FileText, 
  Clock, 
  Award,
  Shield,
  Users,
  CheckCircle
} from "lucide-react";

const categoryColors = {
  'Safety': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  'Compliance': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  'Skills Development': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  'Cultural Awareness': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
  'Leadership': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
  'Harassment Prevention': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
  'Company Culture': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
  'Technical': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
};

const typeIcons = {
  'Video': Play,
  'Document': FileText,
  'Interactive': Users,
  'Assessment': Award,
  'SCORM': Shield
};

export default function TrainingCard({ training, progress = [], onClick }) {
  const Icon = typeIcons[training.type] || FileText;
  const completionRate = progress.length > 0 
    ? (progress.filter(p => p.status === 'Completed').length / progress.length) * 100 
    : 0;

  return (
    <Card 
      className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 group"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
              {training.title}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {training.description}
            </p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shrink-0">
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-3">
          <Badge className={categoryColors[training.category] || categoryColors['Technical']}>
            {training.category}
          </Badge>
          {training.is_mandatory && (
            <Badge variant="outline" className="border-red-300 dark:border-red-700 text-red-700 dark:text-red-300">
              Mandatory
            </Badge>
          )}
          {training.cultural_relevance && training.cultural_relevance !== 'Not Applicable' && (
            <Badge variant="outline" className="border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300">
              🏝️ Cultural
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Training Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{training.duration_minutes || 30} min</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4" />
              <span>{progress.length} enrolled</span>
            </div>
          </div>

          {/* Progress */}
          {progress.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Completion Rate</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {Math.round(completionRate)}%
                </span>
              </div>
              <Progress value={completionRate} className="h-2" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {progress.filter(p => p.status === 'Completed').length} of {progress.length} completed
              </p>
            </div>
          )}

          {/* Additional Info */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-700">
            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {training.type} Training
            </span>
            {training.passing_score && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Pass: {training.passing_score}%
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}