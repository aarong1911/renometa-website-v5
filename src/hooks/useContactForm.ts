import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  service: string;
  consent?: boolean;
}

interface UseContactFormProps {
  onSuccess?: () => void;
}

export function useContactForm({ onSuccess }: UseContactFormProps = {}) {
  const { toast } = useToast();

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    service: "general",
    consent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      source: "contact-form",
    };

    try {
      // ✅ Send payload to Netlify proxy
      const res = await fetch("/.netlify/functions/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
      });

      // reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
        service: "general",
        consent: false,
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("❌ Error submitting contact form:", err);
      toast({
        title: "Error",
        description:
          "There was a problem sending your message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
}
