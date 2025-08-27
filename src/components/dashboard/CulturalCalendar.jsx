
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

const culturalEvents = [
  // Public Holidays (Fixed Dates)
  {
    date: "2024-01-01",
    name: "New Year's Day",
    type: "Public Holiday",
    description: "New Year celebration",
    isPublicHoliday: true
  },
  {
    date: "2024-01-08", // First Monday of January (approximated)
    name: "Nitijela Opening",
    type: "Traditional Event",
    description: "Parliament opening with traditional welcome ceremonies",
    isPublicHoliday: false
  },
  {
    date: "2024-03-01",
    name: "Nuclear Victims Remembrance Day",
    type: "Public Holiday",
    description: "Honors those affected by nuclear testing",
    isPublicHoliday: true
  },
  {
    date: "2024-03-08",
    name: "International Women's Day",
    type: "Optional Event",
    description: "Often celebrated with workplace events",
    isPublicHoliday: false
  },
  {
    date: "2024-05-01",
    name: "Constitution Day",
    type: "Public Holiday",
    description: "National holiday celebrating the Marshall Islands' constitution",
    isPublicHoliday: true
  },
  {
    date: "2024-07-01",
    name: "Fisherman's Day",
    type: "Public Holiday",
    description: "Public holiday honoring local fishers and ocean traditions",
    isPublicHoliday: true
  },
  {
    date: "2024-09-27", // Last Friday of September (approximated for 2024)
    name: "Gospel Day",
    type: "Public Holiday",
    description: "Celebrates the introduction of Christianity",
    isPublicHoliday: true
  },
  {
    date: "2024-10-21",
    name: "Independence Day",
    type: "Public Holiday",
    description: "Marks RMI's full independence",
    isPublicHoliday: true
  },
  {
    date: "2024-12-25",
    name: "Christmas Day",
    type: "Public Holiday",
    description: "Christian holiday celebration",
    isPublicHoliday: true
  }
];

// Traditional/Customary Events (these are variable dates, shown as examples)
const traditionalEvents = [
  {
    name: "Kemem Celebrations",
    type: "Traditional Event",
    description: "First birthday parties that may involve family leave",
    notes: "Custom dates - varies by family"
  },
  {
    name: "Funeral Mourning Periods",
    type: "Cultural Leave",
    description: "Allow 3-5 days for immediate family",
    notes: "Variable dates - immediate family entitled to cultural leave"
  },
  {
    name: "Irooj Obligations",
    type: "Traditional Event",
    description: "Community participation in traditional ceremonies",
    notes: "Variable - obligations to traditional chiefs"
  },
  {
    name: "Traditional Healing Days",
    type: "Cultural Leave",
    description: "Recognized as valid under cultural leave",
    notes: "Floating dates - valid cultural leave reason"
  }
];

export default function CulturalCalendar() {
  const upcomingEvents = culturalEvents
    .filter(event => new Date(event.date) >= new Date())
    .slice(0, 4);

  return (
    <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-xl">
      <CardHeader className="border-b border-gray-100 dark:border-slate-700">
        <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
          <Calendar className="w-5 h-5 text-purple-500" />
          🇲🇭 Cultural Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Upcoming Public Holidays */}
        <div className="space-y-3 mb-6">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Upcoming Holidays</h4>
          {upcomingEvents.map((event, index) => (
            <div key={index} className="p-3 rounded-lg bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 border border-purple-100 dark:border-purple-800">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                  {event.name}
                </h4>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    event.isPublicHoliday 
                      ? 'bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300'
                      : 'bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                  }`}
                >
                  {event.type}
                </Badge>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 mb-2">
                {event.description}
              </p>
              <div className="text-xs font-medium text-purple-600 dark:text-purple-400">
                {new Date(event.date).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Traditional Events Info */}
        <div className="border-t border-gray-200 dark:border-slate-600 pt-4">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Traditional & Cultural Events</h4>
          <div className="space-y-2">
            {traditionalEvents.slice(0, 2).map((event, index) => (
              <div key={index} className="p-2 rounded-md bg-gray-50 dark:bg-slate-700/50">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-900 dark:text-white">{event.name}</span>
                  <Badge variant="outline" className="text-xs">{event.type}</Badge>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300">{event.notes}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-3">
            These events may require cultural leave consideration
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
