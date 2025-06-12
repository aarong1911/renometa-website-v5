import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';

interface CrawlingProgressProps {
  website: string;
  onComplete: () => void;
  simulationDurationMs?: number;
}

export function CrawlingProgress({ 
  website, 
  onComplete, 
  simulationDurationMs = 180000 // 3 minutes
}: CrawlingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Initializing crawler...");
  
  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + simulationDurationMs;
    
    const statusMessages = [
      "Analyzing website structure...",
      "Extracting content from pages...",
      "Processing FAQ sections...",
      "Learning product information...",
      "Analyzing customer support documentation...",
      "Building knowledge representation...",
      "Training response generation...",
      "Finalizing agent capabilities..."
    ];
    
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      const newProgress = Math.min(Math.floor((elapsedTime / simulationDurationMs) * 100), 100);
      
      setProgress(newProgress);
      
      if (newProgress > 0 && newProgress % 12 === 0) {
        const messageIndex = Math.min(
          Math.floor(newProgress / 12), 
          statusMessages.length - 1
        );
        setStatusMessage(statusMessages[messageIndex]);
      }
      
      if (newProgress >= 100) {
        clearInterval(interval);
        setStatusMessage("Agent training complete!");
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [website, onComplete, simulationDurationMs]);

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2 text-center">
        <h3 className="text-lg font-medium">Training Your Customer Service Agent</h3>
        <p className="text-sm text-muted-foreground">
          We're crawling <span className="font-medium text-foreground">{website}</span> to create your custom AI agent
        </p>
      </div>
      
      <div className="space-y-4">
        <Progress value={progress} className="h-2 w-full" />
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground">Progress: {progress}%</p>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex items-center justify-center gap-3 rounded-md border p-4">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse-opacity"></div>
          <p className="text-sm">{statusMessage}</p>
        </div>
      </div>
    </div>
  );
}
// This component simulates the crawling and training process for a customer service agent.
// It displays a progress bar and status messages to inform the user about the ongoing process.