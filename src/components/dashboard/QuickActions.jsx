
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  UserPlus, 
  FileText, 
  Calendar, 
  GraduationCap, 
  Zap 
} from "lucide-react";

const quickActions = [
  {
    title: "Add Employee",
    description: "Register new team member",
    icon: UserPlus,
    href: createPageUrl("EmployeeDirectory"),
    color: "from-blue-500 to-teal-500"
  },
  {
    title: "Create Policy",
    description: "Draft new HR policy",
    icon: FileText,
    href: createPageUrl("Compliance"),
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Schedule Training",
    description: "Plan employee training",
    icon: GraduationCap,
    href: createPageUrl("TrainingCenter"),
    color: "from-orange-500 to-red-500"
  },
  {
    title: "Review Leaves",
    description: "Approve pending requests",
    icon: Calendar,
    href: createPageUrl("LeaveManagement"),
    color: "from-green-500 to-emerald-500"
  }
];

export default function QuickActions() {
  return (
    <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-xl">
      <CardHeader className="border-b border-gray-100 dark:border-slate-700">
        <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
          <Zap className="w-5 h-5 text-orange-500" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            
            return (
              <Link key={index} to={action.href}>
                <Button
                  variant="outline"
                  className={`w-full h-auto p-4 flex flex-col items-center justify-center gap-2 bg-gradient-to-br ${action.color} text-white hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl border border-white/20 dark:border-transparent`}
                >
                  <Icon className="w-6 h-6 text-white" />
                  <div className="text-center">
                    <div className="font-medium text-white text-sm">
                      {action.title}
                    </div>
                    <div className="text-xs text-white/80 mt-1">
                      {action.description}
                    </div>
                  </div>
                </Button>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
