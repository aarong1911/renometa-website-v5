import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatDatePicker from '@/components/chat/ChatDatePicker';
import ChatTimePicker from '@/components/chat/ChatTimePicker';
import ChatUserInfoForm from '@/components/chat/ChatUserInfoForm';
import ChatConfirmation from '@/components/chat/ChatConfirmation';
import ChatPostConfirmation from '@/components/chat/ChatPostConfirmation';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useAppointment } from '@/hooks/useAppointment';
import { useUserInfo } from '@/hooks/useUserInfo';
import { Input } from '@/components/ui/input';

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

const serviceInfo = {
  'website development': 'Our Smart Website Development service creates beautiful, responsive websites optimized for remodeling businesses with lead generation capabilities.',
  'seo': 'Our Advanced SEO service improves your online visibility with local search optimization, content strategy, and performance tracking.',
  'ai agents': 'Our AI-Powered Agents service implements conversational AI for your business to engage customers and qualify leads 24/7.',
  'automation': 'Our Intelligent Automation service streamlines repetitive tasks in your remodeling business workflow for increased efficiency.',
  'integration': 'Our Seamless Integration service connects your business tools and software to create a unified system with real-time data flow.',
  'performance': 'Our Performance Optimization service improves your website speed, user experience, and conversion rates through data-driven improvements.'
};

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
  const [step, setStep] = useState<'initial' | 'info' | 'schedule' | 'date' | 'time' | 'user_info' | 'confirmation' | 'post_confirmation'>('initial');
  const [autoCloseTimer, setAutoCloseTimer] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const {
    messages,
    addUserMessage,
    addBotMessage,
    resetMessages
  } = useChatMessages();

  const {
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    isSubmitting,
    setIsSubmitting,
    timeSlots,
    resetAppointment
  } = useAppointment();

  const {
    userInfo,
    userInput,
    setUserInput,
    currentInfoField,
    setCurrentInfoField,
    updateUserInfo,
    resetUserInfo
  } = useUserInfo();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      resetMessages();
      setStep('initial');
    }
  }, [isOpen]);

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
      addUserMessage('I need information');
      addBotMessage('We offer digital services specifically designed for remodeling and home service businesses. Our services include Smart Website Development, Advanced SEO, AI-Powered Agents, Intelligent Automation, Seamless Integration, and Performance Optimization. What would you like to know more about?');
    } else {
      addUserMessage('I want to schedule an appointment');
      addBotMessage('Great! Let\'s schedule a consultation. Please select a date that works for you:');
      setStep('date');
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    addUserMessage(`I'd like to schedule on ${format(date, 'MMMM d, yyyy')}`);
    addBotMessage('Great! Now please select a time (EST):');
    setStep('time');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    addUserMessage(`I'd like the ${time} slot`);
    addBotMessage('Perfect! Now I need some basic information to schedule your appointment. What is your name?');
    setStep('user_info');
    setCurrentInfoField('name');
  };

  const handleInfoInput = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;
    
    addUserMessage(userInput);
    
    if (currentInfoField === 'name') {
      updateUserInfo('name', userInput);
      addBotMessage(`Thanks ${userInput}! What's your email address?`);
      setCurrentInfoField('email');
    } else if (currentInfoField === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userInput)) {
        addBotMessage('That doesn\'t seem like a valid email. Please enter a valid email address.');
        setUserInput('');
        return;
      }
      
      updateUserInfo('email', userInput);
      addBotMessage('Great! And what\'s the best phone number to reach you?');
      setCurrentInfoField('phone');
    } else if (currentInfoField === 'phone') {
      updateUserInfo('phone', userInput);
      
      addBotMessage(`Thank you! Here's a summary of your appointment:
        
Date: ${format(selectedDate!, 'MMMM d, yyyy')}
Time: ${selectedTime} EST
Name: ${userInfo.name}
Email: ${userInfo.email}
Phone: ${userInput}

Would you like to confirm this appointment?`);
      setStep('confirmation');
    }
    
    setUserInput('');
  };

  const submitAppointment = async () => {
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Appointment submission:", {
        date: format(selectedDate!, 'MMMM d, yyyy'),
        time: selectedTime,
        ...userInfo
      });
      
      addBotMessage('Your appointment has been scheduled! We\'ve sent the details to your email and our team will contact you to confirm. Is there anything else you\'d like to know?');
      
      toast({
        title: "Appointment Scheduled",
        description: `Your appointment on ${format(selectedDate!, 'MMMM d, yyyy')} at ${selectedTime} has been scheduled.`,
      });
      
      setStep('post_confirmation');
    } catch (error) {
      console.error("Error submitting appointment:", error);
      addBotMessage('Sorry, there was an error scheduling your appointment. Please try again or contact us directly at support@renometa.com.');
      
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
      addUserMessage('No, that\'s all for now.');
      addBotMessage('Thank you, and have a great day!');
      setAutoCloseTimer(Date.now());
    } else {
      addUserMessage('Yes, I have another question.');
      addBotMessage('How can I help?');
      setStep('info');
    }
  };

  const handleReset = () => {
    resetMessages();
    resetAppointment();
    resetUserInfo();
    setStep('initial');
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (autoCloseTimer) {
      setAutoCloseTimer(null);
    }
  };

  const processUserQuery = (query: string) => {
    if (!query.trim()) return;
    
    const lowercaseQuery = query.toLowerCase();
    addUserMessage(query);
    
    const serviceMatch = Object.entries(serviceInfo).find(([key]) => 
      lowercaseQuery.includes(key)
    );
    
    const faqMatch = Object.entries(faqResponses).find(([key]) => 
      lowercaseQuery.includes(key)
    );
    
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
      
      setTimeout(() => {
        addBotMessage('Would you like to schedule now?');
        setStep('initial');
      }, 500);
    } else {
      botResponse = "I'm not sure I understand your question. Would you like to know about our services, or would you prefer to schedule an appointment with our team?";
    }
    
    setTimeout(() => {
      addBotMessage(botResponse);
    }, 300);
    
    setUserInput('');
  };

  return (
    <>
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

      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 sm:w-96 bg-white rounded-lg shadow-xl z-50 flex flex-col max-h-[70vh] border border-gray-200">
          <ChatHeader onClose={toggleChat} />

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <ChatMessage key={index} type={message.type} content={message.content} />
            ))}
            <div ref={messagesEndRef} />
          </div>

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
              <ChatDatePicker 
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                onReset={handleReset}
              />
            )}

            {step === 'time' && (
              <ChatTimePicker 
                onTimeSelect={handleTimeSelect}
                onReset={handleReset}
              />
            )}
            
            {step === 'user_info' && (
              <ChatUserInfoForm
                currentField={currentInfoField}
                userInput={userInput}
                onInputChange={setUserInput}
                onSubmit={handleInfoInput}
                onReset={handleReset}
              />
            )}

            {step === 'confirmation' && (
              <ChatConfirmation
                isSubmitting={isSubmitting}
                onSubmit={submitAppointment}
                onReset={handleReset}
              />
            )}
            
            {step === 'post_confirmation' && (
              <ChatPostConfirmation
                onConfirm={handlePostConfirmation}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
