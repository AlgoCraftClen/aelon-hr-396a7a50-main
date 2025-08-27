import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { InvokeLLM } from '@/api/integrations';
import { 
  Bot, 
  Send, 
  X, 
  Minimize2,
  MessageCircle,
  Sparkles,
  Users,
  Calendar,
  FileText,
  GraduationCap,
  Shield,
  User
} from 'lucide-react';
import { useGuestMode } from '../auth/GuestModeProvider';
import { GuestActionButton } from '../auth/GuestActionBlocker';

export default function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Iakwe! I\'m Aelōn, your AI HR assistant for the Marshall Islands. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isGuestMode } = useGuestMode();
  const messagesEndRef = useRef(null);

  const quickActions = [
    { icon: Users, label: 'Employee Help', query: 'How do I manage employee records in the Marshall Islands?' },
    { icon: Calendar, label: 'Cultural Leave', query: 'What are the cultural leave policies for Marshall Islands employees?' },
    { icon: FileText, label: 'Policy Help', query: 'Help me create an HR policy that respects Marshall Islands culture' },
    { icon: GraduationCap, label: 'Training', query: 'What training should I provide for new employees in the Marshall Islands?' },
    { icon: Shield, label: 'Compliance', query: 'What are the labor law requirements in the Marshall Islands?' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await InvokeLLM({
        prompt: `You are Aelōn, an AI HR assistant specifically designed for the Marshall Islands. You help with HR management, cultural considerations, labor laws, and workplace practices relevant to the Marshall Islands context.

User query: ${messageText}

Provide helpful, culturally sensitive advice that considers:
1. Marshall Islands labor laws and regulations (RMI Minimum Wage Act, Non-Resident Workers Act)
2. Local cultural practices and customs (Kemem, mourning periods, Irooj obligations)
3. Traditional values and social structures
4. Practical HR management in the island context
5. Work-life balance considerations for island communities

Be friendly, knowledgeable, and respectful of Marshallese culture. Use "Iakwe" (hello) occasionally and reference local context when appropriate. If you don't know something specific about Marshall Islands culture or laws, acknowledge that and suggest consulting with local experts.`,
        add_context_from_internet: true
      });

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Assistant error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Iakwe! I\'m sorry, I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleQuickAction = (query) => {
    sendMessage(query);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Don't render if in guest mode
  if (isGuestMode) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <GuestActionButton
          actionName="AI Assistant (Aelōn)"
          onClick={() => {}}
        >
          <Button
            size="icon"
            className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border-0"
          >
            <Bot className="w-6 h-6 text-white" />
          </Button>
        </GuestActionButton>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 relative border-0"
        >
          <Bot className="w-6 h-6 text-white" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
        </Button>
      </div>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          size="icon"
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 shadow-lg border-0"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-96 h-[500px] bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-2xl border border-gray-200 dark:border-slate-700 flex flex-col overflow-hidden">
        <CardHeader className="border-b border-gray-200 dark:border-slate-700 p-4 bg-white/80 dark:bg-slate-800/80 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center shrink-0">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-lg text-gray-900 dark:text-white truncate">Aelōn AI</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">HR Assistant</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600 dark:text-green-400">Online</span>
              </div>
            </div>
            <div className="flex gap-1 shrink-0 ml-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(true)}
                className="w-8 h-8 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'ai' && (
                    <Avatar className="w-8 h-8 shrink-0 mt-1">
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-orange-500 text-white">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`flex flex-col max-w-[85%] ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`p-3 rounded-lg break-words ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white rounded-br-sm'
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white rounded-bl-sm'
                      }`}
                      style={{
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        hyphens: 'auto',
                        maxWidth: '100%'
                      }}
                    >
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  
                  {message.type === 'user' && (
                    <Avatar className="w-8 h-8 shrink-0 mt-1">
                      <AvatarFallback className="bg-blue-500 text-white">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="w-8 h-8 shrink-0 mt-1">
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-orange-500 text-white">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col max-w-[85%]">
                    <div className="p-3 rounded-lg bg-gray-100 dark:bg-slate-700 rounded-bl-sm">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 animate-pulse text-purple-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Aelōn is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 flex-shrink-0">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">Quick help with:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.slice(0, 4).map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action.query)}
                    className="h-auto p-2 text-xs justify-start bg-white/70 dark:bg-slate-700/70 hover:bg-white dark:hover:bg-slate-700 border-gray-200 dark:border-slate-600 text-left"
                  >
                    <action.icon className="w-3 h-3 mr-1 shrink-0" />
                    <span className="truncate text-left">{action.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 flex-shrink-0">
            <div className="flex gap-2">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask Aelōn anything about HR..."
                className="flex-1 min-h-[40px] max-h-[80px] resize-none bg-white/70 dark:bg-slate-700/70 border-gray-200 dark:border-slate-600 text-sm"
                disabled={isLoading}
                rows={1}
                style={{
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word'
                }}
              />
              <Button
                onClick={() => sendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                size="icon"
                className="w-10 h-10 bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}