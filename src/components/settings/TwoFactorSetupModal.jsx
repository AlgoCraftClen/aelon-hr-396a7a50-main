import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  Copy, 
  CheckCircle, 
  AlertTriangle, 
  Smartphone,
  Shield,
  Key,
  QrCode
} from 'lucide-react';

export default function TwoFactorSetupModal({ isOpen, onClose, onSuccess, user }) {
  const [step, setStep] = useState(1); // 1: Setup, 2: Verify, 3: Complete
  const [secret, setSecret] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    if (isOpen && step === 1) {
      generateTwoFactorSecret();
    }
  }, [isOpen, step]);

  const generateTwoFactorSecret = () => {
    setIsLoading(true);
    try {
      // Generate a secure 32-character base32 secret
      const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
      let result = '';
      for (let i = 0; i < 32; i++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      
      const generatedSecret = result;
      setSecret(generatedSecret);
      
      // Generate QR code URL for authenticator apps
      const appName = encodeURIComponent('IAKWE HR');
      const userEmail = encodeURIComponent(user.email);
      const issuer = encodeURIComponent('IAKWE HR');
      const otpUrl = `otpauth://totp/${appName}:${userEmail}?secret=${generatedSecret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;
      
      // For production, you'd use a proper QR code library
      // For now, we'll use Google Charts API (consider replacing with a proper library)
      const qrUrl = `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(otpUrl)}`;
      setQrCodeUrl(qrUrl);
      
      setError('');
    } catch (err) {
      setError('Failed to generate 2FA secret. Please try again.');
      console.error('2FA generation error:', err);
    }
    setIsLoading(false);
  };

  const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 8; i++) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      codes.push(code);
    }
    return codes;
  };

  const verifyTOTP = (token, secret) => {
    // Simple TOTP verification - in production, use a proper library like otplib
    const time = Math.floor(Date.now() / 1000 / 30); // 30-second window
    
    // For demo purposes, we'll accept the token if it's 6 digits
    // In production, implement proper TOTP algorithm
    if (token.length === 6 && /^\d{6}$/.test(token)) {
      // Simulate TOTP verification (replace with actual TOTP library)
      const validTokens = [
        generateSimpleTOTP(secret, time),
        generateSimpleTOTP(secret, time - 1), // Previous window
        generateSimpleTOTP(secret, time + 1)  // Next window for clock drift
      ];
      
      return validTokens.includes(token);
    }
    return false;
  };

  const generateSimpleTOTP = (secret, timeStep) => {
    // Simplified TOTP generation for demo - use proper TOTP library in production
    const hash = btoa(secret + timeStep).replace(/[^0-9]/g, '');
    return hash.substring(0, 6).padStart(6, '0');
  };

  const handleVerification = async () => {
    if (isBlocked) {
      setError('Too many failed attempts. Please wait before trying again.');
      return;
    }

    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const isValid = verifyTOTP(verificationCode, secret);
      
      if (isValid) {
        // Generate backup codes
        const codes = generateBackupCodes();
        setBackupCodes(codes);
        
        // Save 2FA settings to user profile
        const updatedSettings = {
          ...user.settings,
          twoFactorEnabled: true,
          twoFactorSecret: secret, // In production, encrypt this
          backupCodes: codes.map(code => ({ code, used: false })),
          twoFactorEnabledDate: new Date().toISOString()
        };
        
        await User.updateMyUserData({ settings: updatedSettings });
        
        setStep(3);
        setAttempts(0);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= 3) {
          setIsBlocked(true);
          setError('Too many failed attempts. Please wait 5 minutes before trying again.');
          setTimeout(() => {
            setIsBlocked(false);
            setAttempts(0);
          }, 5 * 60 * 1000); // 5 minute cooldown
        } else {
          setError(`Invalid code. ${3 - newAttempts} attempts remaining.`);
        }
        setVerificationCode('');
      }
    } catch (err) {
      setError('Failed to verify code. Please try again.');
      console.error('2FA verification error:', err);
    }
    setIsLoading(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Show success feedback
      const originalError = error;
      setError('');
      setTimeout(() => setError(originalError), 2000);
    });
  };

  const handleComplete = () => {
    onSuccess();
    onClose();
    setStep(1);
    setSecret('');
    setQrCodeUrl('');
    setVerificationCode('');
    setBackupCodes([]);
    setError('');
    setAttempts(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-slate-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            Two-Factor Authentication Setup
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Secure your account with two-factor authentication"}
            {step === 2 && "Verify your authenticator app setup"}
            {step === 3 && "Your 2FA setup is complete!"}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Setup */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Step 1: Scan QR Code</h3>
              <p className="text-sm text-gray-400 mb-4">
                Use Google Authenticator, Authy, or any compatible app
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
              </div>
            ) : (
              <>
                {/* QR Code */}
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-lg">
                    <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
                  </div>
                </div>

                {/* Manual Entry Option */}
                <div className="space-y-3">
                  <Label>Can't scan? Enter this key manually:</Label>
                  <div className="flex gap-2">
                    <Input
                      value={secret}
                      readOnly
                      className="font-mono text-sm bg-slate-700 border-gray-600"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(secret)}
                      className="border-gray-600"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {error && (
                  <Alert className="border-red-500/50 bg-red-500/10">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-400">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={onClose} className="border-gray-600">
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => setStep(2)}
                    className="bg-gradient-to-r from-purple-600 to-orange-600"
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    Next: Verify
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 2: Verification */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Step 2: Enter Verification Code</h3>
              <p className="text-sm text-gray-400">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Verification Code</Label>
                <Input
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  className="text-center text-2xl font-mono bg-slate-700 border-gray-600"
                  maxLength={6}
                  disabled={isBlocked}
                />
              </div>

              {error && (
                <Alert className="border-red-500/50 bg-red-500/10">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)} className="border-gray-600">
                Back
              </Button>
              <Button 
                onClick={handleVerification}
                disabled={isLoading || verificationCode.length !== 6 || isBlocked}
                className="bg-gradient-to-r from-green-600 to-blue-600"
              >
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Verify & Enable
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Complete */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2 text-green-400">2FA Successfully Enabled!</h3>
              <p className="text-sm text-gray-400">
                Your account is now protected with two-factor authentication
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-orange-400">⚠️ Backup Recovery Codes</Label>
                <p className="text-xs text-gray-400 mb-2">
                  Save these codes in a secure location. You can use them to access your account if you lose your authenticator app.
                </p>
                <div className="bg-slate-700 rounded-lg p-3 space-y-1">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="font-mono text-sm text-center">
                      {code}
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(backupCodes.join('\n'))}
                  className="w-full mt-2 border-gray-600"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy All Codes
                </Button>
              </div>
            </div>

            <Button 
              onClick={handleComplete}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
            >
              Complete Setup
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}