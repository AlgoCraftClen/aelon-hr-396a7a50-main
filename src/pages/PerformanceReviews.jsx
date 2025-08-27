
import React, { useState, useEffect } from "react";
import { PerformanceReview } from "@/api/entities";
import { Employee } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, 
  Plus, 
  Star, 
  Clock, 
  CheckCircle,
  Users,
  TrendingUp,
  Calendar
} from "lucide-react";

import ReviewCard from "../components/performance/ReviewCard";
import CreateReviewModal from "../components/performance/CreateReviewModal";
import ReviewModal from "../components/performance/ReviewModal";

export default function PerformanceReviews() {
  const [reviews, setReviews] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [reviewData, employeeData] = await Promise.all([
        PerformanceReview.list('-created_date'),
        Employee.list()
      ]);
      
      setReviews(reviewData);
      setEmployees(employeeData);
    } catch (error) {
      console.error("Error loading performance data:", error);
    }
    setIsLoading(false);
  };

  const handleCreateReview = async (reviewData) => {
    try {
      await PerformanceReview.create(reviewData);
      await loadData();
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating performance review:", error);
    }
  };

  const getFilteredReviews = (status) => {
    if (status === "all") return reviews;
    return reviews.filter(review => review.status.toLowerCase() === status.toLowerCase());
  };

  const pendingReviews = getFilteredReviews("draft").concat(getFilteredReviews("pending employee review"));
  const completedReviews = getFilteredReviews("completed").concat(getFilteredReviews("approved"));
  const draftReviews = getFilteredReviews("draft");

  // Calculate stats
  const totalReviews = reviews.length;
  const avgRating = reviews.length > 0 
    ? reviews.filter(r => r.overall_rating).reduce((sum, r) => sum + r.overall_rating, 0) / reviews.filter(r => r.overall_rating).length
    : 0;
  const highPerformers = reviews.filter(r => r.overall_rating >= 4).length;

  return (
    <div className="p-6 md:p-8 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
            Performance Reviews
          </h1>
          {/* FIXED: Enhanced contrast for subtitle */}
          <p className="text-gray-800 dark:text-gray-400 mt-1 font-medium">
            Manage employee performance evaluations and development plans
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Review
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalReviews}</p>
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingReviews.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {avgRating > 0 ? avgRating.toFixed(1) : '—'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">High Performers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{highPerformers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews Content */}
      <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-xl">
        <CardHeader className="border-b border-gray-100 dark:border-slate-700">
          <CardTitle className="text-xl text-gray-900 dark:text-white">
            Performance Reviews
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="p-6 pb-0">
              <TabsList className="bg-gray-100 dark:bg-slate-700">
                <TabsTrigger value="pending" className="relative">
                  Pending
                  {pendingReviews.length > 0 && (
                    <Badge className="ml-2 bg-yellow-500 text-white text-xs">
                      {pendingReviews.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
                <TabsTrigger value="all">All Reviews</TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="pending" className="mt-0">
                {isLoading ? (
                  <div className="space-y-4">
                    {Array(3).fill(0).map((_, i) => (
                      <div key={i} className="animate-pulse p-6 rounded-lg bg-gray-100 dark:bg-slate-700 h-32" />
                    ))}
                  </div>
                ) : pendingReviews.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No Pending Reviews
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      All performance reviews are up to date
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingReviews.map((review) => (
                      <ReviewCard
                        key={review.id}
                        review={review}
                        employee={employees.find(e => e.id === review.employee_id)}
                        reviewer={employees.find(e => e.id === review.reviewer_id)}
                        onClick={() => setSelectedReview(review)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="completed" className="mt-0">
                <div className="space-y-4">
                  {completedReviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      employee={employees.find(e => e.id === review.employee_id)}
                      reviewer={employees.find(e => e.id === review.reviewer_id)}
                      onClick={() => setSelectedReview(review)}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="drafts" className="mt-0">
                <div className="space-y-4">
                  {draftReviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      employee={employees.find(e => e.id === review.employee_id)}
                      reviewer={employees.find(e => e.id === review.reviewer_id)}
                      onClick={() => setSelectedReview(review)}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="all" className="mt-0">
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      employee={employees.find(e => e.id === review.employee_id)}
                      reviewer={employees.find(e => e.id === review.reviewer_id)}
                      onClick={() => setSelectedReview(review)}
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
        <CreateReviewModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateReview}
          employees={employees}
        />
      )}

      {selectedReview && (
        <ReviewModal
          review={selectedReview}
          isOpen={!!selectedReview}
          onClose={() => setSelectedReview(null)}
          employee={employees.find(e => e.id === selectedReview.employee_id)}
          reviewer={employees.find(e => e.id === selectedReview.reviewer_id)}
          onUpdate={loadData}
        />
      )}
    </div>
  );
}
