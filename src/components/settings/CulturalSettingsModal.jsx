import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  HeartHandshake, 
  Calendar, 
  Globe, 
  Bell, 
  Loader2, 
  AlertTriangle, 
  CheckCircle,
  Users,
  Flag,
  BookOpen
} from 'lucide-react';

export default function CulturalSettingsModal({ isOpen, onClose, onSave, currentSettings = {} }) {
  const [settings, setSettings] = useState({
    culturalCalendarEnabled: currentSettings.culturalCalendarEnabled ?? true,
    marshalleseLanguageEnabled: currentSettings.marshalleseLanguageEnabled ?? false,
    traditionalObservances: currentSettings.traditionalObservances ?? true,
    kememNotifications: currentSettings.kememNotifications ?? true,
    mourningPeriodNotifications: currentSettings.mourningPeriodNotifications ?? true,
    iroojObligations: currentSettings.iroojObligations ?? true,
    localHolidayReminders: currentSettings.localHolidayReminders ?? true,
    culturalLeaveTypes: currentSettings.culturalLeaveTypes ?? ['kemem', 'mourning', 'irooj', 'traditional'],
    defaultTimezone: currentSettings.defaultTimezone ?? 'Pacific/Majuro',
    culturalSensitivityLevel: currentSettings.culturalSensitivityLevel ?? 'high'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const culturalLeaveOptions = [
    { value: 'kemem', label: 'Kemem (First Birthday)', description: 'Traditional first birthday celebrations' },
    { value: 'mourning', label: 'Mourning Periods', description: 'Traditional mourning and funeral observances' },
    { value: 'irooj', label: 'Irooj Obligations', description: 'Chiefly duties and traditional governance' },
    { value: 'traditional', label: 'Traditional Healing', description: 'Traditional medicine and healing practices' },
    { value: 'community', label: 'Community Events', description: 'Important community gatherings and ceremonies' },
    { value: 'land', label: 'Land Matters', description: 'Traditional land and property ceremonies' }
  ];

  const sensitivityLevels = [
    { value: 'low', label: 'Standard', description: 'Basic cultural awareness' },
    { value: 'medium', label: 'Enhanced', description: 'Moderate cultural sensitivity' },
    { value: 'high', label: 'Comprehensive', description: 'Full cultural integration and respect' }
  ];

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCulturalLeaveToggle = (value) => {
    setSettings(prev => ({
      ...prev,
      culturalLeaveTypes: prev.culturalLeaveTypes.includes(value)
        ? prev.culturalLeaveTypes.filter(type => type !== value)
        : [...prev.culturalLeaveTypes, value]
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate saving settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave?.(settings);
      setSuccess('Cultural settings updated successfully!');
      
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 2000);
    } catch (error) {
      console.error('Save error:', error);
      setError('Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <HeartHandshake className="w-5 h-5 text-purple-500" />
            Cultural Settings
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Customize your experience with Marshall Islands cultural practices and traditions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {error && (
            <Alert className="border-red-500/50 bg-red-500/10">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500/50 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-400">{success}</AlertDescription>
            </Alert>
          )}

          {/* Cultural Calendar */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              Cultural Calendar
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Cultural Calendar
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Show Marshall Islands cultural events and traditional observances
                  </p>
                </div>
                <Switch
                  checked={settings.culturalCalendarEnabled}
                  onCheckedChange={(checked) => handleSettingChange('culturalCalendarEnabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Local Holiday Reminders
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Get notified about Marshall Islands public holidays
                  </p>
                </div>
                <Switch
                  checked={settings.localHolidayReminders}
                  onCheckedChange={(checked) => handleSettingChange('localHolidayReminders', checked)}
                />
              </div>
            </div>
          </div>

          {/* Language & Communication */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-500" />
              Language & Communication
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Marshallese Language
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Show Marshallese translations and cultural terms
                  </p>
                </div>
                <Switch
                  checked={settings.marshalleseLanguageEnabled}
                  onCheckedChange={(checked) => handleSettingChange('marshalleseLanguageEnabled', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Cultural Sensitivity Level
                </Label>
                <Select 
                  value={settings.culturalSensitivityLevel} 
                  onValueChange={(value) => handleSettingChange('culturalSensitivityLevel', value)}
                >
                  <SelectTrigger className="bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sensitivityLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <div>
                          <div className="font-medium">{level.label}</div>
                          <div className="text-xs text-gray-500">{level.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Traditional Observances */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-500" />
              Traditional Observances
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Traditional Observances
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Enable support for traditional cultural practices
                  </p>
                </div>
                <Switch
                  checked={settings.traditionalObservances}
                  onCheckedChange={(checked) => handleSettingChange('traditionalObservances', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Kemem Notifications
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Get reminders for first birthday celebrations
                  </p>
                </div>
                <Switch
                  checked={settings.kememNotifications}
                  onCheckedChange={(checked) => handleSettingChange('kememNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mourning Period Notifications
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Respectful reminders for mourning periods
                  </p>
                </div>
                <Switch
                  checked={settings.mourningPeriodNotifications}
                  onCheckedChange={(checked) => handleSettingChange('mourningPeriodNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Irooj Obligations
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Support for chiefly duties and traditional governance
                  </p>
                </div>
                <Switch
                  checked={settings.iroojObligations}
                  onCheckedChange={(checked) => handleSettingChange('iroojObligations', checked)}
                />
              </div>
            </div>
          </div>

          {/* Cultural Leave Types */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" />
              Cultural Leave Types
            </h3>
            
            <div className="space-y-3">
              {culturalLeaveOptions.map((option) => (
                <div key={option.value} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                  <input
                    type="checkbox"
                    id={option.value}
                    checked={settings.culturalLeaveTypes.includes(option.value)}
                    onChange={() => handleCulturalLeaveToggle(option.value)}
                    className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <div className="flex-1">
                    <Label 
                      htmlFor={option.value} 
                      className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
                    >
                      {option.label}
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Alert className="border-blue-500/50 bg-blue-500/10">
            <BookOpen className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-400 text-sm">
              These settings help IAKWE HR provide culturally appropriate support for Marshall Islands traditions and practices.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Cultural Settings'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
