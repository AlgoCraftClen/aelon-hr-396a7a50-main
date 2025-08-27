
import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, X, FileText, UserCheck, AlertTriangle, BookOpen, Lightbulb, Send, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';
import { InvokeLLM } from "@/api/integrations";

import { Policy } from "@/api/entities";
import { PolicyAcknowledgment } from "@/api/entities";
import { Employee } from "@/api/entities";
import { legalHubData } from "@/components/legalHubData";
import { AILesson } from "@/api/entities";

export default function AIAssistantModal({ isOpen, onClose }) {
  const [policies, setPolicies] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [acknowledgments, setAcknowledgments] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Chat state
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      loadData();
      if (messages.length === 0) {
        setMessages([
          { sender: 'ai', text: "Iakwe! I am Aelōn, your HR AI Assistant for the Marshall Islands. I can learn from our conversation - feel free to teach me Marshallese words, cultural practices, or company-specific information as we chat. How can I help you today?" }
        ]);
      }
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      // Find the viewport element of the ScrollArea component
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  }, [messages]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [policyData, employeeData, ackData, lessonData] = await Promise.all([
        Policy.list(),
        Employee.list(),
        PolicyAcknowledgment.list(),
        AILesson.list(),
      ]);
      setPolicies(policyData);
      setEmployees(employeeData);
      setAcknowledgments(ackData);
      setLessons(lessonData);
    } catch (error) {
      console.error("Error loading AI assistant data:", error);
    }
    setIsLoading(false);
  };
  
  const saveNewLearning = async (content, topic = "General Knowledge") => {
    try {
      await AILesson.create({
        title: topic,
        content: content,
        category: topic
      });
      await loadData(); // Reload lessons to include the new one
    } catch (error) {
      console.error("Error saving new learning:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newUserMessage = { sender: 'user', text: userInput };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    const currentInput = userInput;
    setUserInput("");
    setIsReplying(true);

    try {
      const lessonContext = lessons.length > 0 
        ? `Here are some lessons you have been taught by your administrator. Use this knowledge to inform your answers: \n\n${lessons.map(l => `Lesson on "${l.title}": ${l.content}`).join('\n\n')}`
        : "";

      // Get current date in Marshall Islands timezone
      const currentDate = new Date();
      const mjTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Pacific/Majuro',
        year: 'numeric',
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
      }).format(currentDate);

      const currentYear = currentDate.getFullYear();

      // Marshall Islands public holidays for current year
      const holidays2024 = [
        { date: `${currentYear}-01-01`, name: "New Year's Day" },
        { date: `${currentYear}-03-01`, name: "Nuclear Victims Remembrance Day" },
        { date: `${currentYear}-05-01`, name: "Constitution Day" },
        { date: `${currentYear}-07-01`, name: "Fisherman's Day" },
        { date: `${currentYear}-09-27`, name: "Gospel Day" }, // Approximate - last Friday of September
        { date: `${currentYear}-10-21`, name: "Independence Day" },
        { date: `${currentYear}-12-25`, name: "Christmas Day" }
      ];

      const nextYear = currentYear + 1;
      const holidays2025 = [
        { date: `${nextYear}-01-01`, name: "New Year's Day" },
        { date: `${nextYear}-03-01`, name: "Nuclear Victims Remembrance Day" },
        { date: `${nextYear}-05-01`, name: "Constitution Day" },
        { date: `${nextYear}-07-01`, name: "Fisherman's Day" },
        { date: `${nextYear}-09-26`, name: "Gospel Day" }, // Approximate - last Friday of September
        { date: `${nextYear}-10-21`, name: "Independence Day" },
        { date: `${nextYear}-12-25`, name: "Christmas Day" }
      ];

      const allHolidays = [...holidays2024, ...holidays2025];
      
      // Find next upcoming holiday
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const upcomingHolidays = allHolidays
        .filter(h => h.date >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3);

      const prompt = `
        You are Aelōn, the built-in AI agent for 'IAKWE HR', a Human Resources web application specifically designed for companies operating in the Marshall Islands. Your name means 'our islands' in Marshallese.

        CURRENT DATE & TIME CONTEXT:
        Today is: ${mjTime}
        Current date in Majuro timezone: ${mjTime}
        You are operating in Pacific/Majuro timezone.

        UPCOMING MARSHALL ISLANDS PUBLIC HOLIDAYS:
        ${upcomingHolidays.map(h => `- ${h.name}: ${new Date(h.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`).join('\n')}

        IMPORTANT LEARNING CAPABILITY:
        You can learn from conversations! When users teach you something new (like Marshallese words, cultural practices, company processes, etc.), you should:
        1. Acknowledge the new information (e.g., "Thank you for teaching me that!", "I've noted this for future reference.")
        2. Indicate that you're learning it for future reference (e.g., "I will remember this.", "This will help me in future interactions.")
        3. Ask follow-up questions if appropriate to deepen understanding or confirm application.

        Your Primary Purpose:
        1. Assist HR administrators and employees with questions about company policies, Marshallese labor laws, and cultural practices.
        2. Learn and remember information shared during conversations.
        3. Help create, manage, and enforce policies and training in a culturally sensitive manner.
        4. Do NOT give legal advice, but provide educated suggestions based on provided context.

        Your Knowledge Base includes:
        - RMI Labor Laws and Regulations (e.g., Minimum Wage Act, Non-Resident Workers Act).
        - Marshallese cultural practices like Kemem (first birthdays), mourning periods, and Irooj (chiefly) obligations.
        - All company policies and training materials uploaded to this system.
        - Previous lessons learned from conversations.
        
        ${lessonContext}

        When responding, be:
        - Helpful and professional.
        - Culturally aware and respectful.
        - Eager to learn new information.
        - Clear and concise.
        - Use Markdown for formatting if needed (e.g., lists, bold text).
        - When learning something new, express gratitude and confirm understanding.
        - Always use the current date context provided above for any date-related questions.
        
        User's message: "${currentInput}"

        If the user is teaching you something new (Marshallese language, cultural practice, company info, etc.), respond with enthusiasm about learning it and confirm your understanding. If it's a question, answer based on your knowledge and ask if there's anything specific they'd like to teach you about the topic.
      `;

      const response = await InvokeLLM({ prompt });
      
      // Check if the user is teaching something new and save it as a lesson
      const teachingIndicators = [
        'means', 'is called', 'in marshallese', 'the word for', 'translates to', 
        'cultural practice', 'tradition', 'custom', 'policy', 'procedure',
        'let me teach you', 'you should know', 'remember that', 'here\'s how we',
        'my company\'s policy is', 'a local term is'
      ];
      
      const isTeaching = teachingIndicators.some(indicator => 
        currentInput.toLowerCase().includes(indicator)
      ) || currentInput.toLowerCase().includes('marshallese word for');

      if (isTeaching) {
        // Extract topic if possible
        let topic = "General Knowledge";
        if (currentInput.toLowerCase().includes('marshallese')) {
          topic = "Marshallese Language";
        } else if (currentInput.toLowerCase().includes('cultural') || currentInput.toLowerCase().includes('tradition') || currentInput.toLowerCase().includes('custom')) {
          topic = "Cultural Practice";
        } else if (currentInput.toLowerCase().includes('policy') || currentInput.toLowerCase().includes('procedure') || currentInput.toLowerCase().includes('company rule')) {
          topic = "Company Policy/Procedure";
        }
        
        await saveNewLearning(currentInput, topic);
      }

      setMessages((prevMessages) => [...prevMessages, { sender: 'ai', text: response }]);
    } catch (error) {
      console.error("Error invoking LLM:", error);
      setMessages((prevMessages) => [...prevMessages, { sender: 'ai', text: "I'm sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsReplying(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const getOutdatedPolicies = () => {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    return policies.filter(p => new Date(p.review_date) < oneYearAgo);
  };

  const getComplianceGaps = () => {
    const gaps = [];
    const activePolicies = policies.filter(p => p.status === 'Active' && p.requires_acknowledgment);
    
    activePolicies.forEach(policy => {
      employees.forEach(employee => {
        const hasAcknowledged = acknowledgments.some(
          ack => ack.policy_id === policy.id && ack.employee_id === employee.id && ack.status === 'Acknowledged'
        );
        if (!hasAcknowledged) {
          gaps.push({ employee, policy });
        }
      });
    });
    return gaps.slice(0, 5); // Limit for display
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-0">
        <DialogHeader className="border-b border-gray-200 dark:border-slate-700 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Aelōn AI Assistant
                </DialogTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Learning Marshallese & Marshall Islands HR practices
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-6">
          <Tabs defaultValue="chat" className="h-full flex flex-col">
            <TabsList className="bg-gray-100 dark:bg-slate-700 mb-4">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <Bot className="w-4 h-4" /> Chat & Learn
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" /> Insights
              </TabsTrigger>
              <TabsTrigger value="compliance" className="flex items-center gap-2">
                <UserCheck className="w-4 h-4" /> Compliance
              </TabsTrigger>
              <TabsTrigger value="legal" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Legal Hub
              </TabsTrigger>
              <TabsTrigger value="memory" className="flex items-center gap-2">
                <FileText className="w-4 h-4" /> My Learning
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="flex-1 flex flex-col h-full -m-6 p-0">
              <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 ${
                        message.sender === 'user' ? 'justify-end' : ''
                      }`}
                    >
                      {message.sender === 'ai' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-orange-500 flex items-center justify-center shrink-0 shadow-md">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div
                        className={`p-4 rounded-2xl max-w-lg prose prose-sm dark:prose-invert prose-p:my-0 prose-ul:my-2 prose-ol:my-2 ${
                          message.sender === 'user'
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white rounded-bl-none'
                        }`}
                      >
                        <ReactMarkdown>{message.text}</ReactMarkdown>
                      </div>
                      {message.sender === 'user' && (
                         <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isReplying && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-orange-500 flex items-center justify-center shrink-0 shadow-md">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="p-4 rounded-2xl bg-gray-100 dark:bg-slate-700 rounded-bl-none">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-75" />
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-150" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <div className="p-4 border-t border-gray-200 dark:border-slate-700">
                <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                  <div className="flex-1">
                    <Textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Chat with me! Teach me Marshallese or ask about HR policies... (Press Enter to send, Shift+Enter for new line)"
                      className="min-h-[60px] max-h-[120px] resize-none bg-white/70 dark:bg-slate-700/70 border-gray-200 dark:border-slate-600"
                      disabled={isReplying}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isReplying || !userInput.trim()} 
                    size="icon"
                    className="h-[60px] w-[60px] flex-shrink-0"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </form>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Press Enter to send • Shift+Enter for new line
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="insights" className="flex-1 overflow-auto">
              <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Policy & Document Insights</h3>
              {getOutdatedPolicies().length > 0 ? (
                <div className="space-y-3">
                  {getOutdatedPolicies().map(policy => (
                    <div key={policy.id} className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 mt-1" />
                        <div>
                          <p className="font-medium text-yellow-800 dark:text-yellow-300">Policy Review Needed</p>
                          <p className="text-sm text-yellow-700 dark:text-yellow-400">
                            The policy <span className="font-semibold">"{policy.title}"</span> is over a year old. Consider reviewing it for compliance with current laws and practices.
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">All policies appear to be up-to-date.</p>
              )}
            </TabsContent>

            <TabsContent value="compliance" className="flex-1 overflow-auto">
              <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Acknowledgment Gaps</h3>
              {getComplianceGaps().length > 0 ? (
                 <div className="space-y-3">
                  {getComplianceGaps().map(({ employee, policy }, index) => (
                    <div key={index} className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <div className="flex items-start gap-3">
                        <UserCheck className="w-5 h-5 text-red-500 mt-1" />
                        <div>
                           <p className="font-medium text-red-800 dark:text-red-300">Acknowledgment Pending</p>
                           <p className="text-sm text-red-700 dark:text-red-400">
                             <span className="font-semibold">{employee.first_name} {employee.last_name}</span> has not yet acknowledged the <span className="font-semibold">"{policy.title}"</span> policy.
                           </p>
                        </div>
                      </div>
                    </div>
                  ))}
                 </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No outstanding policy acknowledgments found.</p>
              )}
            </TabsContent>

            <TabsContent value="legal" className="flex-1 overflow-auto space-y-8">
              <div>
                <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Legal Myths vs. Truths</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {legalHubData.mythsAndTruths.map((item, index) => (
                    <div key={index} className="p-4 rounded-lg bg-gray-50 dark:bg-slate-700/50">
                      <p className="font-semibold text-red-600 dark:text-red-400 text-sm">Myth: "{item.myth}"</p>
                      <p className="mt-2 font-semibold text-green-600 dark:text-green-400 text-sm">Truth: {item.truth}</p>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Reference: {item.reference}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Cultural Practice Guide</h3>
                <div className="space-y-4">
                  {legalHubData.culturalPractices.map((item, index) => (
                    <div key={index} className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-300">{item.name}</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">{item.description}</p>
                      <p className="mt-2 text-sm">
                        <span className="font-semibold text-blue-800 dark:text-blue-300">Accommodation:</span> <span className="text-blue-700 dark:text-blue-400">{item.accommodation}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="memory" className="flex-1 overflow-auto space-y-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">What I've Learned</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Here's everything I've learned from our conversations so far.
              </p>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {lessons.map(lesson => (
                    <div key={lesson.id} className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 border border-purple-100 dark:border-purple-800">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge variant="outline" className="shrink-0">{lesson.title}</Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(lesson.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 dark:text-gray-200">{lesson.content}</p>
                    </div>
                  ))}
                  {lessons.length === 0 && (
                    <div className="text-center py-8">
                      <Bot className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-sm text-gray-500 italic">I haven't learned anything new yet. Start teaching me!</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
