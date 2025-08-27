import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function StatsCard({ 
  title, 
  value, 
  total, 
  icon: Icon, 
  color = "from-purple-500 to-orange-500", 
  change,
  changeType = "neutral",
  urgent = false 
}) {
  
  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return "text-green-600 dark:text-green-400";
      case 'negative':
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };
  
  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg">
      <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 bg-gradient-to-r ${color} rounded-full opacity-10`} />
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <div className={`p-2 rounded-xl bg-gradient-to-r ${color} shadow-lg`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </span>
          {total && (
            <span className="text-lg text-gray-500 dark:text-gray-400">
              / {total}
            </span>
          )}
          {urgent && (
            <Badge variant="destructive" className="ml-auto">
              Urgent
            </Badge>
          )}
        </div>
        
        {change && (
          <div className="flex items-center gap-1">
            {getChangeIcon()}
            <span className={`text-sm font-medium ${getChangeColor()}`}>
              {change}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              vs last month
            </span>
          </div>
        )}
        
        {total && (
          <div className="mt-3">
            <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-slate-700">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${color} transition-all duration-500`}
                style={{ width: `${Math.min((value / total) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {total ? ((value / total) * 100).toFixed(1) : 0}% of total
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}