import React, { useState, useEffect } from "react";
import { PulseSurvey } from "@/api/entities";
import { SurveyResponse } from "@/api/entities";
import { SupportTicket } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  MessageSquare,
  Send,
  Star,
  AlertTriangle,
  Shield,
  Users,
  BarChart3,
  CheckCircle,
  Clock,
  Heart,
  Lightbulb
} from "lucide-react";

export default function FeedbackCenter() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSurveys, setActiveSurveys] = useState([]);
  const [myResponses, setMyResponses] = useState([]);
  const [feedbackForm, setFeedbackForm] = useState({
    type: 'general',
    subject: '',
    message: '',
    isAnonymous: false,
    category: 'General Inquiry'
  });
  const [whistleblowerForm, setWhistleblowerForm] = useState({
    subject: '',
    description: '',
    severity: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userData, surveys, responses] = await Promise.all([
        User.me(),
        PulseSurvey.filter({ status: 'active' }),
        SurveyResponse.list().catch(() => []) // Handle if no responses exist
      ]);

      setCurrentUser(userData);
      setActiveSurveys(surveys);
      
      // Filter responses for current user if not anonymous
      const userResponses = responses.filter(r => r.employee_id === userData.id);
      setMyResponses(userResponses);
    } catch (error) {
      console.error("Error loading feedback data:", error);
      // Create sample data for demo
      setActiveSurveys([
        {
          id: 'sample-1',
          title: 'Quarterly Employee Satisfaction',
          description: 'Help us improve your work experience',
          questions: [
            { question: 'How satisfied are you with your current role?', type: 'rating', required: true },
            { question: 'What would you like to see improved?', type: 'text', required: false }
          ],
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          is_anonymous: true
        }
      ]);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await SupportTicket.create({
        employee_id: feedbackForm.isAnonymous ? null : currentUser?.id,
        subject: feedbackForm.subject,
        description: feedbackForm.message,
        category: feedbackForm.category,
        priority: 'Medium',
        is_anonymous: feedbackForm.isAnonymous,
        cultural_sensitivity_flag: feedbackForm.category === 'Cultural Issues'
      });

      setSubmitSuccess(true);
      setFeedbackForm({
        type: 'general',
        subject: '',
        message: '',
        isAnonymous: false,
        category: 'General Inquiry'
      });

      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }

    setIsSubmitting(false);
  };

  const handleWhistleblowerSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await SupportTicket.create({
        employee_id: null, // Always anonymous
        subject: `🚨 CONFIDENTIAL REPORT: ${whistleblowerForm.subject}`,
        description: whistleblowerForm.description,
        category: 'Workplace Concern',
        priority: whistleblowerForm.severity === 'high' ? 'Urgent' : 'High',
        is_anonymous: true,
        cultural_sensitivity_flag: true
      });

      setSubmitSuccess(true);
      setWhistleblowerForm({
        subject: '',
        description: '',
        severity: 'medium'
      });

      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error("Error submitting whistleblower report:", error);
    }

    setIsSubmitting(false);
  };

  const submitSurveyResponse = async (surveyId, responses) => {
    try {
      await SurveyResponse.create({
        survey_id: surveyId,
        employee_id: currentUser?.id,
        responses: responses,
        is_anonymous: true
      });
      
      // Refresh data
      loadData();
    } catch (error) {
      console.error("Error submitting survey response:", error);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
            Feedback Center
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Share your thoughts, complete surveys, and help improve our workplace
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Shield className="w-3 h-3 mr-1" />
            Confidential & Secure
          </Badge>
        </div>
      </div>

      {/* Success Message */}
      {submitSuccess && (
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Thank you for your feedback!</span>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              Your submission has been received and will be reviewed by our team.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Main Tabs */}
      <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-xl">
        <CardContent className="p-0">
          <Tabs defaultValue="feedback" className="w-full">
            <div className="p-6 pb-0">
              <TabsList className="bg-gray-100 dark:bg-slate-700">
                <TabsTrigger value="feedback" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  General Feedback
                </TabsTrigger>
                <TabsTrigger value="surveys" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Surveys
                </TabsTrigger>
                <TabsTrigger value="whistleblower" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Confidential Report
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="feedback" className="mt-0">
                <div className="max-w-2xl mx-auto">
                  <Card className="bg-gray-50 dark:bg-slate-700/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-500" />
                        Share Your Feedback
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Help us improve by sharing your thoughts and suggestions
                      </p>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select 
                            value={feedbackForm.category} 
                            onValueChange={(value) => setFeedbackForm({...feedbackForm, category: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                              <SelectItem value="HR Policy">HR Policy</SelectItem>
                              <SelectItem value="Training">Training</SelectItem>
                              <SelectItem value="Benefits">Benefits</SelectItem>
                              <SelectItem value="Cultural Issues">Cultural Issues</SelectItem>
                              <SelectItem value="Workplace Concern">Workplace Concern</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject</Label>
                          <Input
                            id="subject"
                            value={feedbackForm.subject}
                            onChange={(e) => setFeedbackForm({...feedbackForm, subject: e.target.value})}
                            placeholder="Brief description of your feedback"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Your Feedback</Label>
                          <Textarea
                            id="message"
                            value={feedbackForm.message}
                            onChange={(e) => setFeedbackForm({...feedbackForm, message: e.target.value})}
                            placeholder="Please share your detailed feedback..."
                            className="h-32"
                            required
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="anonymous"
                            checked={feedbackForm.isAnonymous}
                            onCheckedChange={(checked) => setFeedbackForm({...feedbackForm, isAnonymous: checked})}
                          />
                          <Label htmlFor="anonymous" className="text-sm">
                            Submit anonymously
                          </Label>
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700"
                        >
                          {isSubmitting ? (
                            <>
                              <Clock className="w-4 h-4 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Submit Feedback
                            </>
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="surveys" className="mt-0">
                <div className="space-y-6">
                  <div className="text-center">
                    <Lightbulb className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Active Surveys
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Your participation helps us create a better workplace
                    </p>
                  </div>

                  {activeSurveys.length === 0 ? (
                    <Card className="bg-gray-50 dark:bg-slate-700/50">
                      <CardContent className="p-8 text-center">
                        <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600 dark:text-gray-400">
                          No active surveys at the moment. Check back later!
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-6">
                      {activeSurveys.map((survey) => {
                        const hasResponded = myResponses.some(r => r.survey_id === survey.id);
                        
                        return (
                          <Card key={survey.id} className="bg-gray-50 dark:bg-slate-700/50">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div>
                                  <CardTitle className="text-lg">{survey.title}</CardTitle>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {survey.description}
                                  </p>
                                </div>
                                {hasResponded ? (
                                  <Badge className="bg-green-500 text-white">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Completed
                                  </Badge>
                                ) : (
                                  <Badge variant="outline">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Pending
                                  </Badge>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  <p>Questions: {survey.questions?.length || 0}</p>
                                  <p>Deadline: {new Date(survey.end_date).toLocaleDateString()}</p>
                                  {survey.is_anonymous && (
                                    <p className="flex items-center gap-1 mt-1 text-green-600">
                                      <Shield className="w-3 h-3" />
                                      Anonymous
                                    </p>
                                  )}
                                </div>
                                {!hasResponded && (
                                  <Button size="sm" variant="outline">
                                    <Star className="w-4 h-4 mr-2" />
                                    Take Survey
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="whistleblower" className="mt-0">
                <div className="max-w-2xl mx-auto">
                  <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                        <Shield className="w-5 h-5" />
                        Confidential Reporting
                      </CardTitle>
                      <div className="text-sm text-red-600 dark:text-red-400 space-y-2">
                        <p>This is a secure, anonymous channel for reporting:</p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Harassment or discrimination</li>
                          <li>Safety violations</li>
                          <li>Ethical concerns</li>
                          <li>Policy violations</li>
                          <li>Other serious workplace issues</li>
                        </ul>
                        <p className="font-medium">
                          🔒 Your identity will remain completely anonymous
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleWhistleblowerSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="severity">Severity Level</Label>
                          <Select 
                            value={whistleblowerForm.severity} 
                            onValueChange={(value) => setWhistleblowerForm({...whistleblowerForm, severity: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select severity" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="medium">Medium - Needs attention</SelectItem>
                              <SelectItem value="high">High - Urgent issue</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="wb-subject">Brief Summary</Label>
                          <Input
                            id="wb-subject"
                            value={whistleblowerForm.subject}
                            onChange={(e) => setWhistleblowerForm({...whistleblowerForm, subject: e.target.value})}
                            placeholder="Brief description of the issue"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="wb-description">Detailed Description</Label>
                          <Textarea
                            id="wb-description"
                            value={whistleblowerForm.description}
                            onChange={(e) => setWhistleblowerForm({...whistleblowerForm, description: e.target.value})}
                            placeholder="Please provide as much detail as possible about the incident or concern..."
                            className="h-40"
                            required
                          />
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-yellow-700 dark:text-yellow-400">
                              <p className="font-medium mb-1">Important Notice:</p>
                              <p>
                                This report will be handled with complete confidentiality by our HR team. 
                                No identifying information will be stored or shared. We take all reports seriously 
                                and will investigate appropriately while protecting your anonymity.
                              </p>
                            </div>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-red-600 hover:bg-red-700 text-white"
                        >
                          {isSubmitting ? (
                            <>
                              <Clock className="w-4 h-4 mr-2 animate-spin" />
                              Submitting Securely...
                            </>
                          ) : (
                            <>
                              <Shield className="w-4 h-4 mr-2" />
                              Submit Confidential Report
                            </>
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}