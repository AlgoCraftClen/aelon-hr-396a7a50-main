
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Briefcase, Users, Filter } from 'lucide-react';
import { JobPosting } from '@/api/entities';
import { Applicant } from '@/api/entities';

const RecruitmentPage = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for initial view
  const mockJobs = [
    { id: 1, title: 'Senior Accountant', department: 'Finance', status: 'Open', applicants: 12 },
    { id: 2, title: 'IT Support Specialist', department: 'IT', status: 'Open', applicants: 25 },
    { id: 3, title: 'HR Coordinator', department: 'Human Resources', status: 'Closed', applicants: 48 },
    { id: 4, title: 'Marketing Manager', department: 'Marketing', status: 'Open', applicants: 8 },
    { id: 5, title: 'Product Designer', department: 'Product', status: 'Open', applicants: 15 },
    { id: 6, title: 'Customer Success Rep', department: 'Customer Success', status: 'Open', applicants: 30 },
  ];

  useEffect(() => {
    // In a real app, you would fetch data from entities
    // const loadData = async () => {
    //   setIsLoading(true);
    //   const [jobs, apps] = await Promise.all([JobPosting.list(), Applicant.list()]);
    //   setJobPostings(jobs);
    //   setApplicants(apps);
    //   setIsLoading(false);
    // }
    // loadData();
    const timer = setTimeout(() => {
      setJobPostings(mockJobs);
      setIsLoading(false);
    }, 1000); // Simulate network delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
            Recruitment
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage job postings and track applicants through your hiring pipeline.
          </p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 shadow-lg">
          <Plus className="w-4 h-4 mr-2" />
          New Job Posting
        </Button>
      </div>

      {/* Open Positions Cards */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-500" />
            Open Positions
          </h2>
          <Button variant="outline" size="sm" className="bg-slate-300 px-3 text-sm font-medium justify-center whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input hover:bg-accent hover:text-accent-foreground h-9 rounded-md flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobPostings.filter(j => j.status === 'Open').map(job => (
              <Card key={job.id} className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{job.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{job.department}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-500" />
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{job.applicants}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">applicants</span>
                      </div>
                      <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                        {job.status}
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Applicant Pipeline */}
      <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-500" />
            Applicant Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-center text-gray-500 py-8">
                Applicant Kanban board will be implemented here.
            </p>
        </CardContent>
      </Card>

    </div>
  );
};

export default RecruitmentPage;
