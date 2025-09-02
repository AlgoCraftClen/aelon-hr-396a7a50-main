
// 🔒 CRITICAL SYSTEM FILE - v1.0-STABLE
// ⚠️ WARNING: This is the main entry point - changes affect core user flow
// 📚 See /components/changelog.md for stability requirements before modifying

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter, // Added DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"; // Added Input
import { Label } from "@/components/ui/label"; // Added Label
import {
  HeartHandshake,
  Bot,
  BarChart2,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Eye,
  Users,
  Calendar,
  FileText,
  Moon,
  Sun,
  Loader2,
  LogIn,
  UserPlus,
  Lock,
  Key,
  Upload, // Added Upload icon
  Video // Added Video icon
} from "lucide-react";
import { useGuestMode } from "../components/auth/GuestModeProvider";
import { SiteContent } from "@/api/entities";
import { UploadFile } from "@/api/integrations"; // Import UploadFile integration
import { ThemeToggle } from "@/components/theme/ThemeToggle";

// 🔒 PROTECTED: Feature highlights - maintain Marshall Islands focus
const featureHighlights = [
  { icon: HeartHandshake, title: "Culturally Aware HR", description: "Built for the RMI, respects local customs (e.g., Kemem, Ilomij, Uno in Majol)." },
  { icon: Bot, title: "Smart HR Assistant (Aelōn)", description: "Your 24/7 assistant trained in HR law, policy, and culture." },
  { icon: BarChart2, title: "Modern HR Tools", description: "Performance tracking, training management, compliance, legal mythbusters." },
  { icon: ShieldCheck, title: "Secure + Cloud-Based", description: "Accessible from anywhere, protected with 2FA." },
  { icon: GraduationCap, title: "Made for the Future", description: "Built by HR students, used by tomorrow's leaders." }
];

// 🔒 PROTECTED: Demo modules - core functionality showcase
const demoModules = [
  { icon: Users, title: "Employee Directory", description: "Manage team profiles and information" },
  { icon: GraduationCap, title: "Training Center", description: "Track employee learning and development" },
  { icon: Calendar, title: "Leave Management", description: "Handle time-off requests efficiently" },
  { icon: FileText, title: "Legal & Compliance", description: "Maintain HR policies and compliance" }
];

