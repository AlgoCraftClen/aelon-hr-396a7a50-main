import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { PrivacyConsent } from "@/api/entities";
import { AuditLog } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Shield,
  Lock,
  Eye,
  FileText,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  Key,
  Database,
  Activity
} from "lucide-react";
import { format } from "date-fns";

export default function PrivacySecurity() {
  const [user, setUser] = useState(null);
  const [consents, setConsents] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [privacySettings, setPrivacySettings] = useState({
    dataRetentionYears: 7,
    autoArchiveEnabled: true,
    encryptionEnabled: true,
    auditLogsEnabled: true
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const [consentData, auditData] = await Promise.all([
        PrivacyConsent.list('-created_date', 20),
        AuditLog.list('-timestamp', 50)
      ]);

      setConsents(consentData);
      setAuditLogs(auditData);
    } catch (error) {
      console.error("Error loading privacy data:", error);
    }
    setIsLoading(false);
  };

  const consentTypes = [
    {
      type: "data_collection",
      title: "Personal Data Collection",
      description: "Allow collection and processing of personal information",
      critical: true
    },
    {
      type: "training_tracking",
      title: "Training Progress Tracking",
      description: "Track completion and progress of training modules",
      critical: false
    },
    {
      type: "policy_acknowledgment",
      title: "Policy Acknowledgment Tracking",
      description: "Record acknowledgment of company policies",
      critical: true
    },
    {
      type: "performance_data",
      title: "Performance Data Processing",
      description: "Process performance reviews and evaluations",
      critical: false
    }
  ];

  const getConsentStatus = (type) => {
    const consent = consents.find(c => c.consent_type === type);
    return consent?.status || 'pending';
  };

  const getConsentCount = (status) => {
    return consents.filter(c => c.status === status).length;
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2 text-white">Loading privacy settings...</span>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 text-white">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
            Privacy & Security Governance
          </h1>
          <p className="text-gray-400 mt-1">
            Manage data privacy, compliance, and security across your organization
          </p>
        </div>
      </div>

      {/* Privacy Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
  <Card className="bg-white/50 dark:bg-[#24243e]/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Consents Granted</p>
                <p className="text-2xl font-bold text-white">{getConsentCount('granted')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

  <Card className="bg-white/50 dark:bg-[#24243e]/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Pending Consents</p>
                <p className="text-2xl font-bold text-white">{getConsentCount('pending')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

  <Card className="bg-white/50 dark:bg-[#24243e]/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Data Retention</p>
                <p className="text-2xl font-bold text-white">{privacySettings.dataRetentionYears}y</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#24243e]/80 backdrop-blur-sm border border-gray-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Recent Activity</p>
                <p className="text-2xl font-bold text-white">{auditLogs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
  <Card className="bg-white/50 dark:bg-[#24243e]/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white">
        <CardContent className="p-0">
          <Tabs defaultValue="consents" className="w-full">
            <div className="p-6 border-b border-gray-700/50">
              <TabsList className="bg-gray-800/50">
                <TabsTrigger value="consents">Consent Management</TabsTrigger>
                <TabsTrigger value="audit">Audit Logs</TabsTrigger>
                <TabsTrigger value="encryption">Data Protection</TabsTrigger>
                <TabsTrigger value="retention">Data Retention</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="consents" className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Employee Consent Management</h3>
                
                {consentTypes.map((consentType) => {
                  const status = getConsentStatus(consentType.type);
                  const statusColor = status === 'granted' ? 'text-green-400' : 
                                    status === 'withdrawn' ? 'text-red-400' : 'text-yellow-400';
                  
                  return (
                    <div key={consentType.type} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-white">{consentType.title}</h4>
                            {consentType.critical && (
                              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                                Critical
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-400">{consentType.description}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={`${statusColor} border-current`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Alert className="bg-blue-500/10 border-blue-500/30">
                <Shield className="h-4 w-4 text-blue-400" />
                <AlertDescription className="text-blue-300">
                  All employee data is processed in compliance with Marshall Islands privacy regulations and international standards.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="audit" className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Recent System Activity</h3>
                
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {auditLogs.length === 0 ? (
                      <div className="text-center py-8">
                        <Activity className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                        <p className="text-gray-400">No audit logs available</p>
                      </div>
                    ) : (
                      auditLogs.map((log, index) => (
                        <div key={index} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white font-medium">{log.action}</p>
                              <p className="text-sm text-gray-400">
                                {log.resource_type} • {log.details}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-400">
                                {format(new Date(log.timestamp), 'MMM d, HH:mm')}
                              </p>
                              <Badge 
                                className={`text-xs ${
                                  log.severity === 'critical' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                  log.severity === 'high' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                                  'bg-gray-500/20 text-gray-400 border-gray-500/30'
                                }`}
                              >
                                {log.severity}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="encryption" className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Data Protection Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="font-medium text-white">AES-256 Encryption</p>
                        <p className="text-sm text-gray-400">Data encrypted in transit and at rest</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Active
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <div className="flex items-center gap-3">
                      <Key className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="font-medium text-white">Access Control</p>
                        <p className="text-sm text-gray-400">Role-based permissions active</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Enforced
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="font-medium text-white">Data Anonymization</p>
                        <p className="text-sm text-gray-400">Survey responses and sensitive data anonymized</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      Enabled
                    </Badge>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="retention" className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Data Retention Policy</h3>
                
                <Alert className="bg-purple-500/10 border-purple-500/30">
                  <FileText className="h-4 w-4 text-purple-400" />
                  <AlertDescription className="text-purple-300">
                    Current retention policy: Employee data retained for {privacySettings.dataRetentionYears} years after employment termination, in compliance with Marshall Islands employment law.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <div>
                      <p className="font-medium text-white">Auto-archive inactive records</p>
                      <p className="text-sm text-gray-400">Automatically archive records after retention period</p>
                    </div>
                    <Switch 
                      checked={privacySettings.autoArchiveEnabled}
                      onCheckedChange={(checked) => 
                        setPrivacySettings({...privacySettings, autoArchiveEnabled: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <div>
                      <p className="font-medium text-white">Audit trail retention</p>
                      <p className="text-sm text-gray-400">Keep detailed logs for compliance</p>
                    </div>
                    <Switch 
                      checked={privacySettings.auditLogsEnabled}
                      onCheckedChange={(checked) => 
                        setPrivacySettings({...privacySettings, auditLogsEnabled: checked})
                      }
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}