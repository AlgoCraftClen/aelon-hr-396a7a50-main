import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Calendar, FileText, Shield } from "lucide-react";

// Sample compliance alerts including cultural considerations
const complianceAlerts = [
  {
    id: 1,
    type: "urgent",
    title: "Work Permit Expiring Soon",
    description: "John Doe's work permit expires on March 15, 2024",
    dueDate: "2024-03-15",
    category: "Work Permits",
    icon: FileText
  },
  {
    id: 2,
    type: "warning",
    title: "Constitution Day Approaching",
    description: "May 1st is Constitution Day - public holiday in Marshall Islands",
    dueDate: "2024-05-01",
    category: "Public Holiday",
    icon: Calendar
  },
  {
    id: 3,
    type: "info",
    title: "Cultural Leave Policy Review",
    description: "Annual review of cultural leave policies due for Kemem and traditional ceremonies",
    dueDate: "2024-04-30",
    category: "Policy Review",
    icon: Shield
  },
  {
    id: 4,
    type: "warning",
    title: "Nuclear Victims Remembrance Day",
    description: "March 1st - ensure appropriate workplace sensitivity and observance",
    dueDate: "2024-03-01",
    category: "Cultural Observance",
    icon: Calendar
  }
];

export default function ComplianceAlerts() {
  const getBorderColor = (type) => {
    switch (type) {
      case 'urgent': return 'border-red-500';
      case 'warning': return 'border-yellow-500';
      case 'info': return 'border-blue-500';
      default: return 'border-gray-500';
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'urgent': return 'text-red-600 dark:text-red-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'info': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getIconBgColor = (type) => {
    switch (type) {
      case 'urgent': return 'bg-red-100 dark:bg-red-900/20';
      case 'warning': return 'bg-yellow-100 dark:bg-yellow-900/20';
      case 'info': return 'bg-blue-100 dark:bg-blue-900/20';
      default: return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  // Sort alerts by urgency and date
  const sortedAlerts = complianceAlerts
    .sort((a, b) => {
      const urgencyOrder = { urgent: 3, warning: 2, info: 1 };
      if (urgencyOrder[a.type] !== urgencyOrder[b.type]) {
        return urgencyOrder[b.type] - urgencyOrder[a.type];
      }
      return new Date(a.dueDate) - new Date(b.dueDate);
    })
    .slice(0, 4);

  return (
    <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-xl">
      <CardHeader className="border-b border-gray-100 dark:border-slate-700">
        <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Compliance & Cultural Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {sortedAlerts.map((alert) => {
            const Icon = alert.icon;
            const daysUntilDue = Math.ceil((new Date(alert.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
            
            return (
              <div 
                key={alert.id}
                className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 ${getBorderColor(alert.type)}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${getIconBgColor(alert.type)}`}>
                    <Icon className={`w-5 h-5 ${getIconColor(alert.type)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-md leading-tight">
                        {alert.title}
                      </h4>
                      <Badge variant="outline" className="text-xs shrink-0">{alert.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {alert.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-medium">
                        {daysUntilDue > 0 ? `${daysUntilDue} days left` : daysUntilDue === 0 ? 'Due Today' : 'Overdue'}
                      </span>
                      {alert.category === 'Cultural Observance' && (
                        <span className="flex items-center gap-1">🇲🇭 Cultural Note</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}