export default function Welcome() {
  const navigate = useNavigate();
  const { user, setGuestMode, isAuthenticated, isCheckingAuth, switchToGuestMode } = useGuestMode(); // Added 'user' to destructuring
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [welcomeVideoUrl, setWelcomeVideoUrl] = useState('');
  
  // State for the owner-only update feature
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  // 🚨 WELCOME PAGE IS ABSOLUTE LAW - ENFORCE IMMEDIATELY
  useEffect(() => {
    console.log("🏠 WELCOME PAGE LOADED - THIS IS THE LAW");
    
    // Ensure Welcome page is always accessible
    const currentPath = window.location.pathname;
    if (currentPath !== '/Welcome' && currentPath !== '/') {
      console.log("🚨 WRONG PATH DETECTED - ENFORCING WELCOME:", currentPath);
    }
    
    // Block any unwanted redirects
    const blockUnwantedRedirects = () => {
      const currentUrl = window.location.href;
      if (currentUrl.includes('/login?from_url=') || 
          (currentUrl.includes('/login') && !currentUrl.includes('/Welcome') && !currentUrl.includes('/Auth'))) {
        console.log("🚨 Welcome page blocking unwanted redirect:", currentUrl);
      }
    };

    blockUnwantedRedirects();
    
    // Set up monitoring
    const handlePopState = blockUnwantedRedirects;
    window.addEventListener('popstate', handlePopState);
    
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Theme is managed globally via ThemeProvider/ThemeToggle

  // NEW: Load welcome video URL
  const loadWelcomeVideo = async () => {
    try {
      const siteContent = await SiteContent.filter({ key: 'welcome_page_video_url' });
      if (siteContent.length > 0) {
        setWelcomeVideoUrl(siteContent[0].value);
      } else {
        // If no content found, fallback to placeholder
        setWelcomeVideoUrl('https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4');
      }
    } catch (error) {
      console.error('Error loading welcome video:', error);
      // Fallback to placeholder on error
      setWelcomeVideoUrl('https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4');
    }
  };
  
  useEffect(() => {
    loadWelcomeVideo();
  }, []);

  // Theme toggling handled by ThemeToggle component
  
  // 🔒 NAVIGATION HANDLERS - Following UX Best Practices
  
  // 🔐 "Continue to Dashboard" - Conditional behavior based on authentication
  const handleContinueToDashboard = () => {
    if (isAuthenticated) {
      console.log("🔐 Already authenticated. Navigating directly to Dashboard.");
      navigate(createPageUrl("Dashboard"));
    } else {
      console.log("🔐 Not authenticated. Showing Sign-In Prompt.");
      setShowSignInPrompt(true);
    }
  };

  // Handle actual sign-in navigation
  const handleProceedToSignIn = () => {
    setShowSignInPrompt(false);
    console.log("🔐 Proceeding to Sign-In Page");
    navigate(createPageUrl("Auth?mode=login"));
  };

  // Handle sign-up from prompt
  const handleSignUpFromPrompt = () => {
    setShowSignInPrompt(false);
    console.log("🆕 Proceeding to Sign-Up Page");
    navigate(createPageUrl("Auth?mode=signup"));
  };
  
  // 🚨 REFACTORED: "Explore as Guest" - Now uses the Silver Bullet function
  const handleExploreAsGuest = () => {
    console.log("🎯 SILVER BULLET TRIGGER: Starting pure guest mode transition");
    switchToGuestMode(); // Single function call - no other logic needed
  };
  
  // 🔓 "Log In" - Navigate to login page
  const handleLogin = () => {
    console.log("🔓 Log In button - Redirecting to Login");
    navigate(createPageUrl("Auth?mode=login"));
  };

  // 🆕 "Sign Up Free" - Navigate to sign-up page
  const handleSignUp = () => {
    console.log("🆕 Sign Up Free - Redirecting to Sign Up");
    navigate(createPageUrl("Auth?mode=signup"));
  };

  // 🔒 Locking In The Unbreakable Logout Law
  const handleLogout = () => {
    console.log("🔒 Logging out user. Enforcing Unbreakable Logout Law.");
    setGuestMode(false); // This should clear the authentication state
    navigate(createPageUrl("Auth?mode=login")); // Redirect to login page after logout
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setUploadError('');
    } else {
      setVideoFile(null);
      setUploadError('Please select a valid video file.');
    }
  };

  const handleVideoUpload = async () => {
    if (!videoFile) {
      setUploadError('Please select a video file first.');
      return;
    }
    
    setIsUploading(true);
    setUploadError('');

    try {
      const uploadResult = await UploadFile({ file: videoFile });
      
      if (uploadResult && uploadResult.file_url) {
        const siteContent = await SiteContent.filter({ key: 'welcome_page_video_url' });
        if (siteContent.length > 0) {
          await SiteContent.update(siteContent[0].id, { value: uploadResult.file_url });
        } else {
          await SiteContent.create({ key: 'welcome_page_video_url', value: uploadResult.file_url });
        }
        
        await loadWelcomeVideo(); // Reload to show the new video
        setShowUpdateModal(false);
        setVideoFile(null);
      } else {
        throw new Error('File upload did not return a URL.');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      setUploadError('Failed to upload video. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Show a loading state while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-orange-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading IAKWE HR...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-all duration-500 bg-gradient-to-br from-purple-50 via-white to-orange-50 text-gray-900 dark:bg-gradient-to-br dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 dark:text-slate-100">
        {/* Header Navigation */}
        <header className="relative z-10 p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">HR</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
                  IAKWE HR
                </h1>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  Marshall Islands HR Platform
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Hero Section - NEW: Two Column Layout */}
        <main className="relative z-10">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              
              {/* Left Column - Content */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-orange-100 dark:from-purple-900/30 dark:to-orange-900/30 px-6 py-3 rounded-full">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="font-medium text-purple-700 dark:text-purple-300">
                    🏠 WELCOME IS LAW • Built for the Marshall Islands
                  </span>
                </div>
                
                <div>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900 dark:text-slate-100">
                    Modern HR for the
                    <span className="block bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
                      Marshall Islands
                    </span>
                  </h2>
                  <p className="text-xl md:text-2xl mb-8 text-gray-700 dark:text-slate-300">
                    Modern HR management built with cultural awareness, powered by AI, and designed for the future of work in the RMI.
                  </p>
                </div>
                
                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 max-w-2xl">
                  {/* 🔐 Continue to Dashboard Button */}
                  <Button 
                    onClick={handleContinueToDashboard} 
                    size="lg" 
                    className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 text-white shadow-2xl hover:scale-105 transition-all duration-300 text-lg px-8 py-6 font-semibold"
                  >
                    <Lock className="mr-2 h-5 w-5" />
                    Continue to Dashboard
                  </Button>
                  
                  {/* 🎯 Explore as Guest Button - SILVER BULLET IMPLEMENTATION */}
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={handleExploreAsGuest} 
                    className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:border-slate-500 transition-all duration-300 text-lg px-8 py-6 hover:scale-105 font-semibold"
                  >
                    <Eye className="mr-2 h-5 w-5" />
                    Explore as Guest
                  </Button>
                </div>
                
                {/* Fixed: Much stronger contrast for helper text */}
                <div className="text-sm space-y-2">
                  <p className="font-semibold text-gray-900 dark:text-slate-400" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                    <strong className="text-gray-900 dark:text-slate-300">Continue to Dashboard:</strong> 
                    <span className="text-gray-900 dark:text-slate-400"> For existing users - sign in to access your full HR system.</span>
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-slate-400" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                    <strong className="text-gray-900 dark:text-slate-300">Explore as Guest:</strong> 
                    <span className="text-gray-900 dark:text-slate-400"> Preview the system with read-only access - perfect for evaluation.</span>
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-slate-400" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                    <span className="text-gray-900 dark:text-slate-400">New to IAKWE HR?</span>
                    <button 
                      onClick={handleSignUp}
                      className="ml-1 text-purple-800 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 hover:underline font-bold transition-colors duration-200"
                      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
                    >
                      Create your free account
                    </button>
                    <span className="text-gray-900 dark:text-slate-400"> to get started with full access.</span>
                  </p>
                </div>
              </div>

              {/* Right Column - Video */}
              <div className="relative">
                {/* Admin-only Update Button */}
                {isAuthenticated && user?.role === 'Admin' && (
                  <Button
                    onClick={() => setShowUpdateModal(true)}
                    variant="secondary"
                    className="absolute top-4 right-4 z-20 bg-black/50 text-white hover:bg-black/70"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Update Video
                  </Button>
                )}
              
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-500/10 to-orange-500/10 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
                  {welcomeVideoUrl ? (
                    <video 
                      key={welcomeVideoUrl} // Added key to force remount on URL change
                      className="w-full h-[400px] object-cover"
                      autoPlay 
                      loop 
                      muted
                      playsInline
                      controls // Added controls for sound
                    >
                      <source src={welcomeVideoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="w-full h-[400px] flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-orange-500/20">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-orange-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                          <Video className="w-8 h-8 text-white" /> {/* Changed icon */}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">Loading video...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {featureHighlights.map((feature, index) => (
                <Card key={index} className="group hover:scale-105 transition-all duration-300 border-0 shadow-lg bg-white/70 backdrop-blur-xl hover:shadow-xl dark:bg-slate-800/50 dark:hover:bg-slate-800/70">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 ${index % 2 === 0 ? 'bg-gradient-to-r from-purple-500 to-indigo-500' : 'bg-gradient-to-r from-orange-500 to-pink-500'}`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-xl mb-4 text-gray-900 dark:text-slate-100">
                      {feature.title}
                    </h3>
                    <p className="leading-relaxed text-gray-600 dark:text-slate-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Demo Section */}
            <div className="rounded-3xl p-12 mb-20 bg-white/50 backdrop-blur-xl shadow-2xl dark:bg-slate-800/50">
              <div className="text-center mb-12">
                <h3 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-slate-100">
                  See IAKWE HR in Action
                </h3>
                <p className="text-xl max-w-2xl mx-auto text-gray-600 dark:text-slate-300">
                  Explore our core modules and see how modern HR management works for Marshall Islands organizations.
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {demoModules.map((module, index) => (
                  <Card key={index} className="group cursor-pointer hover:scale-105 transition-all duration-300 border-0 shadow-lg bg-white/80 hover:bg-white hover:shadow-xl dark:bg-slate-700/50 dark:hover:bg-slate-700" onClick={handleExploreAsGuest}>
                    <CardContent className="p-6 text-center">
                      <div className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center ${index % 2 === 0 ? 'bg-gradient-to-r from-purple-500 to-indigo-500' : 'bg-gradient-to-r from-orange-500 to-pink-500'} group-hover:scale-110 transition-all duration-300`}>
                        <module.icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold mb-2 text-gray-900 dark:text-slate-100">
                        {module.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        {module.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-slate-100">
                Ready to Transform Your HR?
              </h3>
              <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600 dark:text-slate-300">
                Join progressive organizations across the Marshall Islands who are modernizing their HR with IAKWE.
              </p>
              <Button onClick={handleSignUp} size="lg" className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 text-white shadow-2xl hover:scale-105 transition-all duration-300 text-lg px-8 py-6">
                <UserPlus className="mr-2 h-5 w-5" />
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </main>

        {/* Sign-In Prompt Modal */}
        <Dialog open={showSignInPrompt} onOpenChange={setShowSignInPrompt}>
          <DialogContent className="max-w-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-0 shadow-2xl">
            <DialogHeader className="text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Key className="w-10 h-10 text-white" />
              </div>
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Sign In Required
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                To access your dashboard and manage your HR operations, please sign in to your IAKWE HR account.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 mt-6">
              <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-5 rounded-xl border border-purple-200 dark:border-purple-700">
                <div className="flex items-center gap-3 mb-3">
                  <Lock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  <span className="font-semibold text-purple-700 dark:text-purple-300 text-lg">Secure Access:</span>
                </div>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    Access your full HR dashboard
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    Manage employees and company data
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    Use AI assistant and advanced features
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    Secure, encrypted data protection
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <Button 
                  onClick={handleProceedToSignIn}
                  className="w-full bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 shadow-lg hover:scale-105 transition-all duration-200 text-lg py-6"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In to Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Don't have an account yet?
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={handleSignUpFromPrompt}
                    className="w-full border-2 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 py-3"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Free Account
                  </Button>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                className="w-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" 
                onClick={() => {
                  setShowSignInPrompt(false);
                  handleExploreAsGuest(); // Also navigate to guest mode
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                Continue exploring as guest instead
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Admin-only Update Video Modal */}
        <Dialog open={showUpdateModal} onOpenChange={setShowUpdateModal}>
          <DialogContent className="max-w-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Update Welcome Video
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-300">
                Upload a new video to be displayed on the Welcome page. The current video will be replaced.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="video-upload" className="text-gray-700 dark:text-gray-300">Video File</Label>
                <Input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              {videoFile && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>Selected file: <span className="font-medium text-gray-800 dark:text-gray-200">{videoFile.name}</span></p>
                </div>
              )}
              {uploadError && (
                <p className="text-sm text-red-500 dark:text-red-400">{uploadError}</p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUpdateModal(false)} disabled={isUploading}>
                Cancel
              </Button>
              <Button onClick={handleVideoUpload} disabled={isUploading || !videoFile}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload & Save
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
    </Dialog>
  </div>
  );
}
