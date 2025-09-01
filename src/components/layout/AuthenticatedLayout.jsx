
// 🔒 CRITICAL SYSTEM FILE - v1.0.5-LOGOUT-ENFORCED
// ⚠️ WARNING: Changes to this file affect core authentication and logout flow
// 📚 See /components/changelog.md for stability requirements before modifying

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  GraduationCap,
  Calendar,
  Settings,
  HelpCircle,
  LogOut,
  Shield,
  TrendingUp,
  BarChart3,
  LayoutDashboard,
  Menu,
  User,
} from "lucide-react";
import { useGuestMode } from "../auth/GuestModeProvider";

export default function AuthenticatedLayout({ children, currentPageName, user }) {
  const { logout } = useGuestMode();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Execute the complete sign out function
  const handleLogout = () => {
    console.log("🚪 EXECUTING COMPLETE SIGN OUT FUNCTION");
    
    // Close the confirmation dialog
    setShowLogoutConfirm(false);
    
    // Execute the aggressive logout from the provider
    logout();
  };

  // Main navigation items
  const navigationItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: createPageUrl('Dashboard') },
    { name: 'EmployeeDirectory', displayName: 'Employee Directory', icon: Users, href: createPageUrl('EmployeeDirectory') },
    { name: 'LeaveManagement', displayName: 'Leave Management', icon: Calendar, href: createPageUrl('LeaveManagement') },
    { name: 'TrainingCenter', displayName: 'Training Center', icon: GraduationCap, href: createPageUrl('TrainingCenter') },
    { name: 'PerformanceReviews', displayName: 'Performance Reviews', icon: TrendingUp, href: createPageUrl('PerformanceReviews') },
    { name: 'Compliance', displayName: 'Legal & Compliance', icon: Shield, href: createPageUrl('Compliance') },
    { name: 'Analytics', icon: BarChart3, href: createPageUrl('Analytics') }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 text-gray-900 dark:bg-gradient-to-br dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 dark:text-white">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
  <div className={`fixed left-0 top-0 h-full w-64 bg-white/95 dark:bg-[#1a1a2e]/95 backdrop-blur-xl border-r border-gray-200 dark:border-gray-700/50 transform transition-transform duration-300 ease-in-out z-50 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 flex flex-col`}>

  {/* Logo/Header */}
  <div className="p-6 border-b border-gray-200 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">HR</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                IAKWE HR
              </h1>
              <p className="text-xs text-gray-400">Marshall Islands</p>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPageName === item.name;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 text-white'
                    : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : 'text-gray-600 dark:text-gray-400 group-hover:text-purple-400'}`} />
                <span className="font-medium">{item.displayName || item.name}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-purple-400 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Extended Footer Section - Support, Settings, and User Profile */}
        <div className="mt-auto border-t border-gray-700/50">
          <div className="p-4 space-y-2">
            {/* My HR Portal Link */}
            <Link
              to={createPageUrl('MyHRPortal')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group w-full ${
                currentPageName === 'MyHRPortal'
                  ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 text-white'
                  : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User className={`w-5 h-5 ${
                currentPageName === 'MyHRPortal' ? 'text-purple-400' : 'text-gray-600 dark:text-gray-400 group-hover:text-purple-400'
              }`} />
              <span className="font-medium">My HR Portal</span>
              {currentPageName === 'MyHRPortal' && (
                <div className="ml-auto w-2 h-2 bg-purple-400 rounded-full" />
              )}
            </Link>

            {/* Settings Link */}
            <Link
              to={createPageUrl('Settings')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group w-full ${
                currentPageName === 'Settings'
                  ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 text-white'
                  : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Settings className={`w-5 h-5 ${
                currentPageName === 'Settings' ? 'text-purple-400' : 'text-gray-600 dark:text-gray-400 group-hover:text-purple-400'
              }`} />
              <span className="font-medium">Settings</span>
              {currentPageName === 'Settings' && (
                <div className="ml-auto w-2 h-2 bg-purple-400 rounded-full" />
              )}
            </Link>

            {/* Support Link */}
            <Link
              to={createPageUrl('Support')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group w-full ${
                currentPageName === 'Support'
                  ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 text-white'
                  : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <HelpCircle className={`w-5 h-5 ${
                currentPageName === 'Support' ? 'text-purple-400' : 'text-gray-600 dark:text-gray-400 group-hover:text-purple-400'
              }`} />
              <span className="font-medium">Support Center</span>
              {currentPageName === 'Support' && (
                <div className="ml-auto w-2 h-2 bg-purple-400 rounded-full" />
              )}
            </Link>
          </div>

          {/* User Profile Section and Logout Button */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700/50">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 dark:bg-white/5 border border-gray-200 dark:border-gray-700/50">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold shrink-0">
                {user?.full_name ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.full_name || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email || 'user@company.com'}
                </p>
              </div>
            </div>
            
            {/* Logout Button */}
            <Button
              onClick={() => setShowLogoutConfirm(true)}
              variant="ghost"
              className="w-full mt-3 justify-start text-left text-red-400 hover:text-red-300 hover:bg-red-600/10"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar for Mobile */}
  <div className="bg-white/95 dark:bg-[#1a1a2e]/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700/50 p-4 lg:hidden">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-gray-700 dark:text-white"
            >
              <Menu className="w-6 h-6" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">HR</span>
              </div>
              <span className="text-white font-semibold">IAKWE HR</span>
            </div>
            <div className="w-10"></div>
          </div>
        </div>

        {/* Page Content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Confirm Sign Out</CardTitle>
              <CardDescription className="text-gray-400">
                Are you sure you want to sign out? This will end your session and return you to the welcome page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-700/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
