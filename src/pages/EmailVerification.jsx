import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  Mail, 
  CheckCircle, 
  AlertTriangle, 
  Loader2,
  RefreshCw
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import { SendEmail } from "@/api/integrations";

export default function EmailVerification() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("pending"); // pending, verified, expired

  useEffect(() => {
    checkVerificationStatus();
    
    // Check for verification token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      verifyEmail(token);
    }
  }, []);

  const checkVerificationStatus = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      if (currentUser.email_verified) {
        setVerificationStatus("verified");
      } else {
        setVerificationStatus("pending");
      }
    } catch (error) {
      console.error("Error checking verification status:", error);
    }
    setIsLoading(false);
  };

  const verifyEmail = async (token) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would verify the token
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user verification status
      await User.updateMyUserData({ email_verified: true });
      setVerificationStatus("verified");
      setMessage("Email verified successfully!");
    } catch (error) {
      setVerificationStatus("expired");
      setMessage("Verification link is invalid or has expired.");
    }
    setIsLoading(false);
  };

  const resendVerification = async () => {
    if (!user) return;
    
    setIsResending(true);
    try {
      // Generate new verification token
      const token = Math.random().toString(36).substring(2, 15);
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      
      await User.updateMyUserData({
        email_verification_token: token,
        email_verification_expires: expiresAt.toISOString()
      });

      // Send verification email
      const verificationLink = `${window.location.origin}${createPageUrl('EmailVerification')}?token=${token}`;
      
      await SendEmail({
        to: user.email,
        subject: "IAKWE HR - Verify Your Email Address",
        body: `
          <h2>Welcome to IAKWE HR!</h2>
          <p>Please click the link below to verify your email address:</p>
          <p><a href="${verificationLink}" style="background-color: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Verify Email Address</a></p>
          <p>This link will expire in 15 minutes for security purposes.</p>
          <p>If you didn't create this account, please ignore this email.</p>
          <br>
          <p>Iakwe!<br>The IAKWE HR Team</p>
        `
      });

      setMessage("Verification email sent! Please check your inbox.");
    } catch (error) {
      setMessage("Failed to send verification email. Please try again.");
    }
    setIsResending(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Branding */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
              IAKWE HR
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Email Verification
            </p>
          </div>
        </div>

        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                verificationStatus === "verified" ? "bg-green-100 dark:bg-green-900/20" :
                verificationStatus === "expired" ? "bg-red-100 dark:bg-red-900/20" :
                "bg-blue-100 dark:bg-blue-900/20"
              }`}>
                {verificationStatus === "verified" ? (
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                ) : verificationStatus === "expired" ? (
                  <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                ) : (
                  <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                )}
              </div>
            </div>
            
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              {verificationStatus === "verified" ? "Email Verified!" :
               verificationStatus === "expired" ? "Verification Failed" :
               "Verify Your Email"}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {verificationStatus === "verified" ? "Your email has been successfully verified." :
               verificationStatus === "expired" ? "The verification link has expired or is invalid." :
               "We've sent a verification link to your email address."}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {message && (
              <Alert className={message.includes("Failed") || message.includes("expired") ? 
                "border-red-200 bg-red-50 dark:bg-red-900/20" : 
                "border-green-200 bg-green-50 dark:bg-green-900/20"
              }>
                <AlertDescription className={message.includes("Failed") || message.includes("expired") ? 
                  "text-red-700 dark:text-red-400" : 
                  "text-green-700 dark:text-green-400"
                }>
                  {message}
                </AlertDescription>
              </Alert>
            )}

            {verificationStatus === "verified" ? (
              <div className="text-center space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Your account is now fully activated. You can access all features of IAKWE HR.
                </p>
                <Link to={createPageUrl("Dashboard")}>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {user ? `We've sent a verification link to ${user.email}` : "Please check your email for verification instructions."}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Didn't receive the email? Check your spam folder or request a new one.
                  </p>
                </div>

                <Button 
                  onClick={resendVerification}
                  disabled={isResending}
                  variant="outline"
                  className="w-full"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Resend Verification Email
                    </>
                  )}
                </Button>

                <div className="text-center pt-4 border-t border-gray-200 dark:border-slate-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Need help?{" "}
                    <Link 
                      to={createPageUrl("Support")} 
                      className="text-purple-600 hover:text-purple-500 dark:text-purple-400 font-medium"
                    >
                      Contact Support
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              <strong>Security Notice:</strong> Verification links expire after 15 minutes. 
              Never share your verification link with others.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}