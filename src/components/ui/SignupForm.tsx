import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabaseClient';
import { Button } from './button';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  accepted: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms' }),
  }),
});

type FormData = z.infer<typeof schema>;

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors: errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const redirect = `${window.location.origin}/trial-success`;   // 👈 dynamic!
  
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name:  data.lastName,
          emailRedirectTo: redirect,
        },
        emailRedirectTo: redirect,
      },
    });
  
    if (error) {
      setMessage({ type: 'error', text: error.message });   // shows 429 plainly
      return;                                               // ⬅︎ stop here
    }

    // ✅ Save credentials to localStorage for auto-login
  localStorage.setItem("trial_email", data.email);
  localStorage.setItem("trial_password", data.password);
  
    setMessage({
      type: 'success',
      text: 'Account created! Please check your email to confirm your free trial.',
    });
  };
  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6 w-full max-w-md mx-auto space-y-4">
      <div className="flex space-x-2">
        <input
          {...register('firstName')}
          placeholder="First Name"
          className="w-1/2 border px-4 py-2 rounded text-gray-900 placeholder:text-gray-400"
        />
        <input
          {...register('lastName')}
          placeholder="Last Name"
          className="w-1/2 border px-4 py-2 rounded text-gray-900 placeholder:text-gray-400"
        />
      </div>
      <p className="text-sm text-red-500">{errors.firstName?.message || errors.lastName?.message}</p>

      <input
        {...register('email')}
        placeholder="Email"
        className="w-full border px-4 py-2 rounded text-gray-900 placeholder:text-gray-400"
      />
      <p className="text-sm text-red-500">{errors.email?.message}</p>

      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          {...register('password')}
          placeholder="Password"
          className="w-full border px-4 py-2 rounded pr-10 text-gray-900 placeholder:text-gray-400"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-2 right-3 text-gray-500"
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      <p className="text-sm text-red-500">{errors.password?.message}</p>

      <label className="flex items-center text-sm text-gray-600">
        <input type="checkbox" {...register('accepted')} className="mr-2" />
        I agree to the&nbsp;
        <a href="/terms-of-service" className="text-blue-600 hover:underline">Terms</a>
        &nbsp;&amp;&nbsp;
        <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy</a>.
      </label>
      <p className="text-sm text-red-500">{errors.accepted?.message}</p>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Submitting...' : 'Join Now'}
      </Button>

      {message && (
        <p className={`text-center text-sm mt-2 ${message.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
          {message.text}
        </p>
      )}
    </form>
  );
};

export default SignupForm;
