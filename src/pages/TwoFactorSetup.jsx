import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Shield, 
  Smartphone, 
  Key, 
  CheckCircle, 
  AlertTriangle, 
  Loader2,
  Copy,
  Download
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";

export default function TwoFactorSetup() {
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1); // 1: Setup, 2: Verify, 3: Backup Codes, 4: Complete
  const [qrCode, setQrCode] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUserData();
    generateSetup();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      // If 2FA is already enabled, redirect to settings
      if (currentUser.two_factor_enabled) {
        window.location.href = createPageUrl("Settings");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const generateSetup = () => {
    // Generate secret key (in real implementation, this would come from server)
    const secret = Math.random().toString(36).substring(2, 18).toUpperCase();
    setSecretKey(secret);
    
    // Generate QR code URL (in real implementation, use proper TOTP library)
    const appName = "IAKWE HR";
    const issuer = "IAKWE";
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/${encodeURIComponent(appName)}:${encodeURIComponent(user?.email || 'user@example.com')}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
    setQrCode(qrUrl);
  };

  const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 8; i++) {
      codes.push(Math.random().toString(36).substring(2, 8).toUpperCase());
    }
    setBackupCodes(codes);
  };

  const verifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate verification (in real implementation, verify against TOTP)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate backup codes
      generateBackupCodes();
      setStep(3);
    } catch (error) {
      setError("Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const completeTwoFactorSetup = async () => {
    setIsLoading(true);
    try {
      await User.updateMyUserData({
        two_factor_enabled: true,
        two_factor_secret: secretKey,
        two_factor_backup_codes: backupCodes
      });
      
      setStep(4);
    } catch (error) {
      setError("Failed to enable 2FA. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const downloadBackupCodes = () => {
    const content = `IAKWE HR - Two-Factor Authentication Backup Codes
Generated on: ${new Date().toLocaleDateString()}
Email: ${user?.email}

${backupCodes.map((code, index) => `${index + 1}. ${code}`).join('\n')}

Important:
- Save these codes in a safe place
- Each code can only be used once
- Use these codes if you lose access to your authenticator app
- Keep these codes secure and private`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'iakwe-hr-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Branding */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
              IAKWE HR
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Two-Factor Authentication Setup
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-2">
          {[1, 2, 3, 4].map((stepNum) => (
            <div key={stepNum} className={`w-3 h-3 rounded-full ${
              step >= stepNum ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'
            }`} />
          ))}
        </div>

        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
          {/* Step 1: Setup */}
          {step === 1 && (
            <>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                  <Smartphone className="w-6 h-6" />
                  Setup Authenticator
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Scan the QR code with your authenticator app
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Can't scan the QR code? Enter this secret key manually:
                    </p>
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-700 p-3 rounded-lg">
                      <code className="flex-1 text-sm font-mono">{secretKey}</code>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => copyToClipboard(secretKey)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Popular Authenticator Apps:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-gray-50 dark:bg-slate-700 rounded">
                      • Google Authenticator
                    </div>
                    <div className="p-2 bg-gray-50 dark:bg-slate-700 rounded">
                      • Authy
                    </div>
                    <div className="p-2 bg-gray-50 dark:bg-slate-700 rounded">
                      • Microsoft Authenticator
                    </div>
                    <div className="p-2 bg-gray-50 dark:bg-slate-700 rounded">
                      • 1Password
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => setStep(2)}
                  className="w-full bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700"
                >
                  I've Added the Account
                </Button>
              </CardContent>
            </>
          )}

          {/* Step 2: Verify */}
          {step === 2 && (
            <>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                  <Key className="w-6 h-6" />
                  Verify Code
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Enter the 6-digit code from your authenticator app
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="verificationCode">Verification Code</Label>
                  <Input
                    id="verificationCode"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="text-center text-lg tracking-widest bg-white/70 dark:bg-slate-700/70"
                    maxLength={6}
                  />
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={verifyCode}
                    disabled={isLoading || verificationCode.length !== 6}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify"
                    )}
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 3: Backup Codes */}
          {step === 3 && (
            <>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Save Backup Codes
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Store these codes safely - you'll need them if you lose your device
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Each backup code can only be used once. Save them in a secure location.
                  </AlertDescription>
                </Alert>

                <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                    {backupCodes.map((code, index) => (
                      <div key={index} className="flex items-center justify-between bg-white dark:bg-slate-600 p-2 rounded">
                        <span>{index + 1}. {code}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={downloadBackupCodes}
                    className="flex-1"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button 
                    onClick={() => copyToClipboard(backupCodes.join('\n'))}
                    variant="outline"
                    className="flex-1"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy All
                  </Button>
                </div>

                <Button 
                  onClick={completeTwoFactorSetup}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enabling 2FA...
                    </>
                  ) : (
                    "Complete Setup"
                  )}
                </Button>
              </CardContent>
            </>
          )}

          {/* Step 4: Complete */}
          {step === 4 && (
            <>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  2FA Enabled!
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Your account is now protected with two-factor authentication
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    Two-Factor Authentication Active
                  </Badge>
                  
                  <p className="text-gray-600 dark:text-gray-400">
                    From now on, you'll need to enter a code from your authenticator app when signing in.
                  </p>
                </div>

                <Link to={createPageUrl("Dashboard")}>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700">
                    Go to Dashboard
                  </Button>
                </Link>
                
                <Link to={createPageUrl("Settings")}>
                  <Button variant="outline" className="w-full">
                    Manage Security Settings
                  </Button>
                </Link>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}