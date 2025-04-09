
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { MessageSquare, X } from 'lucide-react';

type TimeSlot = {
  hour: number;
  minute: number;
  period: 'AM' | 'PM';
  formatted: string;
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{type: 'user' | 'bot', content: string}[]>([]);
  const [step, setStep] = useState<'initial' | 'info' | 'schedule' | 'date' | 'time' | 'confirmation'>('initial');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
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
          content: 'We offer digital services specifically designed for remodeling and home service businesses. Our services include Smart Website Development, Advanced SEO, AI-Powered Agents, Intelligent Automation, Seamless Integration, and Performance Optimization. How can we help your business grow?'
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
        content: `Perfect! Your appointment is scheduled for ${format(selectedDate!, 'MMMM d, yyyy')} at ${time} EST. We'll send a confirmation to your email. Is there anything else you'd like to know before your appointment?`
      }
    ]);
    setStep('confirmation');
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
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = (message: string) => {
    if (!message.trim()) return;
    
    setMessages([
      ...messages,
      {
        type: 'user',
        content: message
      },
      {
        type: 'bot',
        content: 'Thank you for your message. One of our representatives will get back to you shortly. Is there anything else you would like to know?'
      }
    ]);
  };

  return (
    <>
      {/* Chat toggle button */}
      <button 
        className="fixed bottom-6 right-6 bg-gold hover:bg-gold-light text-white p-4 rounded-full shadow-lg z-50 transition-colors"
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
                  className="bg-gold hover:bg-gold-light w-full"
                >
                  Schedule Appointment
                </Button>
              </div>
            )}

            {step === 'info' && (
              <div className="flex flex-col space-y-3">
                <input 
                  type="text" 
                  placeholder="Type your question here..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      sendMessage((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
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

            {step === 'confirmation' && (
              <div className="flex flex-col space-y-3">
                <p className="text-sm text-gray-600">Thank you for scheduling with us! We'll be in touch shortly.</p>
                <Button onClick={handleReset} className="bg-gold hover:bg-gold-light text-white">
                  Schedule Another Appointment
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
