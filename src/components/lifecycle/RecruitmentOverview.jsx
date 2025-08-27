import React, { useState, useEffect } from "react";
import { JobPosting } from "@/api/entities";
import { Applicant } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Briefcase,
  Users,
  Eye,
  Plus,
  Calendar,
  MapPin,
  Clock
} from "lucide-react";

export default function RecruitmentOverview() {
  const [jobPostings, setJobPostings] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecruitmentData();
  }, []);

  const loadRecruitmentData = async () => {
    setIsLoading(true);
    try {
      const [jobData, applicantData] = await Promise.all([
        JobPosting.list('-created_date'),
        Applicant.list('-application_date')
      ]);
      
      setJobPostings(jobData);
      setApplicants(applicantData);
    } catch (error) {
      console.error("Error loading recruitment data:", error);
    }
    setIsLoading(false);
  };

  const openPositions = jobPostings.filter(job => job.status === 'Open');
  const totalApplicants = applicants.length;
  const recentApplicants = applicants.filter(app => {
    const appDate = new Date(app.application_date);
    const daysSinceApplication = (new Date() - appDate) / (1000 * 60 * 60 * 24);
    return daysSinceApplication <= 7;
  });

  const getApplicantCountForJob = (jobId) => {
    return applicants.filter(app => app.job_posting_id === jobId).length;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Draft': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Closed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'Archived': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-gray-700/50 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Recruitment Pipeline</h3>
        <Button 
          className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700"
          disabled
        >
          <Plus className="w-4 h-4 mr-2" />
          Post New Job (Coming Soon)
        </Button>
      </div>

      {/* Recruitment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800/50 border border-gray-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Open Positions</p>
                <p className="text-2xl font-bold text-white">{openPositions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border border-gray-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Applicants</p>
                <p className="text-2xl font-bold text-white">{totalApplicants}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border border-gray-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">New This Week</p>
                <p className="text-2xl font-bold text-white">{recentApplicants.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Job Postings */}
      <div className="space-y-4">
        <h4 className="text-md font-semibold text-white">Active Job Postings</h4>
        
        {jobPostings.length === 0 ? (
          <Card className="bg-gray-800/50 border border-gray-700/50">
            <CardContent className="p-8 text-center">
              <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-500" />
              <h3 className="text-lg font-semibold text-white mb-2">No Job Postings Yet</h3>
              <p className="text-gray-400 mb-4">
                Create your first job posting to start attracting talent to your organization.
              </p>
              <Button 
                className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700"
                disabled
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Job Posting (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {jobPostings.slice(0, 6).map((job) => (
              <Card key={job.id} className="bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800/70 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">{job.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.location || 'Not specified'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          {job.department}
                        </span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {job.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{getApplicantCountForJob(job.id)} applicants</span>
                    </div>
                    <Button size="sm" variant="outline" disabled>
                      <Eye className="w-4 h-4 mr-1" />
                      View (Soon)
                    </Button>
                  </div>
                  
                  {job.closing_date && (
                    <div className="mt-3 pt-3 border-t border-gray-700/50">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>Closes: {new Date(job.closing_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Recruitment Pipeline Stages */}
      <div className="space-y-4">
        <h4 className="text-md font-semibold text-white">Application Pipeline (Preview)</h4>
        
        <Card className="bg-gray-800/50 border border-gray-700/50">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { stage: 'Applied', count: totalApplicants, color: 'blue' },
                  { stage: 'Shortlisted', count: Math.floor(totalApplicants * 0.4), color: 'yellow' },
                  { stage: 'Interviewing', count: Math.floor(totalApplicants * 0.2), color: 'orange' },
                  { stage: 'Offer Made', count: Math.floor(totalApplicants * 0.1), color: 'purple' },
                  { stage: 'Hired', count: Math.floor(totalApplicants * 0.05), color: 'green' }
                ].map((stage) => (
                  <div key={stage.stage} className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-2 rounded-full bg-${stage.color}-500/20 border-2 border-${stage.color}-500/30 flex items-center justify-center`}>
                      <span className={`text-xl font-bold text-${stage.color}-400`}>
                        {stage.count}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-white">{stage.stage}</p>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-4">
                  Full applicant tracking system coming soon. Current data shows estimated pipeline progression.
                </p>
                <Button variant="outline" disabled>
                  Configure Pipeline Stages (Coming Soon)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}