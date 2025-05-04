
import { useState, useEffect } from 'react';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useAppointment } from '@/hooks/useAppointment';
import { useUserInfo } from '@/hooks/useUserInfo';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { findRelevantContent } from '@/utils/contentSearch';

export type ChatbotStep = 'initial' | 'info' | 'schedule' | 'date' | 'time' | 'user_info' | 'confirmation' | 'post_confirmation';

export const useChatbotState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<ChatbotStep>('initial');
  const [autoCloseTimer, setAutoCloseTimer] = useState<number | null>(null);
  const { toast } = useToast();

  const {
    messages,
    addUserMessage,
    addBotMessage,
    resetMessages,
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
    if (isOpen && messages.length === 0) {
      resetMessages();
      setStep('initial');
    }
  }, [isOpen, messages.length, resetMessages]);

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
      addBotMessage('Sure, what would you like to know more about? I can help with our services like Website Development, SEO, AI Agents, or our solutions for CRM, Sales, Marketing, and Job Management.');
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
    
    addUserMessage(query);
    
    // Handle free trial related questions
    if (query.toLowerCase().includes('free trial') || 
        query.toLowerCase().includes('trial') || 
        query.toLowerCase().includes('try for free')) {
      setTimeout(() => {
        addBotMessage("Yes! We offer a 14-day free trial with full access to our AI customer support agent, smart landing page, and other features. No credit card required and you can cancel anytime. Click the 'Start Free' or 'Get Started' button to begin your trial today!");
      }, 300);
      setUserInput('');
      return;
    }
    
    let botResponse = findRelevantContent(query);
    
    // Ensure responses focus on benefits and are concise
    if (botResponse.length > 300) {
      // Extract the most relevant part and focus on benefits
      const sentences = botResponse.split(/[.!?]+/);
      const benefitSentences = sentences.filter(s => 
        s.toLowerCase().includes('benefit') || 
        s.toLowerCase().includes('improve') || 
        s.toLowerCase().includes('increase') || 
        s.toLowerCase().includes('help') ||
        s.toLowerCase().includes('save') ||
        s.toLowerCase().includes('grow')
      );
      
      if (benefitSentences.length > 0) {
        // Include at least one benefit sentence if available
        botResponse = benefitSentences.slice(0, 2).join('. ') + '.';
      } else {
        // Just truncate if no specific benefit sentences found
        botResponse = sentences.slice(0, 3).join('. ') + '.';
      }
    }
    
    setTimeout(() => {
      addBotMessage(botResponse);
    }, 300);
    
    setUserInput('');
  };

  return {
    isOpen,
    step,
    messages,
    userInput,
    selectedDate,
    selectedTime,
    isSubmitting,
    currentInfoField,
    timeSlots,
    setUserInput,
    toggleChat,
    handleInitialChoice,
    handleDateSelect,
    handleTimeSelect,
    handleInfoInput,
    submitAppointment,
    handlePostConfirmation,
    handleReset,
    processUserQuery,
  };
};

export default useChatbotState;
