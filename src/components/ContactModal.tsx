
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogOverlay
} from '@/components/ui/dialog';
import ContactForm from './ContactForm';

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ContactModal({ open, onOpenChange }: ContactModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/50" />
      <DialogContent className= "fixed z-50 bg-[#1d2939] text-white w-[90%] max-w-[420px] sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6 animate-fade-in-up" >
        <DialogTitle className="text-2xl font-bold mb-4">Get in Touch</DialogTitle>
        <DialogDescription className="sr-only">
          Fill out the form below to send us a message.
        </DialogDescription>
        
        <Button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
          variant="ghost"
          size="icon"
          aria-label="Close contact form"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </Button>
        
        <ContactForm 
          onSuccess={handleSuccess} 
          isSubmitting={isSubmitting} 
          setIsSubmitting={setIsSubmitting} 
        />
      </DialogContent>
    </Dialog>
  );
}
