import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Download, 
  CreditCard, 
  DollarSign,
  Calendar,
  Users,
  Zap,
  Crown,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Company } from '@/api/entities';
import { User } from '@/api/entities';
import { Employee } from '@/api/entities';

const BillingDashboard = () => {
  const [company, setCompany] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await User.me();
        if (user.company_id) {
          const [companies, employeeData] = await Promise.all([
            Company.list(),
            Employee.list()
          ]);
          const currentCompany = companies.find(c => c.id === user.company_id);
          setCompany(currentCompany);
          setEmployees(employeeData);
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const planFeatures = {
    Free: { 
      limit: '10 Employees', 
      color: 'bg-gray-500',
      icon: Users,
      price: '$0',
      features: ['Basic HR Dashboard', 'Employee Directory', 'Leave Management']
    },
    Standard: { 
      limit: '50 Employees', 
      color: 'bg-blue-500',
      icon: Zap,
      price: '$49',
      features: ['Training Center', 'Performance Reviews', 'Compliance Hub', 'Email Support']
    },
    Premium: { 
      limit: 'Unlimited Employees', 
      color: 'bg-purple-600',
      icon: Crown,
      price: '$99',
      features: ['HR AI Assistant', 'Advanced Analytics', 'Custom Roles', 'Dedicated Support']
    },
    Enterprise: { 
      limit: 'Custom', 
      color: 'bg-slate-800',
      icon: Star,
      price: 'Custom',
      features: ['White-label Solution', 'Custom Integrations', 'Dedicated Account Manager']
    },
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'trialing':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'past_due':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getUsagePercentage = () => {
    if (!company || !employees.length) return 0;
    
    const limits = {
      Free: 10,
      Standard: 50,
      Premium: 999999, // "Unlimited"
      Enterprise: 999999
    };
    
    const limit = limits[company.subscription_plan] || 10;
    return Math.min((employees.length / limit) * 100, 100);
  };

  if (isLoading) {
    return <CardContent className="p-6"><p>Loading billing information...</p></CardContent>;
  }

  if (!company) {
    return (
      <CardContent className="p-6 text-center">
        <p className="mb-4">You are not associated with a company. Please create or join a company to manage billing.</p>
        <Link to={createPageUrl('Pricing')}>
          <Button>View Plans</Button>
        </Link>
      </CardContent>
    );
  }

  const currentPlan = planFeatures[company.subscription_plan] || planFeatures.Free;
  const trialEndDate = company.trial_end_date ? new Date(company.trial_end_date).toLocaleDateString() : 'N/A';
  const nextBillingDate = company.next_billing_date ? new Date(company.next_billing_date).toLocaleDateString() : 'N/A';
  const usagePercentage = getUsagePercentage();
  const PlanIcon = currentPlan.icon;

  return (
    <div className="space-y-6">
      {/* Current Plan Overview */}
      <Card className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${currentPlan.color} shadow-lg`}>
                <PlanIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">{company.subscription_plan} Plan</CardTitle>
                <CardDescription className="text-lg">
                  {currentPlan.price}{currentPlan.price !== 'Custom' ? '/month' : ''}
                </CardDescription>
              </div>
            </div>
            <Badge className={`${currentPlan.color} text-white text-lg px-4 py-2`}>
              Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Usage Meter */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Employee Usage</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {employees.length} of {currentPlan.limit.split(' ')[0] === 'Unlimited' ? '∞' : currentPlan.limit.split(' ')[0]} employees
              </span>
            </div>
            <Progress value={usagePercentage} className="h-3" />
            {usagePercentage > 80 && company.subscription_plan === 'Free' && (
              <p className="text-sm text-orange-600 dark:text-orange-400">
                You're approaching your employee limit. Consider upgrading for more capacity.
              </p>
            )}
          </div>

          {/* Plan Features */}
          <div>
            <h4 className="font-medium mb-3">Plan Features</h4>
            <div className="grid md:grid-cols-2 gap-2">
              {currentPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status and Billing Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2">
                {getStatusIcon(company.subscription_status)}
                <span className="font-medium">Status:</span>
                <span className="capitalize">{company.subscription_status}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                <span className="font-medium">
                  {company.subscription_status === 'trialing' ? 'Trial ends:' : 'Next billing:'}
                </span>
                <span>{company.subscription_status === 'trialing' ? trialEndDate : nextBillingDate}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to={createPageUrl('Pricing')} className="flex-1">
              <Button variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-300">
                Compare Plans
              </Button>
            </Link>
            <Button className="flex-1 bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700">
              Manage Subscription
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-purple-500" /> 
            Payment Method
          </CardTitle>
          <CardDescription>Your primary payment method for subscription renewals.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">VISA</span>
              </div>
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Expires 12/27</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Update</Button>
          </div>
          
          <Button variant="ghost" className="w-full">
            + Add Payment Method
          </Button>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" /> 
            Billing History
          </CardTitle>
          <CardDescription>Review your past invoices and payments.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { id: '12345', date: 'Dec 1, 2024', amount: '$49.00', status: 'Paid' },
              { id: '12344', date: 'Nov 1, 2024', amount: '$49.00', status: 'Paid' },
              { id: '12343', date: 'Oct 1, 2024', amount: '$49.00', status: 'Paid' },
            ].map((invoice) => (
              <div key={invoice.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium">Invoice #{invoice.id}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{invoice.date}</p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400">
                    {invoice.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{invoice.amount}</span>
                  <Button variant="ghost" size="icon">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <Button variant="ghost" className="text-purple-600 hover:text-purple-700 dark:text-purple-400">
              View All Invoices
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage Analytics (if Premium/Enterprise) */}
      {(company.subscription_plan === 'Premium' || company.subscription_plan === 'Enterprise') && (
        <Card>
          <CardHeader>
            <CardTitle>Usage Analytics</CardTitle>
            <CardDescription>Track your platform usage and insights.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{employees.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Employees</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">247</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Training Sessions</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">98%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Compliance Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BillingDashboard;