
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { MessageSquare, X, Calendar as CalendarIcon, Mail, Phone, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type TimeSlot = {
  hour: number;
  minute: number;
  period: 'AM' | 'PM';
  formatted: string;
};

type UserInfo = {
  name: string;
  email: string;
  phone: string;
};

// Common information about services that the chatbot can retrieve
const serviceInfo = {
  'website development': 'Our Smart Website Development service creates beautiful, responsive websites optimized for remodeling businesses with lead generation capabilities.',
  'seo': 'Our Advanced SEO service improves your online visibility with local search optimization, content strategy, and performance tracking.',
  'ai agents': 'Our AI-Powered Agents service implements conversational AI for your business to engage customers and qualify leads 24/7.',
  'automation': 'Our Intelligent Automation service streamlines repetitive tasks in your remodeling business workflow for increased efficiency.',
  'integration': 'Our Seamless Integration service connects your business tools and software to create a unified system with real-time data flow.',
  'performance': 'Our Performance Optimization service improves your website speed, user experience, and conversion rates through data-driven improvements.'
};

// FAQ responses that the chatbot can retrieve
const faqResponses = {
  'pricing': 'Our service pricing varies based on your specific needs. We offer customized packages starting at $1,500. For a detailed quote, please schedule a consultation.',
  'timeline': 'Most projects are completed within 3-6 weeks, depending on scope and complexity. We provide detailed timelines during our initial consultation.',
  'process': 'Our process includes discovery, planning, development, testing, and launch phases. We maintain clear communication throughout each step.',
  'support': 'All our services include ongoing support. We offer maintenance packages to keep your digital assets running smoothly.',
  'portfolio': 'You can view our portfolio and case studies on our website under each service section. We have experience with various remodeling businesses.',
  'contact': 'You can contact us through this chat, by emailing support@renometa.com, or by scheduling a consultation through our booking system.'
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{type: 'user' | 'bot', content: string}[]>([]);
  const [step, setStep] = useState<'initial' | 'info' | 'schedule' | 'date' | 'time' | 'user_info' | 'confirmation' | 'post_confirmation'>('initial');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [userInput, setUserInput] = useState('');
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    phone: ''
  });
  const [currentInfoField, setCurrentInfoField] = useState<'name' | 'email' | 'phone'>('name');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoCloseTimer, setAutoCloseTimer] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Generate time slots from 8am to 6pm EST
  const timeSlots: TimeSlot[] = [];
  for (let hour = 8; hour <= 18; hour++) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    
    timeSlots.push({
      hour,
      minute: 0,
      period,
      formatted: `${displayHour}:00 ${period}`
    });
    
    if (hour < 18) {
      timeSlots.push({
        hour,
        minute: 30,
        period,
        formatted: `${displayHour}:30 ${period}`
      });
    }
  }

  // Send welcome message when chat is first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          type: 'bot',
          content: 'Welcome to RenoMeta! How can we help you today?'
        }
      ]);
      setStep('initial');
    }
  }, [isOpen]);

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle auto-close timer for chat
  useEffect(() => {
    if (autoCloseTimer) {
      const timer = setTimeout(() => {
        setIsOpen(false);
        setAutoCloseTimer(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [autoCloseTimer]);

  const handleInitialChoice = (choice: 'info' | 'schedule') => {
    setStep(choice);
    
    if (choice === 'info') {
      setMessages([
        ...messages,
        {
          type: 'user',
          content: 'I need information'
        },
        {
          type: 'bot',
          content: 'We offer digital services specifically designed for remodeling and home service businesses. Our services include Smart Website Development, Advanced SEO, AI-Powered Agents, Intelligent Automation, Seamless Integration, and Performance Optimization. What would you like to know more about?'
        }
      ]);
    } else {
      setMessages([
        ...messages,
        {
          type: 'user',
          content: 'I want to schedule an appointment'
        },
        {
          type: 'bot',
          content: 'Great! Let\'s schedule a consultation. Please select a date that works for you:'
        }
      ]);
      setStep('date');
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    setMessages([
      ...messages,
      {
        type: 'user',
        content: `I'd like to schedule on ${format(date, 'MMMM d, yyyy')}`
      },
      {
        type: 'bot',
        content: 'Great! Now please select a time (EST):'
      }
    ]);
    setStep('time');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setMessages([
      ...messages,
      {
        type: 'user',
        content: `I'd like the ${time} slot`
      },
      {
        type: 'bot',
        content: 'Perfect! Now I need some basic information to schedule your appointment. What is your name?'
      }
    ]);
    setStep('user_info');
    setCurrentInfoField('name');
  };

  const handleInfoInput = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInput.trim()) {
      return;
    }
    
    const updatedInfo = { ...userInfo };
    const updatedMessages = [...messages];
    
    // Add user message
    updatedMessages.push({
      type: 'user',
      content: userInput
    });
    
    // Process based on current field
    if (currentInfoField === 'name') {
      updatedInfo.name = userInput;
      updatedMessages.push({
        type: 'bot',
        content: `Thanks ${userInput}! What's your email address?`
      });
      setCurrentInfoField('email');
    } else if (currentInfoField === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userInput)) {
        updatedMessages.push({
          type: 'bot',
          content: 'That doesn\'t seem like a valid email. Please enter a valid email address.'
        });
        setMessages(updatedMessages);
        setUserInput('');
        return;
      }
      
      updatedInfo.email = userInput;
      updatedMessages.push({
        type: 'bot',
        content: 'Great! And what\'s the best phone number to reach you?'
      });
      setCurrentInfoField('phone');
    } else if (currentInfoField === 'phone') {
      updatedInfo.phone = userInput;
      
      // All info collected, show confirmation
      updatedMessages.push({
        type: 'bot',
        content: `Thank you! Here's a summary of your appointment:
        
Date: ${format(selectedDate!, 'MMMM d, yyyy')}
Time: ${selectedTime} EST
Name: ${updatedInfo.name}
Email: ${updatedInfo.email}
Phone: ${updatedInfo.phone}

Would you like to confirm this appointment?`
      });
      setStep('confirmation');
    }
    
    setUserInfo(updatedInfo);
    setMessages(updatedMessages);
    setUserInput('');
  };

  const submitAppointment = async () => {
    setIsSubmitting(true);
    
    try {
      // In a real app, you would send this data to your backend
      // For demonstration, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Format the email body
      const emailBody = `
New Appointment Request:
-----------------------
Date: ${format(selectedDate!, 'MMMM d, yyyy')}
Time: ${selectedTime} EST
Name: ${userInfo.name}
Email: ${userInfo.email}
Phone: ${userInfo.phone}
      `;
      
      console.log("Appointment submission:", emailBody);
      console.log("Would send email to: support@renometa.com");
      
      // Add success message
      setMessages([
        ...messages,
        {
          type: 'bot',
          content: 'Your appointment has been scheduled! We\'ve sent the details to your email and our team will contact you to confirm. Is there anything else you\'d like to know?'
        }
      ]);
      
      toast({
        title: "Appointment Scheduled",
        description: `Your appointment on ${format(selectedDate!, 'MMMM d, yyyy')} at ${selectedTime} has been scheduled.`,
      });
      
      // Move to post-confirmation state
      setStep('post_confirmation');
    } catch (error) {
      console.error("Error submitting appointment:", error);
      setMessages([
        ...messages,
        {
          type: 'bot',
          content: 'Sorry, there was an error scheduling your appointment. Please try again or contact us directly at support@renometa.com.'
        }
      ]);
      
      toast({
        title: "Error",
        description: "There was a problem scheduling your appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostConfirmation = (answer: 'yes' | 'no') => {
    if (answer === 'no') {
      setMessages([
        ...messages,
        {
          type: 'user',
          content: 'No, that\'s all for now.'
        },
        {
          type: 'bot',
          content: 'Thank you, and have a great day!'
        }
      ]);
      // Set timer to close chat after 3 seconds
      setAutoCloseTimer(Date.now());
    } else {
      setMessages([
        ...messages,
        {
          type: 'user',
          content: 'Yes, I have another question.'
        },
        {
          type: 'bot',
          content: 'How can I help?'
        }
      ]);
      // Return to info state to continue conversation
      setStep('info');
    }
  };

  const handleReset = () => {
    setMessages([
      {
        type: 'bot',
        content: 'Welcome to RenoMeta! How can we help you today?'
      }
    ]);
    setStep('initial');
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setUserInfo({
      name: '',
      email: '',
      phone: ''
    });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Clear the auto-close timer if the user toggles the chat manually
    if (autoCloseTimer) {
      setAutoCloseTimer(null);
    }
  };

  const processUserQuery = (query: string) => {
    if (!query.trim()) return;
    
    const lowercaseQuery = query.toLowerCase();
    
    // Add user message
    setMessages(prev => [
      ...prev,
      {
        type: 'user',
        content: query
      }
    ]);
    
    // Check if query matches any service information
    const serviceMatch = Object.entries(serviceInfo).find(([key]) => 
      lowercaseQuery.includes(key)
    );
    
    // Check if query matches any FAQ
    const faqMatch = Object.entries(faqResponses).find(([key]) => 
      lowercaseQuery.includes(key)
    );
    
    // Determine response based on matches
    let botResponse = '';
    
    if (serviceMatch) {
      botResponse = serviceMatch[1];
    } else if (faqMatch) {
      botResponse = faqResponses[faqMatch[0] as keyof typeof faqResponses];
    } else if (lowercaseQuery.includes('appointment') || 
               lowercaseQuery.includes('schedule') || 
               lowercaseQuery.includes('book') ||
               lowercaseQuery.includes('meeting')) {
      botResponse = 'Would you like to schedule an appointment? I can help you with that!';
      
      // Add option to transition to scheduling flow
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            type: 'bot',
            content: 'Would you like to schedule now?'
          }
        ]);
        
        // Show scheduling option
        setStep('initial');
      }, 500);
      
    } else {
      botResponse = "I'm not sure I understand your question. Would you like to know about our services, or would you prefer to schedule an appointment with our team?";
    }
    
    // Add bot response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          type: 'bot',
          content: botResponse
        }
      ]);
    }, 300);
    
    setUserInput('');
  };

  return (
    <>
      {/* Chat toggle button */}
      <button 
        className="fixed bottom-6 right-6 bg-gold hover:bg-gold-light text-blue-dark p-4 rounded-full shadow-lg z-50 transition-colors"
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6" />
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 sm:w-96 bg-white rounded-lg shadow-xl z-50 flex flex-col max-h-[70vh] border border-gray-200">
          {/* Chat header */}
          <div className="bg-blue-dark text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/7217f6a6-a095-4b8f-b0b1-4e2142a3baee.png" 
                alt="RenoMeta Logo" 
                className="h-8 mr-2"
              />
              <span className="font-medium">RenoMeta Support</span>
            </div>
            <button onClick={toggleChat} className="text-white hover:text-gray-200" aria-label="Close chat">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index}
                className={cn(
                  "flex",
                  message.type === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div 
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-2",
                    message.type === 'user' 
                      ? "bg-gold text-white rounded-br-none" 
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Interactive elements based on current step */}
          <div className="border-t border-gray-200 p-4">
            {step === 'initial' && (
              <div className="flex flex-col space-y-2">
                <Button 
                  onClick={() => handleInitialChoice('info')}
                  className="bg-blue-dark hover:bg-blue-light w-full"
                >
                  Get Information
                </Button>
                <Button 
                  onClick={() => handleInitialChoice('schedule')}
                  className="bg-gold hover:bg-gold-light w-full text-blue-dark"
                >
                  Schedule Appointment
                </Button>
              </div>
            )}

            {step === 'info' && (
              <div className="flex flex-col space-y-3">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  processUserQuery(userInput);
                }} className="flex gap-2">
                  <Input 
                    type="text" 
                    placeholder="Type your question here..."
                    className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                  />
                  <Button type="submit" className="bg-gold hover:bg-gold-light text-blue-dark">
                    Send
                  </Button>
                </form>
                <Button onClick={handleReset} variant="outline" className="text-blue-dark border-blue-dark hover:bg-blue-dark/10">
                  Start Over
                </Button>
              </div>
            )}

            {step === 'date' && (
              <div className="flex flex-col space-y-3">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => {
                    // Disable dates in the past and weekends
                    const now = new Date();
                    now.setHours(0, 0, 0, 0);
                    const day = date.getDay();
                    return date < now || day === 0 || day === 6;
                  }}
                  className="rounded border mx-auto bg-white p-3 pointer-events-auto"
                />
                <Button onClick={handleReset} variant="outline" className="text-blue-dark border-blue-dark hover:bg-blue-dark/10">
                  Start Over
                </Button>
              </div>
            )}

            {step === 'time' && (
              <div className="flex flex-col space-y-3">
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                  {timeSlots.map((slot, i) => (
                    <Button 
                      key={i}
                      onClick={() => handleTimeSelect(slot.formatted)}
                      variant="outline"
                      className="text-blue-dark border-blue-dark hover:bg-blue-dark/10"
                    >
                      {slot.formatted}
                    </Button>
                  ))}
                </div>
                <Button onClick={handleReset} variant="outline" className="text-blue-dark border-blue-dark hover:bg-blue-dark/10">
                  Start Over
                </Button>
              </div>
            )}
            
            {step === 'user_info' && (
              <div className="flex flex-col space-y-3">
                <form onSubmit={handleInfoInput} className="flex gap-2">
                  <div className="relative w-full">
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
                      {currentInfoField === 'name' && <User className="h-5 w-5" />}
                      {currentInfoField === 'email' && <Mail className="h-5 w-5" />}
                      {currentInfoField === 'phone' && <Phone className="h-5 w-5" />}
                    </div>
                    <Input 
                      type={currentInfoField === 'email' ? 'email' : 'text'}
                      placeholder={
                        currentInfoField === 'name' ? 'Your name' : 
                        currentInfoField === 'email' ? 'Your email' : 
                        'Your phone number'
                      }
                      className="pl-10 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="bg-gold hover:bg-gold-light text-blue-dark">
                    Next
                  </Button>
                </form>
                <Button onClick={handleReset} variant="outline" className="text-blue-dark border-blue-dark hover:bg-blue-dark/10">
                  Cancel
                </Button>
              </div>
            )}

            {step === 'confirmation' && (
              <div className="flex flex-col space-y-3">
                <div className="flex gap-2">
                  <Button 
                    onClick={submitAppointment} 
                    className="bg-gold hover:bg-gold-light text-blue-dark flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Confirm Appointment'}
                  </Button>
                  <Button 
                    onClick={handleReset} 
                    variant="outline" 
                    className="text-blue-dark border-blue-dark hover:bg-blue-dark/10"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            
            {step === 'post_confirmation' && (
              <div className="flex flex-col space-y-3">
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handlePostConfirmation('yes')} 
                    className="bg-gold hover:bg-gold-light text-blue-dark flex-1"
                  >
                    Yes, I have another question
                  </Button>
                  <Button 
                    onClick={() => handlePostConfirmation('no')} 
                    variant="outline" 
                    className="text-blue-dark border-blue-dark hover:bg-blue-dark/10"
                  >
                    No, that's all
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
