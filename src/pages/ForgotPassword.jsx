
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, ArrowLeft, CheckCircle, Key } from "lucide-react"; // Added Key

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simulate password reset request
      // In a real implementation, this would call the platform's password reset method
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSent(true);
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
    }
    setIsLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-xl border-0 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h2>
            <p className="text-gray-600 mb-6">
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Didn't receive an email? Check your spam folder or try again.
            </p>
            <div className="space-y-3">
              <Link to={createPageUrl("Auth?mode=login")}>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-orange-600">
                  Back to Login
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                className="w-full" 
                onClick={() => setSent(false)}
              >
                Try Different Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-xl border-0 shadow-2xl">
        <CardHeader className="text-center">
          {/* Logo */}
          <Link to={createPageUrl("Welcome")} className="inline-block mb-4 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">HR</span>
              </div>
              <div className="text-left">
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
                  IAKWE HR
                </h1>
                <p className="text-xs text-gray-500">Marshall Islands</p>
              </div>
            </div>
          </Link>
          
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-orange-500 rounded-2xl flex items-center justify-center mb-4">
            <Key className="w-8 h-8 text-white" /> {/* Changed Mail to Key */}
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900"> {/* Added text-gray-900 */}
            Reset Password {/* Updated title text */}
          </CardTitle>
          <CardDescription className="text-gray-600"> {/* Added text-gray-600 */}
            Enter your email address and we'll send you a link to reset your password {/* Updated description text */}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/70"
                placeholder="Enter your email address"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Reset Instructions'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to={createPageUrl("Auth?mode=login")}
              className="inline-flex items-center text-sm text-purple-600 hover:text-purple-500"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
