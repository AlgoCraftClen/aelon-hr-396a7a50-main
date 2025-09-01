import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Calendar,
  GraduationCap,
  TrendingUp,
  FileText,
  BarChart,
  HelpCircle,
  Eye,
  UserPlus,
  ArrowRight,
  Star
} from 'lucide-react';
import { GuestActionButton } from "../auth/GuestActionBlocker";
import { createPageUrl } from '@/utils';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/Dashboard', active: true },
  { name: 'Employee Directory', icon: Users, href: '/EmployeeDirectory', active: false },
  { name: 'Leave Management', icon: Calendar, href: '/LeaveManagement', active: false },
  { name: 'Training Center', icon: GraduationCap, href: '/TrainingCenter', active: false },
  { name: 'Performance', icon: TrendingUp, href: '/PerformanceReviews', active: false },
  { name: 'Legal & Compliance', icon: FileText, href: '/Compliance', active: false },
  { name: 'Analytics', icon: BarChart, href: '/Analytics', active: false },
  { name: 'Support Center', icon: HelpCircle, href: '/Support', active: false },
];

export default function GuestLayout({ children }) {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate(createPageUrl('Auth?mode=signup'));
  };

  return (
    <div className="flex h-screen bg-white dark:bg-slate-900">
      {/* Sidebar */}
  <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-800/50 backdrop-blur-xl border-r border-gray-200 dark:border-slate-700/50 flex flex-col shadow-lg">
        {/* Logo */}
        <div className="h-20 flex items-center justify-center px-6 border-b border-gray-200 dark:border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">HR</span>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
                IAKWE HR
              </h1>
              <div className="flex items-center gap-1.5">
                <Eye className="w-3 h-3 text-purple-500" />
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Demo Mode</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <GuestActionButton key={item.name} actionName={`View ${item.name}`} showToast={item.name !== 'Dashboard'}>
              <button
                disabled={!item.active}
                className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  item.active
                    ? 'bg-gradient-to-r from-purple-500 to-orange-500 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-not-allowed opacity-60'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </button>
            </GuestActionButton>
          ))}
        </nav>
        
        {/* Conversion CTA */}
        <div className="p-4">
          <Card className="bg-gradient-to-br from-purple-500 to-orange-500 text-white border-0 shadow-2xl">
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-white" />
              <h3 className="text-md font-bold mb-1">Unlock Full Access</h3>
              <p className="text-purple-100 mb-4 text-xs">
                Sign up to manage your team with all features enabled.
              </p>
              <Button
                onClick={handleSignUp}
                className="w-full bg-white text-purple-600 hover:bg-gray-100 font-semibold shadow-lg"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Sign Up Free
              </Button>
            </CardContent>
          </Card>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}