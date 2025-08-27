import React, { useState, useEffect } from "react";
import { Policy } from "@/api/entities";
import { PolicyAcknowledgment } from "@/api/entities";
import { Employee } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  Plus, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Bot,
  Upload,
  Download
} from "lucide-react";

import PolicyCard from "../components/compliance/PolicyCard";
import CreatePolicyModal from "../components/compliance/CreatePolicyModal";
import PolicyModal from "../components/compliance/PolicyModal";
import AIAssistantModal from "../components/compliance/AIAssistantModal";

export default function Compliance() {
  const [policies, setPolicies] = useState([]);
  const [acknowledgments, setAcknowledgments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [policyData, acknowledgmentData, employeeData] = await Promise.all([
        Policy.list('-created_date'),
        PolicyAcknowledgment.list(),
        Employee.list()
      ]);
      
      setPolicies(policyData);
      setAcknowledgments(acknowledgmentData);
      setEmployees(employeeData);
    } catch (error) {
      console.error("Error loading compliance data:", error);
    }
    setIsLoading(false);
  };

  const handleCreatePolicy = async (policyData) => {
    try {
      // Use AI to review and enhance the policy
      const aiReview = await InvokeLLM({
        prompt: `Review this HR policy for compliance with Marshall Islands labor laws and cultural sensitivity. Provide suggestions for improvement and ensure it covers all necessary legal requirements:
        
        Title: ${policyData.title}
        Category: ${policyData.category}
        Content: ${policyData.content}
        
        Consider:
        1. Marshall Islands labor law compliance
        2. Cultural sensitivity for local customs
        3. Clarity and enforceability
        4. Missing sections or requirements
        
        Provide a structured review with specific recommendations.`,
        response_json_schema: {
          type: "object",
          properties: {
            compliance_score: { type: "number" },
            recommendations: { type: "array", items: { type: "string" } },
            cultural_considerations: { type: "array", items: { type: "string" } },
            legal_gaps: { type: "array", items: { type: "string" } },
            improved_content: { type: "string" }
          }
        }
      });

      const policyWithAI = {
        ...policyData,
        ai_review_notes: JSON.stringify(aiReview),
        content: aiReview.improved_content || policyData.content
      };

      await Policy.create(policyWithAI);
      await loadData();
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating policy:", error);
    }
  };

  const getFilteredPolicies = (status) => {
    let filtered = policies;
    
    if (status !== "all") {
      filtered = policies.filter(policy => policy.status.toLowerCase() === status.toLowerCase());
    }
    
    if (searchTerm) {
      filtered = filtered.filter(policy =>
        policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const activePolicies = getFilteredPolicies("active");
  const draftPolicies = getFilteredPolicies("draft");
  const underReviewPolicies = getFilteredPolicies("under review");

  // Calculate compliance stats
  const totalPolicies = policies.length;
  const activeCount = policies.filter(p => p.status === 'Active').length;
  const pendingAcknowledgments = acknowledgments.filter(a => a.status === 'Pending').length;
  const complianceRate = employees.length > 0 
    ? Math.round((acknowledgments.filter(a => a.status === 'Acknowledged').length / (employees.length * activeCount || 1)) * 100)
    : 0;

  return (
    <div className="p-6 md:p-8 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
            Legal & Compliance
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage HR policies and ensure legal compliance for Marshall Islands
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setShowAIAssistant(true)}
            variant="outline"
            className="border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            <Bot className="w-4 h-4 mr-2" />
            AI Assistant
          </Button>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Policy
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Policies</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalPolicies}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Policies</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Acknowledgments</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingAcknowledgments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Compliance Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{complianceRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-xl">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search policies by title, category, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/70 dark:bg-slate-700/70 border-gray-200 dark:border-slate-600"
            />
          </div>
        </CardContent>
      </Card>

      {/* Policies Content */}
      <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-xl">
        <CardHeader className="border-b border-gray-100 dark:border-slate-700">
          <CardTitle className="text-xl text-gray-900 dark:text-white">
            HR Policies & Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="p-6 pb-0">
              <TabsList className="bg-gray-100 dark:bg-slate-700">
                <TabsTrigger value="active" className="relative">
                  Active Policies
                  {activePolicies.length > 0 && (
                    <Badge className="ml-2 bg-green-500 text-white text-xs">
                      {activePolicies.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="draft">Drafts</TabsTrigger>
                <TabsTrigger value="under review">Under Review</TabsTrigger>
                <TabsTrigger value="all">All Policies</TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="active" className="mt-0">
                {isLoading ? (
                  <div className="space-y-4">
                    {Array(3).fill(0).map((_, i) => (
                      <div key={i} className="animate-pulse p-6 rounded-lg bg-gray-100 dark:bg-slate-700 h-32" />
                    ))}
                  </div>
                ) : activePolicies.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No Active Policies
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Create your first policy to get started with compliance management
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activePolicies.map((policy) => (
                      <PolicyCard
                        key={policy.id}
                        policy={policy}
                        acknowledgments={acknowledgments.filter(a => a.policy_id === policy.id)}
                        employees={employees}
                        onClick={() => setSelectedPolicy(policy)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="draft" className="mt-0">
                <div className="space-y-4">
                  {draftPolicies.map((policy) => (
                    <PolicyCard
                      key={policy.id}
                      policy={policy}
                      acknowledgments={acknowledgments.filter(a => a.policy_id === policy.id)}
                      employees={employees}
                      onClick={() => setSelectedPolicy(policy)}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="under review" className="mt-0">
                <div className="space-y-4">
                  {underReviewPolicies.map((policy) => (
                    <PolicyCard
                      key={policy.id}
                      policy={policy}
                      acknowledgments={acknowledgments.filter(a => a.policy_id === policy.id)}
                      employees={employees}
                      onClick={() => setSelectedPolicy(policy)}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="all" className="mt-0">
                <div className="space-y-4">
                  {getFilteredPolicies("all").map((policy) => (
                    <PolicyCard
                      key={policy.id}
                      policy={policy}
                      acknowledgments={acknowledgments.filter(a => a.policy_id === policy.id)}
                      employees={employees}
                      onClick={() => setSelectedPolicy(policy)}
                    />
                  ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modals */}
      {showCreateModal && (
        <CreatePolicyModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreatePolicy}
        />
      )}

      {selectedPolicy && (
        <PolicyModal
          policy={selectedPolicy}
          isOpen={!!selectedPolicy}
          onClose={() => setSelectedPolicy(null)}
          acknowledgments={acknowledgments.filter(a => a.policy_id === selectedPolicy.id)}
          employees={employees}
          onUpdate={loadData}
        />
      )}

      {showAIAssistant && (
        <AIAssistantModal
          isOpen={showAIAssistant}
          onClose={() => setShowAIAssistant(false)}
          context="compliance"
        />
      )}
    </div>
  );
}