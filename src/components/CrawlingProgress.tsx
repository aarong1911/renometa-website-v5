import { useEffect, useRef, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabaseClient';

interface CrawlingProgressProps {
  website: string;
  onComplete: () => void;
  simulationDurationMs?: number;
  userRequestId?: string;
}

const STATUS_MESSAGES = [
  "Initializing crawler...",
  "Analyzing website structure...",
  "Extracting content from pages...",
  "Processing service information...",
  "Learning about your business...",
  "Building knowledge base...",
  "Generating AI embeddings...",
  "Finalizing agent capabilities...",
  "Almost ready...",
];

export function CrawlingProgress({
  website,
  onComplete,
  simulationDurationMs = 180000, // 3 minutes max wait
  userRequestId,
}: CrawlingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState(STATUS_MESSAGES[0]);
  // Track highest progress seen — never go backwards
  const highestProgress = useRef(0);

  useEffect(() => {
    const startTime = Date.now();

    // Update status message based on progress value
    const updateStatus = (pct: number) => {
      const idx = Math.min(
        Math.floor((pct / 100) * STATUS_MESSAGES.length),
        STATUS_MESSAGES.length - 1
      );
      setStatusMessage(STATUS_MESSAGES[idx]);
    };

    // Slow-moving simulation — gives visual feedback while real crawl runs
    // Maxes out at 85% so real completion from Supabase always "wins"
    const simInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const simProgress = Math.min(
        Math.floor((elapsed / simulationDurationMs) * 85),
        85
      );

      // ✅ Never go backwards
      if (simProgress > highestProgress.current) {
        highestProgress.current = simProgress;
        setProgress(simProgress);
        updateStatus(simProgress);
      }
    }, 1000);

    // Poll Supabase for real progress every 5 seconds
    const pollInterval = setInterval(async () => {
      if (!userRequestId) return;

      try {
        const { data } = await supabase
          .from('agent_requests')
          .select('status, progress')
          .eq('id', userRequestId)
          .single();

        if (!data) return;

        const realProgress = Math.round((data.progress || 0) * 100);

        // ✅ Never go backwards — only update if higher than what we've seen
        if (realProgress > highestProgress.current) {
          highestProgress.current = realProgress;
          setProgress(realProgress);
          updateStatus(realProgress);
        }

        // Crawl is done
        if (data.status === 'ready') {
          clearInterval(simInterval);
          clearInterval(pollInterval);
          highestProgress.current = 100;
          setProgress(100);
          setStatusMessage("Agent training complete!");
          setTimeout(() => onComplete(), 1000);
        }

        // Crawl failed
        if (data.status === 'failed' || data.status === 'no_content') {
          clearInterval(simInterval);
          clearInterval(pollInterval);
          setStatusMessage("Setup complete. Starting your agent...");
          setTimeout(() => onComplete(), 1500);
        }
      } catch (e) {
        // Silently ignore polling errors
      }
    }, 5000);

    // Fallback — if nothing happens after simulationDurationMs, proceed anyway
    const fallbackTimeout = setTimeout(() => {
      clearInterval(simInterval);
      clearInterval(pollInterval);
      setProgress(100);
      setStatusMessage("Agent training complete!");
      setTimeout(() => onComplete(), 1000);
    }, simulationDurationMs);

    return () => {
      clearInterval(simInterval);
      clearInterval(pollInterval);
      clearTimeout(fallbackTimeout);
    };
  }, [userRequestId]);

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
