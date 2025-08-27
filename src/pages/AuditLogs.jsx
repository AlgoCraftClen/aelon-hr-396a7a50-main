import React, { useState, useEffect } from "react";
import { AuditLog } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileCheck, 
  Search, 
  Filter, 
  Shield, 
  AlertTriangle,
  Eye,
  Clock,
  User as UserIcon
} from "lucide-react";
import { format } from "date-fns";

export default function AuditLogs() {
  const [auditLogs, setAuditLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [resourceFilter, setResourceFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    setIsLoading(true);
    try {
      const [logs, userData] = await Promise.all([
        AuditLog.list('-timestamp', 100), // Get latest 100 logs
        User.me()
      ]);
      
      setAuditLogs(logs);
      setFilteredLogs(logs);
      setCurrentUser(userData);
    } catch (error) {
      console.error("Error loading audit logs:", error);
      // For demo purposes, show sample data if no logs exist
      const sampleLogs = [
        {
          id: 'sample-1',
          user_id: 'admin@company.com',
          action: 'CREATE',
          resource_type: 'Employee',
          resource_id: 'emp-001',
          details: 'Created new employee record for John Doe',
          ip_address: '192.168.1.1',
          timestamp: new Date().toISOString(),
          severity: 'low',
          compliance_relevant: true
        },
        {
          id: 'sample-2',
          user_id: 'hr@company.com',
          action: 'UPDATE',
          resource_type: 'Policy',
          resource_id: 'pol-001',
          details: 'Updated employee handbook policy',
          ip_address: '192.168.1.2',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          severity: 'medium',
          compliance_relevant: true
        },
        {
          id: 'sample-3',
          user_id: 'admin@company.com',
          action: 'DELETE',
          resource_type: 'Training',
          resource_id: 'tra-001',
          details: 'Deleted outdated training program',
          ip_address: '192.168.1.1',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          severity: 'high',
          compliance_relevant: false
        }
      ];
      setAuditLogs(sampleLogs);
      setFilteredLogs(sampleLogs);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    let filtered = auditLogs;

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (actionFilter !== "all") {
      filtered = filtered.filter(log => log.action.toLowerCase() === actionFilter.toLowerCase());
    }

    if (resourceFilter !== "all") {
      filtered = filtered.filter(log => log.resource_type.toLowerCase() === resourceFilter.toLowerCase());
    }

    if (severityFilter !== "all") {
      filtered = filtered.filter(log => log.severity === severityFilter);
    }

    setFilteredLogs(filtered);
  }, [searchTerm, actionFilter, resourceFilter, severityFilter, auditLogs]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getActionIcon = (action) => {
    switch (action.toUpperCase()) {
      case 'CREATE': return <span className="text-green-600">+</span>;
      case 'UPDATE': return <span className="text-blue-600">✎</span>;
      case 'DELETE': return <span className="text-red-600">×</span>;
      case 'VIEW': return <Eye className="w-4 h-4 text-gray-600" />;
      default: return <span className="text-gray-600">•</span>;
    }
  };

  const uniqueActions = [...new Set(auditLogs.map(log => log.action))];
  const uniqueResources = [...new Set(auditLogs.map(log => log.resource_type))];

  return (
    <div className="p-6 md:p-8 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
            Audit Logs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track system access and data modifications for compliance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Shield className="w-3 h-3 mr-1" />
            Compliance Ready
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/70 dark:bg-slate-700/70"
              />
            </div>

            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {uniqueActions.map(action => (
                  <SelectItem key={action} value={action}>{action}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={resourceFilter} onValueChange={setResourceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Resources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Resources</SelectItem>
                {uniqueResources.map(resource => (
                  <SelectItem key={resource} value={resource}>{resource}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Filter className="w-4 h-4" />
              {filteredLogs.length} of {auditLogs.length}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Entries */}
      <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-purple-500" />
            System Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse flex items-center gap-4 p-4 border-b border-gray-100 dark:border-slate-700">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-12 text-center">
              <FileCheck className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Audit Logs Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No activities match your current filter criteria
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-slate-700">
              {filteredLogs.map((log, index) => (
                <div key={log.id || index} className="p-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700">
                      {getActionIcon(log.action)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {log.action} {log.resource_type}
                        </span>
                        <Badge className={`text-xs ${getSeverityColor(log.severity)}`}>
                          {log.severity}
                        </Badge>
                        {log.compliance_relevant && (
                          <Badge variant="outline" className="text-xs">
                            <Shield className="w-3 h-3 mr-1" />
                            Compliance
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-2">
                        {log.details}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <UserIcon className="w-3 h-3" />
                          {log.user_id}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(log.timestamp), 'MMM d, yyyy h:mm a')}
                        </div>
                        {log.ip_address && (
                          <div className="text-xs text-gray-400">
                            IP: {log.ip_address}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}