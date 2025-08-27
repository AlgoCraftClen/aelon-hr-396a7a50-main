import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Star, 
  User, 
  Target,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp
} from "lucide-react";
import { format } from "date-fns";

const statusColors = {
  'Draft': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  'Pending Employee Review': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  'Completed': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  'Approved': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
};

const reviewTypeColors = {
  'Annual': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
  'Mid-Year': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  'Probationary': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
  'Project-Based': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  '360-Degree': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400'
};

export default function ReviewCard({ review, employee, reviewer, onClick }) {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  const getProgress = () => {
    if (review.status === 'Approved') return 100;
    if (review.status === 'Completed') return 90;
    if (review.status === 'Pending Employee Review') return 70;
    return 30;
  };

  return (
    <Card 
      className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] group"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
            {employee?.first_name?.[0]?.toUpperCase()}{employee?.last_name?.[0]?.toUpperCase()}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {employee?.first_name} {employee?.last_name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {employee?.position} • {employee?.department}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge className={statusColors[review.status]}>
                  {review.status}
                </Badge>
                <Badge className={reviewTypeColors[review.review_type] || reviewTypeColors['Annual']}>
                  {review.review_type}
                </Badge>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>
                  {format(new Date(review.review_period_start), 'MMM yyyy')} - {format(new Date(review.review_period_end), 'MMM yyyy')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <User className="w-4 h-4" />
                <span>Reviewer: {reviewer?.first_name} {reviewer?.last_name}</span>
              </div>
              {review.overall_rating && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    {renderStars(review.overall_rating)}
                  </div>
                  <span className="font-medium">{review.overall_rating}/5</span>
                </div>
              )}
            </div>

            {review.cultural_adaptability && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm">🏝️</span>
                <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                  Cultural Adaptability: {review.cultural_adaptability}/5
                </span>
              </div>
            )}

            {review.goals && review.goals.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Goals Progress</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {review.goals.slice(0, 3).map((goal, index) => (
                    <Badge 
                      key={index}
                      variant="outline" 
                      className={`text-xs ${
                        goal.status === 'Completed' || goal.status === 'Exceeded'
                          ? 'border-green-300 text-green-700 dark:border-green-700 dark:text-green-300'
                          : goal.status === 'In Progress'
                          ? 'border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300'
                          : 'border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {goal.status}
                    </Badge>
                  ))}
                  {review.goals.length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +{review.goals.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Progress Indicator */}
            <div className="pt-3 border-t border-gray-100 dark:border-slate-600">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Review Progress</span>
                <span className="font-medium text-gray-900 dark:text-white">{getProgress()}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgress()}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}