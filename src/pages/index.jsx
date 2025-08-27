import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import EmployeeDirectory from "./EmployeeDirectory";

import Onboarding from "./Onboarding";

import TrainingCenter from "./TrainingCenter";

import LeaveManagement from "./LeaveManagement";

import PerformanceReviews from "./PerformanceReviews";

import Settings from "./Settings";

import Compliance from "./Compliance";

import Support from "./Support";

import Pricing from "./Pricing";

import ForgotPassword from "./ForgotPassword";

import EmailVerification from "./EmailVerification";

import TwoFactorSetup from "./TwoFactorSetup";

import Analytics from "./Analytics";

import Recruitment from "./Recruitment";

import Glossary from "./Glossary";

import Welcome from "./Welcome";

import AdminChat from "./AdminChat";

import Auth from "./Auth";

import PrivacySecurity from "./PrivacySecurity";

import EmployeeLifecycle from "./EmployeeLifecycle";

import AuditLogs from "./AuditLogs";

import MyHRPortal from "./MyHRPortal";

import FeedbackCenter from "./FeedbackCenter";

import SystemAudit from "./SystemAudit";

import GuestDashboard from "./GuestDashboard";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    EmployeeDirectory: EmployeeDirectory,
    
    Onboarding: Onboarding,
    
    TrainingCenter: TrainingCenter,
    
    LeaveManagement: LeaveManagement,
    
    PerformanceReviews: PerformanceReviews,
    
    Settings: Settings,
    
    Compliance: Compliance,
    
    Support: Support,
    
    Pricing: Pricing,
    
    ForgotPassword: ForgotPassword,
    
    EmailVerification: EmailVerification,
    
    TwoFactorSetup: TwoFactorSetup,
    
    Analytics: Analytics,
    
    Recruitment: Recruitment,
    
    Glossary: Glossary,
    
    Welcome: Welcome,
    
    AdminChat: AdminChat,
    
    Auth: Auth,
    
    PrivacySecurity: PrivacySecurity,
    
    EmployeeLifecycle: EmployeeLifecycle,
    
    AuditLogs: AuditLogs,
    
    MyHRPortal: MyHRPortal,
    
    FeedbackCenter: FeedbackCenter,
    
    SystemAudit: SystemAudit,
    
    GuestDashboard: GuestDashboard,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/EmployeeDirectory" element={<EmployeeDirectory />} />
                
                <Route path="/Onboarding" element={<Onboarding />} />
                
                <Route path="/TrainingCenter" element={<TrainingCenter />} />
                
                <Route path="/LeaveManagement" element={<LeaveManagement />} />
                
                <Route path="/PerformanceReviews" element={<PerformanceReviews />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/Compliance" element={<Compliance />} />
                
                <Route path="/Support" element={<Support />} />
                
                <Route path="/Pricing" element={<Pricing />} />
                
                <Route path="/ForgotPassword" element={<ForgotPassword />} />
                
                <Route path="/EmailVerification" element={<EmailVerification />} />
                
                <Route path="/TwoFactorSetup" element={<TwoFactorSetup />} />
                
                <Route path="/Analytics" element={<Analytics />} />
                
                <Route path="/Recruitment" element={<Recruitment />} />
                
                <Route path="/Glossary" element={<Glossary />} />
                
                <Route path="/Welcome" element={<Welcome />} />
                
                <Route path="/AdminChat" element={<AdminChat />} />
                
                <Route path="/Auth" element={<Auth />} />
                
                <Route path="/PrivacySecurity" element={<PrivacySecurity />} />
                
                <Route path="/EmployeeLifecycle" element={<EmployeeLifecycle />} />
                
                <Route path="/AuditLogs" element={<AuditLogs />} />
                
                <Route path="/MyHRPortal" element={<MyHRPortal />} />
                
                <Route path="/FeedbackCenter" element={<FeedbackCenter />} />
                
                <Route path="/SystemAudit" element={<SystemAudit />} />
                
                <Route path="/GuestDashboard" element={<GuestDashboard />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}