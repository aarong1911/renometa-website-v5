// components/CustomerServiceAgent.tsx

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { CustomerAgentForm } from './CustomerAgentForm'; // Path to your form component
import { CrawlingProgress } from './CrawlingProgress'; // Path to your crawling progress component
import { ChatInterface } from './ChatInterface'; // Path to your chat component
import { CustomerAgentFormData } from '@/types/form'; // Path to your form data type
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

type Step = 'form' | 'crawling' | 'chat';

// *** FIX: Changed to a named export 'export function' from 'export default function' (if it was default) ***
export function CustomerServiceAgent() {
  const [step, setStep] = useState<Step>('form');
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState<CustomerAgentFormData | null>(null);
  const [userRequestId, setUserRequestId] = useState<string>(uuidv4());
  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFormSubmit = async (data: CustomerAgentFormData) => {
    setUserData(data);
    setStep('crawling');

    toast({
      title: "Form submitted",
      description: `We'll start crawling ${data.website} to train your customer service agent.`,
    });

    try {
      // Data passed here should already contain the userRequestId from CustomerAgentForm
      const response = await axios.post('http://localhost:8888/.netlify/functions/setup-agent', data);
      console.log('setup-agent response:', response.data);

      if (response.data.requestId) {
        setSubmittedRequestId(response.data.requestId);
        if (response.data.requestId !== userRequestId) {
          console.warn(`Mismatch: frontend userRequestId (${userRequestId}) vs backend returned ID (${response.data.requestId}). Aligning frontend.`);
          setUserRequestId(response.data.requestId); // Align frontend to backend's confirmation
        }
      } else {
        console.warn('setup-agent response missing requestId. Using initial userRequestId.');
        setSubmittedRequestId(userRequestId);
      }

    } catch (error: any) {
      console.error('Error calling setup-agent function:', error);
      toast({
        title: "Error creating agent",
        description: `Failed to initiate agent creation: ${error.response?.data?.body || error.message || 'Unknown error'}`,
        variant: "destructive",
      });
      setStep('form');
      setUserData(null);
      setSubmittedRequestId(null);
      setUserRequestId(uuidv4()); // Generate a new ID for the next attempt
    }
  };

  const handleCrawlingComplete = () => {
    setStep('chat');
    toast({
      title: "Training complete",
      description: "Your AI customer service agent is now ready to chat.",
    });
  };

  const handleCancel = () => {
    setOpen(false);
    setTimeout(() => {
      setStep('form');
      setUserData(null);
      setSubmittedRequestId(null);
      setUserRequestId(uuidv4()); // Generate new ID for next session
    }, 300);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setStep('form');
      setUserData(null);
      setSubmittedRequestId(null);
      setUserRequestId(uuidv4()); // Generate new ID for next session
    }, 300);
  };

  const renderContent = () => {
    switch (step) {
      case 'form':
        return <CustomerAgentForm onSubmit={handleFormSubmit} onCancel={handleCancel} userRequestId={userRequestId} />;
      case 'crawling':
        return userData ? (
          <CrawlingProgress
            website={userData.website}
            onComplete={handleCrawlingComplete}
            simulationDurationMs={15000}
          />
        ) : null;
      case 'chat':
        return userData && submittedRequestId ? (
          <div className="h-[75vh] overflow-y-auto">
            <ChatInterface
              userData={userData}
              userRequestId={submittedRequestId}
              onClose={handleClose}
            />
          </div>
        ) : null;
      default:
        return null;
    }
  };

  const getDialogSize = () => {
    switch (step) {
      case 'form':
        return 'max-w-md';
      case 'crawling':
        return 'max-w-md';
      case 'chat':
        return 'max-w-2xl h-[80vh]';
      default:
        return 'max-w-md';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-gradient-to-r from-agent-blue to-agent-lightBlue hover:opacity-90 transition-opacity"
        >
          Try our Customer Service Agent
        </Button>
      </DialogTrigger>
      <DialogContent className={`${getDialogSize()} ${step === 'chat' ? 'p-0 flex flex-col' : ''}`}>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}