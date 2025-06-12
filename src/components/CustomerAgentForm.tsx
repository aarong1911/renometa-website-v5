// components/CustomerAgentForm.tsx

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CustomerAgentFormData } from '@/types/form'; // Correct path

// This interface MUST be here
interface CustomerAgentFormProps {
  onSubmit: (data: CustomerAgentFormData) => void;
  onCancel: () => void;
  userRequestId: string; // This prop MUST be here
}

// Ensure function signature matches CustomerAgentFormProps
export function CustomerAgentForm({ onSubmit, onCancel, userRequestId }: CustomerAgentFormProps) {
  // *** CRITICAL FIX: Use Omit to exclude 'userRequestId' from the initial state type ***
  const [formData, setFormData] = useState<Omit<CustomerAgentFormData, 'userRequestId'>>({
    name: '',
    email: '',
    company: '',
    website: 'http://',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.email || !formData.company || !formData.website) {
      setError('All fields are required.');
      return;
    }

    // *** CRITICAL: Add userRequestId to the data before calling onSubmit ***
    onSubmit({ ...formData, userRequestId: userRequestId });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h2 className="text-xl font-bold mb-4">Provide Website Details</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Your Name</Label>
          <Input
    id="name"
    placeholder="Full Name"
    value={formData.name}
    onChange={handleChange}
    required
  />
        </div>
        <div>
          <Label htmlFor="email">Your Email</Label>
          <Input
    id="email"
    type="email"
    placeholder="Email Address"
    value={formData.email}
    onChange={handleChange}
    required
  />
        </div>
        <div>
          <Label htmlFor="company">Company Name</Label>
          <Input
    id="company"
    placeholder="Your Business"
    value={formData.company}
    onChange={handleChange}
    required
  />
        </div>
        <div>
          <Label htmlFor="website">Company Website</Label>
          <Input
    id="website"
    type="url"
    placeholder="http://"
    value={formData.website}
    onChange={handleChange}
    required
  />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  );
}