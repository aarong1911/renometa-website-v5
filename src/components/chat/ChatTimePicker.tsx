import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface TimeSlot {
  value: string;     // "HH:mm"
  formatted: string; // also "HH:mm"
}

interface ChatTimePickerProps {
  onTimeSelect: (time: string) => void;
  onReset: () => void;
  selectedDate?: Date;
}

// ✅ normalize DB values so "10:00", "10:00:00", or "2025-09-30T10:00:00" → "10:00"
const normalizeTime = (raw: string): string => {
  if (!raw) return "";
  if (raw.includes("T")) return new Date(raw).toISOString().slice(11, 16);
  if (raw.length >= 5) return raw.slice(0, 5);
  return raw;
};

const ChatTimePicker = ({ onTimeSelect, onReset, selectedDate }: ChatTimePickerProps) => {
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);

  // Generate 30-min slots (08:00 → 17:30) in 24h format
  const generateSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let minute of [0, 30]) {
        const hh = hour.toString().padStart(2, "0");
        const mm = minute.toString().padStart(2, "0");
        const value = `${hh}:${mm}`;
        slots.push({ value, formatted: value });
      }
    }
    return slots;
  };

  useEffect(() => {
    const fetchSlots = async () => {
      const baseSlots = generateSlots();

      if (!selectedDate) {
        setAvailableSlots(baseSlots);
        return;
      }

      const isoDate = selectedDate.toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("appointments")
        .select("appointment_time")
        .eq("appointment_date", isoDate);

      if (error) {
        console.error("❌ Error fetching slots:", error.message);
        setAvailableSlots(baseSlots);
        return;
      }

      const taken = data?.map((row) => normalizeTime(row.appointment_time)) || [];
      const now = new Date();

      const free = baseSlots.filter((slot) => {
        // remove taken
        if (taken.includes(slot.value)) return false;

        // apply 2h buffer for today
        const [h, m] = slot.value.split(":").map(Number);
        const slotDate = new Date(selectedDate);
        slotDate.setHours(h, m, 0, 0);

        if (selectedDate.toDateString() === now.toDateString()) {
          const minAllowed = new Date(now.getTime() + 2 * 60 * 60 * 1000);
          if (slotDate <= minAllowed) return false;
        }

        return true;
      });

      setAvailableSlots(free);
    };

    fetchSlots();
  }, [selectedDate]);

  return (
    <div className="flex flex-col space-y-3">
      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
        {availableSlots.map((slot, i) => (
          <Button
            key={i}
            onClick={() => onTimeSelect(slot.value)}
            variant="outline"
            className="text-blue-dark border-blue-dark hover:bg-blue-dark/10"
          >
            {slot.formatted}
          </Button>
        ))}
      </div>

      <Button
        onClick={onReset}
        variant="outline"
        className="text-blue-dark border-blue-dark hover:bg-blue-dark/10"
      >
        Start Over
      </Button>
    </div>
  );
};

export default ChatTimePicker;
