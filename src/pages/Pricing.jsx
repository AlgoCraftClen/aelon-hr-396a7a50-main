
import React, { useState } from 'react';
import { CheckCircle, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom'; // Assuming react-router-dom for Link component

// Helper function for creating page URLs (adjust based on your routing setup)
const createPageUrl = (pageName) => {
  if (pageName.includes("?")) {
    const [base, query] = pageName.split("?");
    return `/${base.toLowerCase()}?${query}`;
  }
  return `/${pageName.toLowerCase()}`;
};

const pricingTiers = {
  monthly: [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'For small teams & startups exploring our platform.',
      features: [
        'Up to 10 Employees',
        'Basic HR Dashboard',
        'Employee Directory',
        'Standard Onboarding',
        'Leave Management',
        'Community Support',
      ],
      cta: 'Get Started',
      isPopular: false,
    },
    {
      name: 'Standard',
      price: '$49',
      period: '/month',
      description: 'For growing businesses needing core HR tools.',
      features: [
        'Up to 50 Employees',
        'Full HR Dashboard',
        'Training Center',
        'Performance Reviews',
        'Compliance Hub',
        'Email & Chat Support',
      ],
      cta: 'Choose Standard',
      isPopular: true,
    },
    {
      name: 'Premium',
      price: '$99',
      period: '/month',
      description: 'For established companies requiring advanced features.',
      features: [
        'Unlimited Employees',
        'HR AI Assistant',
        'Advanced Analytics',
        'Custom Roles & Permissions',
        'Dedicated Support Manager',
        'API Access',
      ],
      cta: 'Choose Premium',
      isPopular: false,
    },
  ],
  annually: [
    {
      name: 'Free',
      price: '$0',
      period: '/year',
      description: 'For small teams & startups exploring our platform.',
      features: [
        'Up to 10 Employees',
        'Basic HR Dashboard',
        'Employee Directory',
        'Standard Onboarding',
        'Leave Management',
        'Community Support',
      ],
      cta: 'Get Started',
      isPopular: false,
    },
    {
      name: 'Standard',
      price: '$490',
      period: '/year',
      description: 'For growing businesses needing core HR tools.',
      features: [
        'Up to 50 Employees',
        'Full HR Dashboard',
        'Training Center',
        'Performance Reviews',
        'Compliance Hub',
        'Email & Chat Support',
      ],
      cta: 'Choose Standard',
      isPopular: true,
    },
    {
      name: 'Premium',
      price: '$990',
      period: '/year',
      description: 'For established companies requiring advanced features.',
      features: [
        'Unlimited Employees',
        'HR AI Assistant',
        'Advanced Analytics',
        'Custom Roles & Permissions',
        'Dedicated Support Manager',
        'API Access',
      ],
      cta: 'Choose Premium',
      isPopular: false,
    },
  ],
};

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const handleSubscription = (plan) => {
    // This would typically redirect to a Stripe checkout session
    alert(`You've selected the ${plan.name} plan!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 text-gray-900 dark:text-white">
      {/* Header with Logo */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-gray-100 dark:border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to={createPageUrl("Welcome")} className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-lg">HR</span>
              </div>
              <div className="text-left">
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
                  IAKWE HR
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Marshall Islands</p>
              </div>
            </Link>

            {/* Navigation */}
            <div className="flex items-center gap-4">
              <Link to={createPageUrl("Auth?mode=login")}>
                <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900/20">
                  <LogIn className="w-4 h-4 mr-2" />
                  Log In
                </Button>
              </Link>
              <Link to={createPageUrl("Auth?mode=signup")}>
                <Button className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8"> {/* Added p-8 padding here */}
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Find the Perfect Plan
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Start for free, then scale as you grow. Our plans are designed to fit your needs, whether you're a startup or a large enterprise in the Marshall Islands.
          </p>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-12">
          <Label htmlFor="billing-cycle" className="text-lg font-medium">Monthly</Label>
          <Switch
            id="billing-cycle"
            checked={billingCycle === 'annually'}
            onCheckedChange={(checked) => setBillingCycle(checked ? 'annually' : 'monthly')}
            className="data-[state=checked]:bg-purple-600"
          />
          <Label htmlFor="billing-cycle" className="text-lg font-medium flex items-center">
            Annually
            <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Save 20%</Badge>
          </Label>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {pricingTiers[billingCycle].map((tier) => (
            <Card
              key={tier.name}
              className={`bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg rounded-2xl transition-all duration-300 ${
                tier.isPopular ? 'border-2 border-purple-500 shadow-2xl scale-105' : ''
              }`}
            >
              <CardHeader className="p-8">
                {tier.isPopular && (
                  <Badge className="absolute -top-3 right-8 bg-gradient-to-r from-purple-500 to-orange-500 text-white">
                    Most Popular
                  </Badge>
                )}
                <CardTitle className="text-2xl font-bold mb-2">{tier.name}</CardTitle>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-extrabold">{tier.price}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">{tier.period}</span>
                </div>
                <CardDescription className="text-gray-600 dark:text-gray-400 h-12">{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleSubscription(tier)}
                  className={`w-full text-lg font-semibold py-6 ${
                    tier.isPopular
                      ? 'bg-gradient-to-r from-purple-600 to-orange-600 text-white'
                      : 'bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-slate-600'
                  }`}
                >
                  {tier.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enterprise Plan */}
        <Card className="mt-12 bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg rounded-2xl">
          <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl font-bold">Enterprise & Government</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Custom solutions for large organizations, government agencies, and unique requirements in the Marshall Islands.
              </p>
            </div>
            <Button
              variant="outline"
              className="border-purple-500 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400"
            >
              Contact Sales
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Pricing;
