import React, { useState } from 'react';
import { useGuestMode } from './GuestModeProvider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Lock, UserPlus, ArrowRight } from 'lucide-react';

export function GuestActionButton({ children, actionName = "This action" }) {
  const { isGuestMode } = useGuestMode();
  const [showPrompt, setShowPrompt] = useState(false);
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (isGuestMode) {
      e.preventDefault();
      e.stopPropagation();
      setShowPrompt(true);
    } else if (children.props.onClick) {
      children.props.onClick(e);
    }
  };
  
  const handleSignUp = () => {
    setShowPrompt(false);
    navigate(createPageUrl('Auth?mode=signup'));
  };

  const clonedChild = React.cloneElement(children, {
    onClick: handleClick,
  });

  return (
    <>
      {clonedChild}
      
      <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
        <DialogContent className="max-w-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-0 shadow-2xl">
          <DialogHeader className="text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Full Access Required</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
              {actionName} is a feature for registered users. Create a free account to unlock all features and manage your HR operations.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-4">
            <Button
              onClick={handleSignUp}
              className="w-full bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 shadow-lg hover:scale-105 transition-all duration-200 text-lg py-6"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Sign Up For Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" onClick={() => setShowPrompt(false)}>
              Continue Exploring
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}