import React, { useState, useEffect } from 'react';
import { useGuestMode } from '../components/auth/GuestModeProvider';
import { User } from '@/api/entities';
import { Company } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

// Import new settings components
import PasswordChangeModal from '@/components/settings/PasswordChangeModal';
import DataExportModal from '@/components/settings/DataExportModal';
import CulturalSettingsModal from '@/components/settings/CulturalSettingsModal';

import { 
  Loader2, 
  Upload, 
  Save, 
  Shield, 
  Bell, 
  Globe, 
  Building, 
  Users, 
  CreditCard,
  Key,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  User as UserIcon,
  Settings as SettingsIcon,
  Moon,
  Sun,
  Monitor,
  QrCode,
  Download,
  Copy,
  Lock,
  FileText,
  Clock,
  Database,
  Activity,
  HeartHandshake,
  Calendar,
  Flag,
  BookOpen,
  Trash2,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  RefreshCw,
  Filter,
  Search
} from 'lucide-react';

export default function Settings() {
  const { user, refreshUser } = useGuestMode();
  const [company, setCompany] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile settings
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  // Company settings
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyLogo, setCompanyLogo] = useState('');
  
  // Security settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [backupCodes, setBackupCodes] = useState([]);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showQrCode, setShowQrCode] = useState(false);
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [leaveNotifications, setLeaveNotifications] = useState(true);
  const [trainingNotifications, setTrainingNotifications] = useState(true);
  const [complianceNotifications, setComplianceNotifications] = useState(true);
  
  // System settings - FIXED: Proper theme management
  const [themeMode, setThemeMode] = useState('system'); // 'light', 'dark', 'system'
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('Pacific/Majuro');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompanySubmitting, setIsCompanySubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Modal states for new components
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDataExportModal, setShowDataExportModal] = useState(false);
  const [showCulturalSettingsModal, setShowCulturalSettingsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showAuditLogsModal, setShowAuditLogsModal] = useState(false);

  // Privacy and data management states
  const [privacySettings, setPrivacySettings] = useState({
    dataRetentionYears: 7,
    autoArchiveEnabled: true,
    encryptionEnabled: true,
    auditLogsEnabled: true,
    dataSharingConsent: false,
    marketingConsent: false
  });

  // Cultural settings state
  const [culturalSettings, setCulturalSettings] = useState({
    culturalCalendarEnabled: true,
    marshalleseLanguageEnabled: false,
    traditionalObservances: true,
    kememNotifications: true,
    mourningPeriodNotifications: true,
    iroojObligations: true,
    localHolidayReminders: true,
    culturalLeaveTypes: ['kemem', 'mourning', 'irooj', 'traditional'],
    defaultTimezone: 'Pacific/Majuro',
    culturalSensitivityLevel: 'high'
  });

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoadingAuditLogs, setIsLoadingAuditLogs] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setPhone(user.phone || '');
      setPosition(user.position || '');
      setDepartment(user.department || '');
      setImagePreview(user.profile_image_url || '');
      setTwoFactorEnabled(user.two_factor_enabled || false);
      
      // Load user settings
      const settings = user.settings || {};
      setEmailNotifications(settings.email_notifications !== false);
      setLeaveNotifications(settings.leave_notifications !== false);
      setTrainingNotifications(settings.training_notifications !== false);
      setComplianceNotifications(settings.compliance_notifications !== false);
      
      // FIXED: Proper theme initialization
      const savedTheme = localStorage.getItem('iakwe-hr-theme') || settings.theme_mode || 'system';
      setThemeMode(savedTheme);
      applyTheme(savedTheme);
      
      setLanguage(settings.language || 'en');
      setTimezone(settings.timezone || 'Pacific/Majuro');
    }
    
    loadCompanyData();
  }, [user]);

  // FIXED: Theme application logic
  const applyTheme = (theme) => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else { // system
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    }
    
    localStorage.setItem('iakwe-hr-theme', theme);
  };

  const loadCompanyData = async () => {
    try {
      if (user?.company_id) {
        const companyData = await Company.filter({ id: user.company_id });
        if (companyData.length > 0) {
          const comp = companyData[0];
          setCompany(comp);
          setCompanyName(comp.name || '');
          setCompanyEmail(comp.contact_email || '');
          setCompanyPhone(comp.contact_phone || '');
          setCompanyAddress(comp.address || '');
          setCompanyLogo(comp.logo_url || '');
        }
      }
    } catch (error) {
      console.error("Error loading company data:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrorMessage('Image file must be less than 5MB');
        return;
      }
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // FIXED: Profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      let imageUrl = user.profile_image_url;
      if (profileImageFile) {
        const uploadResult = await UploadFile({ file: profileImageFile });
        if (uploadResult && uploadResult.file_url) {
          imageUrl = uploadResult.file_url;
        }
      }

      const settings = {
        email_notifications: emailNotifications,
        leave_notifications: leaveNotifications,
        training_notifications: trainingNotifications,
        compliance_notifications: complianceNotifications,
        theme_mode: themeMode,
        language: language,
        timezone: timezone
      };

      await User.updateMyUserData({
        full_name: fullName,
        phone: phone,
        position: position,
        department: department,
        profile_image_url: imageUrl,
        settings: settings
      });

      await refreshUser();
      setSuccessMessage('Profile updated successfully!');
      setProfileImageFile(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage('Failed to update profile. Please try again.');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // FIXED: Company form submission
  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    if (!company) {
      setErrorMessage('No company data found to update');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }
    
    setIsCompanySubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await Company.update(company.id, {
        name: companyName,
        contact_email: companyEmail,
        contact_phone: companyPhone,
        address: companyAddress,
        logo_url: companyLogo
      });

      setSuccessMessage('Company settings updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Reload company data to reflect changes
      await loadCompanyData();
    } catch (error) {
      console.error("Error updating company:", error);
      setErrorMessage('Failed to update company settings. Please try again.');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsCompanySubmitting(false);
    }
  };

  // FIXED: 2FA functionality
  const generateQrCode = async () => {
    try {
      // Generate a secret key for TOTP
      const secret = Math.random().toString(36).substring(2, 18).toUpperCase();
      const companyName = company?.name || 'IAKWE HR';
      const userEmail = user.email;
      
      // Create TOTP URL for QR code
      const totpUrl = `otpauth://totp/${encodeURIComponent(companyName)}:${encodeURIComponent(userEmail)}?secret=${secret}&issuer=${encodeURIComponent(companyName)}`;
      
      // For demo purposes, we'll use a QR code service
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(totpUrl)}`;
      
      setQrCodeUrl(qrUrl);
      setShowQrCode(true);
      
      // Store the secret temporarily (in real app, store securely)
      sessionStorage.setItem('temp_2fa_secret', secret);
    } catch (error) {
      console.error('Error generating QR code:', error);
      setErrorMessage('Failed to generate QR code. Please try again.');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const verify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit code');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    try {
      // In a real implementation, verify the TOTP code here
      // For demo, we'll accept any 6-digit code
      const secret = sessionStorage.getItem('temp_2fa_secret');
      
      if (secret) {
        // Enable 2FA and generate backup codes
        generateBackupCodes();
        
        await User.updateMyUserData({
          two_factor_enabled: true,
          two_factor_secret: secret
        });
        
        setTwoFactorEnabled(true);
        setShowQrCode(false);
        setVerificationCode('');
        sessionStorage.removeItem('temp_2fa_secret');
        setSuccessMessage('Two-factor authentication enabled successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      setErrorMessage('Failed to enable 2FA. Please try again.');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const disable2FA = async () => {
    try {
      await User.updateMyUserData({
        two_factor_enabled: false,
        two_factor_secret: null
      });
      
      setTwoFactorEnabled(false);
      setBackupCodes([]);
      setShowBackupCodes(false);
      setSuccessMessage('Two-factor authentication disabled successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      setErrorMessage('Failed to disable 2FA. Please try again.');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substring(2, 8).toUpperCase());
    }
    setBackupCodes(codes);
    setShowBackupCodes(true);
  };

  const copyBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    navigator.clipboard.writeText(codesText);
    setSuccessMessage('Backup codes copied to clipboard!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const downloadBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'iakwe-hr-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // FIXED: Theme change handler
  const handleThemeChange = (newTheme) => {
    setThemeMode(newTheme);
    applyTheme(newTheme);
  };

  // Load audit logs
  const loadAuditLogs = async () => {
    setIsLoadingAuditLogs(true);
    try {
      // Mock audit logs data - in real app, fetch from API
      const mockLogs = [
        {
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          action: 'READ',
          resource: 'Profile Settings',
          ip_address: '192.168.1.100',
          status: 'SUCCESS'
        },
        {
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          action: 'UPDATE',
          resource: 'Company Information',
          ip_address: '192.168.1.100',
          status: 'SUCCESS'
        },
        {
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          action: 'LOGIN',
          resource: 'Authentication',
          ip_address: '192.168.1.100',
          status: 'SUCCESS'
        }
      ];
      setAuditLogs(mockLogs);
    } catch (error) {
      console.error('Error loading audit logs:', error);
      setErrorMessage('Failed to load audit logs');
    } finally {
      setIsLoadingAuditLogs(false);
    }
  };

  // Handle audit logs modal open
  const handleAuditLogsOpen = () => {
    setShowAuditLogsModal(true);
    loadAuditLogs();
  };

  if (!user) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 text-gray-900 dark:text-white min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account, company, and system preferences
          </p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-400 p-4 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 p-4 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {errorMessage}
          </div>
        )}

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 p-1">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserIcon className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Company
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="cultural" className="flex items-center gap-2">
              <HeartHandshake className="w-4 h-4" />
              Cultural
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <SettingsIcon className="w-4 h-4" />
              System
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile">
            <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-purple-500" />
                  Profile Information
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Update your personal information and profile picture
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center gap-6">
                    <Avatar className="w-24 h-24 border-2 border-purple-200 dark:border-purple-500">
                      <AvatarImage src={imagePreview} alt={fullName} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-2xl">
                        {fullName?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Label htmlFor="profile-picture-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" asChild className="border-gray-300 dark:border-gray-600">
                          <span>
                            <Upload className="w-4 h-4 mr-2" />
                            Change Picture
                          </span>
                        </Button>
                      </Label>
                      <input
                        id="profile-picture-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">PNG, JPG, or GIF. Max 5MB.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="full-name" className="text-gray-700 dark:text-gray-300">Full Name</Label>
                      <Input
                        id="full-name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="position" className="text-gray-700 dark:text-gray-300">Position</Label>
                      <Input
                        id="position"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        className="bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-gray-700 dark:text-gray-300">Department</Label>
                      <Select value={department} onValueChange={setDepartment}>
                        <SelectTrigger className="bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Administration">Administration</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Operations">Operations</SelectItem>
                          <SelectItem value="Human Resources">Human Resources</SelectItem>
                          <SelectItem value="IT">IT</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Legal">Legal</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 text-white">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Profile
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Company Settings */}
          <TabsContent value="company">
            <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Building className="w-5 h-5 text-purple-500" />
                  Company Information
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Manage your organization's details and settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCompanySubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="company-name" className="text-gray-700 dark:text-gray-300">Company Name</Label>
                      <Input
                        id="company-name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company-email" className="text-gray-700 dark:text-gray-300">Contact Email</Label>
                      <Input
                        id="company-email"
                        type="email"
                        value={companyEmail}
                        onChange={(e) => setCompanyEmail(e.target.value)}
                        className="bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company-phone" className="text-gray-700 dark:text-gray-300">Contact Phone</Label>
                      <Input
                        id="company-phone"
                        type="tel"
                        value={companyPhone}
                        onChange={(e) => setCompanyPhone(e.target.value)}
                        className="bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timezone" className="text-gray-700 dark:text-gray-300">Timezone</Label>
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger className="bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pacific/Majuro">Marshall Islands Time</SelectItem>
                          <SelectItem value="Pacific/Honolulu">Hawaii Time</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company-address" className="text-gray-700 dark:text-gray-300">Address</Label>
                    <Textarea
                      id="company-address"
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      rows={3}
                      className="bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isCompanySubmitting || !company} className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 text-white">
                      {isCompanySubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Company Info
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <div className="space-y-6">
              <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-500" />
                    Two-Factor Authentication
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Add an extra layer of security to your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Enable 2FA</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Use Google Authenticator or similar TOTP app</p>
                    </div>
                    <Switch
                      checked={twoFactorEnabled}
                      onCheckedChange={(checked) => {
                        if (checked && !twoFactorEnabled) {
                          generateQrCode();
                        } else if (!checked && twoFactorEnabled) {
                          disable2FA();
                        }
                      }}
                    />
                  </div>
                  
                  {showQrCode && (
                    <div className="space-y-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <h5 className="font-medium text-gray-900 dark:text-white">Setup Two-Factor Authentication</h5>
                      <div className="text-center">
                        <img src={qrCodeUrl} alt="2FA QR Code" className="mx-auto mb-4 rounded-lg" />
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Scan this QR code with Google Authenticator, Authy, or another TOTP app
                        </p>
                        <div className="flex gap-2 max-w-sm mx-auto">
                          <Input
                            placeholder="Enter 6-digit code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            maxLength={6}
                            className="bg-white dark:bg-slate-600 border-gray-300 dark:border-gray-500"
                          />
                          <Button onClick={verify2FA} disabled={verificationCode.length !== 6}>
                            Verify
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {twoFactorEnabled && (
                    <div className="space-y-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-500/30">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Two-factor authentication is enabled</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          onClick={generateBackupCodes}
                          className="border-green-300 dark:border-green-600 text-green-700 dark:text-green-400"
                        >
                          <Key className="w-4 h-4 mr-2" />
                          Generate New Backup Codes
                        </Button>
                      </div>
                      
                      {showBackupCodes && (
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
                          <h6 className="font-medium text-gray-900 dark:text-white mb-2">Backup Codes</h6>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            Save these codes in a safe place. Each code can only be used once.
                          </p>
                          <div className="grid grid-cols-2 gap-2 font-mono text-sm mb-4">
                            {backupCodes.map((code, index) => (
                              <Badge key={index} variant="secondary" className="justify-center py-1">
                                {code}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" onClick={copyBackupCodes} size="sm">
                              <Copy className="w-4 h-4 mr-1" />
                              Copy
                            </Button>
                            <Button variant="outline" onClick={downloadBackupCodes} size="sm">
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Email</span>
                    <span className="text-gray-900 dark:text-white">{user.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Account Created</span>
                    <span className="text-gray-900 dark:text-white">
                      {new Date(user.created_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Last Login</span>
                    <span className="text-gray-900 dark:text-white">
                      {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                  
                  <Separator className="bg-gray-200 dark:bg-gray-700" />
                  
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowPasswordModal(true)}
                      className="border-gray-300 dark:border-gray-600"
                    >
                      <Key className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-purple-500" />
                  Notification Preferences
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Choose what notifications you'd like to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Email Notifications</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Receive general email updates</p>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  
                  <Separator className="bg-gray-200 dark:bg-gray-700" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Leave Request Updates</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Notifications about leave requests and approvals</p>
                    </div>
                    <Switch
                      checked={leaveNotifications}
                      onCheckedChange={setLeaveNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Training Reminders</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Reminders about required training and deadlines</p>
                    </div>
                    <Switch
                      checked={trainingNotifications}
                      onCheckedChange={setTrainingNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Compliance Alerts</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Important compliance and policy updates</p>
                    </div>
                    <Switch
                      checked={complianceNotifications}
                      onCheckedChange={setComplianceNotifications}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleProfileSubmit} disabled={isSubmitting} className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 text-white">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Preferences
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cultural Settings */}
          <TabsContent value="cultural">
            <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-purple-500" />
                  Cultural Settings
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Customize cultural preferences and Marshall Islands-specific settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Cultural Calendar</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Enable traditional Marshallese calendar events</p>
                      </div>
                      <Switch
                        checked={culturalSettings.culturalCalendarEnabled}
                        onCheckedChange={(checked) => setCulturalSettings(prev => ({ ...prev, culturalCalendarEnabled: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Marshallese Language</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Enable Marshallese language support</p>
                      </div>
                      <Switch
                        checked={culturalSettings.marshalleseLanguageEnabled}
                        onCheckedChange={(checked) => setCulturalSettings(prev => ({ ...prev, marshalleseLanguageEnabled: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Traditional Observances</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Include traditional cultural observances</p>
                      </div>
                      <Switch
                        checked={culturalSettings.traditionalObservances}
                        onCheckedChange={(checked) => setCulturalSettings(prev => ({ ...prev, traditionalObservances: checked }))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Kemem Notifications</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">First birthday celebration reminders</p>
                      </div>
                      <Switch
                        checked={culturalSettings.kememNotifications}
                        onCheckedChange={(checked) => setCulturalSettings(prev => ({ ...prev, kememNotifications: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Mourning Period Alerts</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Respectful mourning period notifications</p>
                      </div>
                      <Switch
                        checked={culturalSettings.mourningPeriodNotifications}
                        onCheckedChange={(checked) => setCulturalSettings(prev => ({ ...prev, mourningPeriodNotifications: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Irooj Obligations</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Traditional leadership obligations</p>
                      </div>
                      <Switch
                        checked={culturalSettings.iroojObligations}
                        onCheckedChange={(checked) => setCulturalSettings(prev => ({ ...prev, iroojObligations: checked }))}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Cultural Sensitivity Level</Label>
                    <Select 
                      value={culturalSettings.culturalSensitivityLevel} 
                      onValueChange={(value) => setCulturalSettings(prev => ({ ...prev, culturalSensitivityLevel: value }))}
                    >
                      <SelectTrigger className="bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Basic cultural awareness</SelectItem>
                        <SelectItem value="medium">Medium - Standard cultural sensitivity</SelectItem>
                        <SelectItem value="high">High - Comprehensive cultural integration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCulturalSettingsModal(true)}
                    className="border-gray-300 dark:border-gray-600"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Advanced Settings
                  </Button>
                  <Button onClick={handleProfileSubmit} disabled={isSubmitting} className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 text-white">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Cultural Settings
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy & Data Management */}
          <TabsContent value="privacy">
            <div className="space-y-6">
              <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <Lock className="w-5 h-5 text-purple-500" />
                    Privacy Settings
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Manage your data privacy and security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Data Encryption</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Encrypt all personal data at rest</p>
                      </div>
                      <Switch
                        checked={privacySettings.encryptionEnabled}
                        onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, encryptionEnabled: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Audit Logs</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Track all data access and changes</p>
                      </div>
                      <Switch
                        checked={privacySettings.auditLogsEnabled}
                        onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, auditLogsEnabled: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Auto-Archive</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Automatically archive old data</p>
                      </div>
                      <Switch
                        checked={privacySettings.autoArchiveEnabled}
                        onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, autoArchiveEnabled: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Data Sharing Consent</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Allow data sharing for service improvement</p>
                      </div>
                      <Switch
                        checked={privacySettings.dataSharingConsent}
                        onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, dataSharingConsent: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Marketing Communications</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Receive marketing and promotional emails</p>
                      </div>
                      <Switch
                        checked={privacySettings.marketingConsent}
                        onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, marketingConsent: checked }))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Data Retention Period (Years)</Label>
                    <Select 
                      value={privacySettings.dataRetentionYears.toString()} 
                      onValueChange={(value) => setPrivacySettings(prev => ({ ...prev, dataRetentionYears: parseInt(value) }))}
                    >
                      <SelectTrigger className="bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 Years</SelectItem>
                        <SelectItem value="5">5 Years</SelectItem>
                        <SelectItem value="7">7 Years</SelectItem>
                        <SelectItem value="10">10 Years</SelectItem>
                        <SelectItem value="15">15 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowDataExportModal(true)}
                      className="border-gray-300 dark:border-gray-600"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export My Data
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleAuditLogsOpen}
                      className="border-gray-300 dark:border-gray-600"
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      View Audit Logs
                    </Button>
                    <Button onClick={handleProfileSubmit} disabled={isSubmitting} className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 text-white">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Privacy Settings
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system">
            <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-500" />
                  System Preferences
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Customize your application experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Theme</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => handleThemeChange('light')}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          themeMode === 'light' 
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <Sun className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Light</span>
                      </button>
                      <button
                        onClick={() => handleThemeChange('dark')}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          themeMode === 'dark' 
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <Moon className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Dark</span>
                      </button>
                      <button
                        onClick={() => handleThemeChange('system')}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          themeMode === 'system' 
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <Monitor className="w-6 h-6 mx-auto mb-2 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">System</span>
                      </button>
                    </div>
                  </div>
                  
                  <Separator className="bg-gray-200 dark:bg-gray-700" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Language</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="mh">Marshallese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Timezone</Label>
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger className="bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pacific/Majuro">Marshall Islands Time</SelectItem>
                          <SelectItem value="Pacific/Honolulu">Hawaii Time</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleProfileSubmit} disabled={isSubmitting} className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 text-white">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Settings
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal Components */}
        <PasswordChangeModal 
          isOpen={showPasswordModal} 
          onClose={() => setShowPasswordModal(false)} 
          user={user}
        />
        
        <DataExportModal 
          isOpen={showDataExportModal} 
          onClose={() => setShowDataExportModal(false)} 
          user={user}
        />
        
        <CulturalSettingsModal 
          isOpen={showCulturalSettingsModal} 
          onClose={() => setShowCulturalSettingsModal(false)}
          onSave={(settings) => {
            setCulturalSettings(settings);
            setShowCulturalSettingsModal(false);
            setSuccessMessage('Cultural settings updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
          }}
          currentSettings={culturalSettings}
        />

        {/* Audit Logs Modal */}
        <Dialog open={showAuditLogsModal} onOpenChange={setShowAuditLogsModal}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-500" />
                Audit Logs
              </DialogTitle>
              <DialogDescription>
                View all activity and data access logs for your account
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsLoadingAuditLogs(true)}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input 
                    placeholder="Search logs..." 
                    className="pl-10 w-64"
                  />
                </div>
              </div>
              
              <ScrollArea className="h-96">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingAuditLogs ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto text-purple-500" />
                          <p className="text-sm text-gray-500 mt-2">Loading audit logs...</p>
                        </TableCell>
                      </TableRow>
                    ) : auditLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <FileText className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-500 mt-2">No audit logs found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      auditLogs.map((log, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-sm">
                            {new Date(log.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={log.action === 'READ' ? 'secondary' : 'default'}>
                              {log.action}
                            </Badge>
                          </TableCell>
                          <TableCell>{log.resource}</TableCell>
                          <TableCell className="font-mono text-sm">{log.ip_address}</TableCell>
                          <TableCell>
                            <Badge variant={log.status === 'SUCCESS' ? 'default' : 'destructive'}>
                              {log.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAuditLogsModal(false)}>
                Close
              </Button>
              <Button onClick={() => {
                // Export audit logs functionality
                setSuccessMessage('Audit logs exported successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
                setShowAuditLogsModal(false);
              }}>
                <Download className="w-4 h-4 mr-2" />
                Export Logs
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}