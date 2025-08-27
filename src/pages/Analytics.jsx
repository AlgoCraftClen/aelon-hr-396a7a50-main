import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Briefcase, FileText, TrendingUp, Download, Building, Calendar, Star } from 'lucide-react';

// Mock data - replace with API calls to entities
const employeeData = [
  { name: 'Finance', count: 8 },
  { name: 'IT', count: 12 },
  { name: 'Operations', count: 25 },
  { name: 'HR', count: 5 },
  { name: 'Marketing', count: 10 },
];

const leaveData = [
  { name: 'Annual', value: 40 },
  { name: 'Sick', value: 30 },
  { name: 'Cultural', value: 20 },
  { name: 'Bereavement', value: 10 },
];

const turnoverData = [
  { month: 'Jan', hired: 5, left: 2 },
  { month: 'Feb', hired: 3, left: 1 },
  { month: 'Mar', hired: 6, left: 3 },
  { month: 'Apr', hired: 4, left: 1 },
  { month: 'May', hired: 7, left: 2 },
  { month: 'Jun', hired: 5, left: 4 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

const AnalyticsPage = () => {
  // In a real app, you would use useEffect to fetch data from your entities
  // For example:
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const employees = await Employee.list();
  //     // ... process data for charts
  //   }
  //   fetchData();
  // }, [])

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
            HR Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Data-driven insights into your workforce
          </p>
        </div>
        <button className="bg-gradient-to-r from-purple-600 to-orange-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Reports
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">58</div>
            <p className="text-xs text-muted-foreground">+3 since last month</p>
          </CardContent>
        </Card>
        {/* ... more stat cards ... */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Building className="w-5 h-5 text-purple-500" />Employee Distribution by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={employeeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Employees" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5 text-orange-500" />Leave Type Breakdown (YTD)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={leaveData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label>
                  {leaveData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-500" />Hiring & Attrition Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={turnoverData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="hired" stackId="a" fill="#82ca9d" name="New Hires" />
                <Bar dataKey="left" stackId="a" fill="#ff8042" name="Departures" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;