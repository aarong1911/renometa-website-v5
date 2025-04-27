
import { useState } from 'react';

export type TimeSlot = {
  hour: number;
  minute: number;
  period: 'AM' | 'PM';
  formatted: string;
};

export const useAppointment = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const resetAppointment = () => {
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setIsSubmitting(false);
  };

  return {
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    isSubmitting,
    setIsSubmitting,
    timeSlots,
    resetAppointment
  };
};
