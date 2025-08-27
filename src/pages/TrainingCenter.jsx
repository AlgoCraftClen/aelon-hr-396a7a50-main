
import React, { useState, useEffect } from "react";
import { Training } from "@/api/entities";
import { TrainingProgress } from "@/api/entities";
import { Employee } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, 
  Play, 
  Plus, 
  Award,
  Clock,
  Users,
  BookOpen,
  Shield
} from "lucide-react";

import TrainingCard from "../components/training/TrainingCard";
import CreateTrainingModal from "../components/training/CreateTrainingModal";
import TrainingModal from "../components/training/TrainingModal";

export default function TrainingCenter() {
  const [trainings, setTrainings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [trainingProgress, setTrainingProgress] = useState([]);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [trainingData, employeeData, progressData] = await Promise.all([
        Training.list('-created_date'),
        Employee.list(),
        TrainingProgress.list()
      ]);
      
      setTrainings(trainingData);
      setEmployees(employeeData);
      setTrainingProgress(progressData);
    } catch (error) {
      console.error("Error loading training data:", error);
    }
    setIsLoading(false);
  };

  const handleCreateTraining = async (trainingData) => {
    try {
      await Training.create(trainingData);
      await loadData();
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating training:", error);
    }
  };

  const filteredTrainings = trainings.filter(training => {
    if (activeTab === "all") return true;
    return training.category.toLowerCase() === activeTab.toLowerCase();
  });

  const categories = [...new Set(trainings.map(t => t.category))];

  // Calculate stats
  const totalTrainings = trainings.length;
  const mandatoryTrainings = trainings.filter(t => t.is_mandatory).length;
  const completedProgress = trainingProgress.filter(p => p.status === 'Completed').length;
  const activeEmployees = employees.filter(e => e.status === 'Active').length;

  return (
    <div className="p-6 md:p-8 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
            Training Center
          </h1>
          {/* FIXED: Enhanced contrast for subtitle */}
          <p className="text-gray-800 dark:text-gray-400 mt-1 font-medium">
            Manage employee training programs and track progress
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Training
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Trainings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalTrainings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Mandatory</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{mandatoryTrainings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Learners</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeEmployees}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Training Content */}
      <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-xl">
        <CardHeader className="border-b border-gray-100 dark:border-slate-700">
          <CardTitle className="text-xl text-gray-900 dark:text-white">
            Training Programs
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-gray-100 dark:bg-slate-700">
              <TabsTrigger value="all">All Trainings</TabsTrigger>
              <TabsTrigger value="Safety">Safety</TabsTrigger>
              <TabsTrigger value="Compliance">Compliance</TabsTrigger>
              <TabsTrigger value="Cultural Awareness">Cultural</TabsTrigger>
              <TabsTrigger value="Skills Development">Skills</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-6">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(6).fill(0).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredTrainings.length === 0 ? (
                <div className="text-center py-12">
                  <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No trainings found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {activeTab === "all" 
                      ? "Create your first training program to get started"
                      : `No ${activeTab.toLowerCase()} trainings available`
                    }
                  </p>
                  <Button 
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Training
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTrainings.map((training) => (
                    <TrainingCard
                      key={training.id}
                      training={training}
                      progress={trainingProgress.filter(p => p.training_id === training.id)}
                      onClick={() => setSelectedTraining(training)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modals */}
      {showCreateModal && (
        <CreateTrainingModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTraining}
        />
      )}

      {selectedTraining && (
        <TrainingModal
          training={selectedTraining}
          isOpen={!!selectedTraining}
          onClose={() => setSelectedTraining(null)}
          employees={employees}
          progress={trainingProgress.filter(p => p.training_id === selectedTraining.id)}
          onUpdate={loadData}
        />
      )}
    </div>
  );
}
