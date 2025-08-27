import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, 
  Loader2, 
  AlertTriangle, 
  CheckCircle,
  FileText,
  User,
  Calendar,
  GraduationCap,
  Shield,
  Database
} from 'lucide-react';

export default function DataExportModal({ isOpen, onClose, user }) {
  const [selectedData, setSelectedData] = useState({
    profile: true,
    leaveRequests: true,
    trainingProgress: true,
    performanceReviews: true,
    policyAcknowledgments: true,
    auditLogs: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const dataTypes = [
    {
      key: 'profile',
      label: 'Profile Information',
      description: 'Personal details, contact information, and preferences',
      icon: User
    },
    {
      key: 'leaveRequests',
      label: 'Leave Requests',
      description: 'All leave applications and approvals',
      icon: Calendar
    },
    {
      key: 'trainingProgress',
      label: 'Training Records',
      description: 'Completed training courses and certifications',
      icon: GraduationCap
    },
    {
      key: 'performanceReviews',
      label: 'Performance Reviews',
      description: 'Performance evaluations and feedback',
      icon: FileText
    },
    {
      key: 'policyAcknowledgments',
      label: 'Policy Acknowledgments',
      description: 'Signed policies and compliance records',
      icon: Shield
    },
    {
      key: 'auditLogs',
      label: 'Audit Logs',
      description: 'System activity and access logs',
      icon: Database
    }
  ];

  const handleDataToggle = (key) => {
    setSelectedData(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSelectAll = () => {
    const allSelected = Object.values(selectedData).every(Boolean);
    const newState = {};
    dataTypes.forEach(type => {
      newState[type.key] = !allSelected;
    });
    setSelectedData(newState);
  };

  const handleExport = async () => {
    const selectedTypes = Object.keys(selectedData).filter(key => selectedData[key]);
    
    if (selectedTypes.length === 0) {
      setError('Please select at least one data type to export');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate data export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create mock export data
      const exportData = {
        exportDate: new Date().toISOString(),
        user: user?.email || 'unknown',
        dataTypes: selectedTypes,
        data: {
          profile: selectedData.profile ? {
            fullName: user?.full_name || 'Unknown',
            email: user?.email || 'unknown@example.com',
            phone: user?.phone || 'N/A',
            position: user?.position || 'N/A',
            department: user?.department || 'N/A'
          } : null,
          leaveRequests: selectedData.leaveRequests ? [] : null,
          trainingProgress: selectedData.trainingProgress ? [] : null,
          performanceReviews: selectedData.performanceReviews ? [] : null,
          policyAcknowledgments: selectedData.policyAcknowledgments ? [] : null,
          auditLogs: selectedData.auditLogs ? [] : null
        }
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `iakwe-hr-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccess('Data export completed successfully!');
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 2000);
    } catch (error) {
      console.error('Export error:', error);
      setError('Failed to export data. Please try again.');
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
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Download className="w-5 h-5 text-purple-500" />
            Export Your Data
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Download a copy of your personal data from IAKWE HR
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Data to Export
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="text-xs"
              >
                {Object.values(selectedData).every(Boolean) ? 'Deselect All' : 'Select All'}
              </Button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {dataTypes.map((type) => (
                <div key={type.key} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                  <Checkbox
                    id={type.key}
                    checked={selectedData[type.key]}
                    onCheckedChange={() => handleDataToggle(type.key)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <Label 
                      htmlFor={type.key} 
                      className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
                    >
                      <type.icon className="w-4 h-4" />
                      {type.label}
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {type.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Alert className="border-blue-500/50 bg-blue-500/10">
            <AlertTriangle className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-400 text-sm">
              Your data will be exported in JSON format. This may take a few moments depending on the amount of data selected.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleExport}
            disabled={isLoading || Object.values(selectedData).every(Boolean) === false}
            className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
