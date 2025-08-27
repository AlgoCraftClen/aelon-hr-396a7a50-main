
// CHANGELOG REF: /components/changelog.md - Role-based access control protected.
import React, { useState, useEffect, useRef } from "react";
import { ChatMessage } from "@/api/entities";
import { ChatChannel } from "@/api/entities";
import { User } from "@/api/entities";
import { Employee } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  Send, 
  Users, 
  Plus,
  Paperclip,
  Hash,
  Shield,
  Clock,
  CheckCircle2
} from "lucide-react";
import { format } from "date-fns";
import { UploadFile } from "@/api/integrations";

export default function AdminChat() {
  const [user, setUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [activeDirectMessage, setActiveDirectMessage] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);

  // Updated admin roles to include "Admin" (capital A)
  const adminRoles = ['Admin', 'admin', 'HR Manager', 'General Manager', 'Department Supervisor', 'HR Staff'];

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      // First, load the current user
      const currentUser = await User.me();
      if (!currentUser) {
        console.error("No user found");
        setIsLoading(false);
        return;
      }
      
      setUser(currentUser);
      
      console.log("Current user loaded:", currentUser); // Debug log
      console.log("Current user role:", currentUser.role); // Debug log
      
      // Check if user has admin permissions
      const userRole = currentUser.role || '';
      const hasAdminAccess = adminRoles.some(role => 
        userRole.toLowerCase() === role.toLowerCase() ||
        userRole.toLowerCase().includes(role.toLowerCase()) || 
        role.toLowerCase().includes(userRole.toLowerCase())
      );
      
      console.log("Has admin access:", hasAdminAccess); // Debug log
      
      if (!hasAdminAccess) {
        setHasPermission(false);
        setIsLoading(false);
        return;
      }
      
      setHasPermission(true);
      
      // Now load employees and channels
      const [employeeData, channelData] = await Promise.all([
        Employee.list(),
        ChatChannel.list()
      ]);
      
      setEmployees(employeeData);
      setChannels(channelData);
      
      // Load default channel or create one - but only after user is set
      if (channelData.length === 0) {
        await createDefaultChannels(currentUser); // Pass user explicitly
      } else {
        setActiveChannel(channelData[0]);
        await loadMessages(channelData[0].id);
      }
      
    } catch (error) {
      console.error("Error loading chat data:", error);
    }
    setIsLoading(false);
  };

  const createDefaultChannels = async (currentUser) => {
    try {
      // Ensure we have a user before creating channels
      if (!currentUser || !currentUser.id) {
        console.error("Cannot create channels: user not available");
        return;
      }

      console.log("Creating default channels for user:", currentUser.id);

      const defaultChannels = [
        { name: "General", description: "General admin discussions", type: "general" },
        { name: "HR Updates", description: "HR policy and update discussions", type: "department", department: "Human Resources" },
        { name: "Management", description: "Management team discussions", type: "private" }
      ];

      const created = await Promise.all(
        defaultChannels.map(channel => 
          ChatChannel.create({
            ...channel,
            created_by: currentUser.id,
            members: [currentUser.id]
          })
        )
      );
      
      console.log("Default channels created:", created);
      
      setChannels(created);
      if (created.length > 0) {
        setActiveChannel(created[0]);
        await loadMessages(created[0].id);
      }
    } catch (error) {
      console.error("Error creating default channels:", error);
    }
  };

  const loadMessages = async (channelId = null, receiverId = null) => {
    try {
      let messageData = [];
      if (channelId) {
        messageData = await ChatMessage.filter({ channel_id: channelId }, '-created_date');
      } else if (receiverId && user) {
        messageData = await ChatMessage.filter({
          $or: [
            { sender_id: user.id, receiver_id: receiverId },
            { sender_id: receiverId, receiver_id: user.id }
          ]
        }, '-created_date');
      }
      setMessages(messageData || []);
    } catch (error) {
      console.error("Error loading messages:", error);
      setMessages([]); // Set empty array on error
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() && !selectedFile) return;
    if (!user || !user.id) {
      console.error("Cannot send message: user not available");
      return;
    }

    try {
      let fileUrl = null;
      let fileName = null;
      let messageType = 'text';

      if (selectedFile) {
        const uploadResult = await UploadFile({ file: selectedFile });
        fileUrl = uploadResult.file_url;
        fileName = selectedFile.name;
        messageType = selectedFile.type.startsWith('image/') ? 'image' : 'file';
      }

      const messageData = {
        sender_id: user.id,
        message: messageText || `Shared ${fileName}`,
        message_type: messageType,
        ...(fileUrl && { file_url: fileUrl, file_name: fileName }),
        ...(activeChannel && { channel_id: activeChannel.id }),
        ...(activeDirectMessage && { receiver_id: activeDirectMessage })
      };

      await ChatMessage.create(messageData);
      
      setMessageText('');
      setSelectedFile(null);
      
      // Reload messages
      if (activeChannel) {
        await loadMessages(activeChannel.id);
      } else if (activeDirectMessage) {
        await loadMessages(null, activeDirectMessage);
      }
      
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading Admin Chat...</p>
        </div>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Access Debugging</h2>
            <div className="text-left space-y-2 mb-4">
              <p><strong>Your Role:</strong> {user?.role || 'Not found'}</p>
              <p><strong>User ID:</strong> {user?.id || 'Not found'}</p>
              <p><strong>Email:</strong> {user?.email || 'Not found'}</p>
              <p><strong>Required Roles:</strong></p>
              <ul className="text-sm text-gray-600 dark:text-gray-400">
                {adminRoles.map(role => (
                  <li key={role}>• {role}</li>
                ))}
              </ul>
            </div>
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              Current Role: {user?.role || 'Unknown'}
            </Badge>
            <div className="mt-4">
              <Button onClick={() => window.location.reload()} className="mr-2">
                Refresh Page
              </Button>
              <Button onClick={loadInitialData} variant="outline">
                Retry Access Check
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 min-h-screen">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
            Admin Chat
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Secure communication for administrative team - Access granted for: {user?.role}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* Sidebar - Channels and Direct Messages */}
        <Card className="lg:col-span-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-xl">
          <CardHeader className="border-b border-gray-100 dark:border-slate-700">
            <CardTitle className="text-lg">Channels & Messages</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="channels" className="h-full">
              <TabsList className="grid w-full grid-cols-2 m-4 mb-0">
                <TabsTrigger value="channels" className="text-sm">
                  <Hash className="w-4 h-4 mr-1" />
                  Channels
                </TabsTrigger>
                <TabsTrigger value="direct" className="text-sm">
                  <Users className="w-4 h-4 mr-1" />
                  Direct
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="channels" className="mt-0 p-4">
                <div className="space-y-2">
                  {channels.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Hash className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No channels available</p>
                      <Button 
                        size="sm" 
                        className="mt-2"
                        onClick={() => user && createDefaultChannels(user)}
                      >
                        Create Default Channels
                      </Button>
                    </div>
                  ) : (
                    channels.map((channel) => (
                      <button
                        key={channel.id}
                        onClick={() => {
                          setActiveChannel(channel);
                          setActiveDirectMessage(null);
                          loadMessages(channel.id);
                        }}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          activeChannel?.id === channel.id
                            ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                            : 'hover:bg-gray-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4" />
                          <span className="font-medium">{channel.name}</span>
                        </div>
                        {channel.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {channel.description}
                          </p>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="direct" className="mt-0 p-4">
                <div className="space-y-2">
                  {employees.filter(emp => emp.id !== user?.id).length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No other employees found</p>
                    </div>
                  ) : (
                    employees.filter(emp => emp.id !== user?.id).map((employee) => (
                      <button
                        key={employee.id}
                        onClick={() => {
                          setActiveDirectMessage(employee.id);
                          setActiveChannel(null);
                          loadMessages(null, employee.id);
                        }}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          activeDirectMessage === employee.id
                            ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                            : 'hover:bg-gray-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {employee.first_name?.[0]}{employee.last_name?.[0]}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{employee.first_name} {employee.last_name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{employee.position}</p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Main Chat Area */}
        <Card className="lg:col-span-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-0 shadow-xl flex flex-col">
          <CardHeader className="border-b border-gray-100 dark:border-slate-700">
            <CardTitle className="flex items-center gap-2">
              {activeChannel ? (
                <>
                  <Hash className="w-5 h-5" />
                  {activeChannel.name}
                </>
              ) : activeDirectMessage ? (
                <>
                  <Users className="w-5 h-5" />
                  {employees.find(e => e.id === activeDirectMessage)?.first_name} {employees.find(e => e.id === activeDirectMessage)?.last_name}
                </>
              ) : (
                'Select a channel or start a direct message'
              )}
            </CardTitle>
          </CardHeader>
          
          {(activeChannel || activeDirectMessage) ? (
            <>
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[400px] p-4">
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((message) => {
                        const sender = employees.find(e => e.id === message.sender_id);
                        const isOwnMessage = message.sender_id === user?.id;
                        
                        return (
                          <div
                            key={message.id}
                            className={`flex items-start gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
                          >
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0">
                              {isOwnMessage ? 'You' : `${sender?.first_name?.[0] || '?'}${sender?.last_name?.[0] || '?'}`}
                            </div>
                            <div className={`max-w-[70%] ${isOwnMessage ? 'text-right' : ''}`}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium">
                                  {isOwnMessage ? 'You' : `${sender?.first_name || 'Unknown'} ${sender?.last_name || 'User'}`}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {format(new Date(message.created_date), 'h:mm a')}
                                </span>
                              </div>
                              <div className={`p-3 rounded-lg ${
                                isOwnMessage
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white'
                              }`}>
                                {message.message_type === 'text' ? (
                                  <p className="whitespace-pre-wrap">{message.message}</p>
                                ) : (
                                  <div className="space-y-2">
                                    <p>{message.message}</p>
                                    {message.file_url && (
                                      <a 
                                        href={message.file_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-sm underline"
                                      >
                                        <Paperclip className="w-3 h-3" />
                                        {message.file_name}
                                      </a>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>
              
              <div className="border-t border-gray-100 dark:border-slate-700 p-4">
                {selectedFile && (
                  <Alert className="mb-3">
                    <Paperclip className="h-4 w-4" />
                    <AlertDescription>
                      File selected: {selectedFile.name}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedFile(null)}
                        className="ml-2 h-auto p-1"
                      >
                        Remove
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="flex items-end gap-2">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => document.getElementById('file-upload').click()}
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  
                  <Textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message... (Shift+Enter for new line)"
                    className="flex-1 min-h-[44px] max-h-[120px] resize-none"
                  />
                  
                  <Button
                    onClick={sendMessage}
                    disabled={!messageText.trim() && !selectedFile}
                    className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Welcome to Admin Chat</p>
                <p>Select a channel or start a direct message to begin</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
