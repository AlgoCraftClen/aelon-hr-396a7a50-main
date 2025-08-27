import React from 'react';
import { useGuestMode } from './GuestModeProvider';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Eye, UserPlus } from 'lucide-react';

export default function GuestModeWrapper({ children }) {
  const { isGuestMode } = useGuestMode();
  const navigate = useNavigate();

  return (
    <div className="relative">
      {isGuestMode && (
        <div className="sticky top-0 z-40 bg-gradient-to-r from-purple-600 to-orange-600 text-white p-3 text-center shadow-lg">
          <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              <span className="font-semibold">Guest Mode: You have read-only access.</span>
            </div>
            <Button 
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white h-auto py-1 px-3"
              onClick={() => navigate(createPageUrl('Auth?mode=signup'))}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Sign Up for Full Access
            </Button>
          </div>
        </div>
      )}
      <main>{children}</main>
    </div>
  );
}