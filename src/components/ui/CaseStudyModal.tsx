// components/ui/CaseStudyModal.tsx

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogOverlay
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CaseStudyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: React.ReactNode;
}

const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  open,
  onOpenChange,
  title,
  content
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
<DialogOverlay className="fixed inset-0 z-40 bg-black/50 animate-fade-in" />
<DialogContent
  className="fixed z-50 bg-white text-black w-[90%] max-w-[420px] max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6 animate-fade-in-up"
>

      <DialogTitle className="text-2xl font-bold mb-4">{title}</DialogTitle>
        <DialogDescription className="sr-only">Case Study Details</DialogDescription>

        <Button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          variant="ghost"
          size="icon"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </Button>

        <div className="space-y-4">{content}</div>
      </DialogContent>
    </Dialog>
  );
};

export default CaseStudyModal;
