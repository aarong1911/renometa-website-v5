import React from 'react';
import { Button } from './ui/button';

interface ChatTimezonePickerProps {
  onTimezoneSelect: (timezone: string) => void;
  onReset: () => void;
}

const timezones = [
  { label: 'Eastern Time (EST)', value: 'America/New_York' },
  { label: 'Central Time (CST)', value: 'America/Chicago' },
  { label: 'Mountain Time (MST)', value: 'America/Denver' },
  { label: 'Pacific Time (PST)', value: 'America/Los_Angeles' },
];

const ChatTimezonePicker = ({ onTimezoneSelect, onReset }: ChatTimezonePickerProps) => {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {timezones.map((tz) => (
          <Button
            key={tz.value}
            onClick={() => onTimezoneSelect(tz.value)}
            className="w-full"
            variant="outline"
          >
            {tz.label}
          </Button>
        ))}
      </div>
      <Button onClick={onReset} variant="link" className="text-gray-500">
        Start Over
      </Button>
    </div>
  );
};

export default ChatTimezonePicker;
