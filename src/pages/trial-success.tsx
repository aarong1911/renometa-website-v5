import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

const TrialSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        insertTrialIfNeeded(data.user);
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  const insertTrialIfNeeded = async (user: any) => {
    const { data: existing } = await supabase
      .from('trials')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!existing) {
      await supabase.from('trials').insert([
        {
          user_id: user.id,
          email: user.email,
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
        },
      ]);
    }

    setMessage('🎉 Your free trial has been activated!');
    setTimeout(() => navigate('/dashboard'), 2000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('Logging in...');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      setError('Invalid email or password.');
      setMessage('');
      return;
    }

    setUser(data.user);
    insertTrialIfNeeded(data.user);
  };

  return (
    <MainLayout>
      <section className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-8 text-center max-w-md w-full">
          <h1 className="text-3xl font-bold mb-4 text-blue-dark">Free Trial Status</h1>

          {loading ? (
            <p>Checking your account...</p>
          ) : user ? (
            <p className="text-green-600">{message}</p>
          ) : (
            <>
              <p className="mb-4 text-gray-700">Please log in to activate your free trial.</p>
              <form onSubmit={handleLogin} className="space-y-3 text-left">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Email</span>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Password</span>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    required
                  />
                </label>
                <Button type="submit" className="w-full">
                  Log In
                </Button>
                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                {message && <p className="text-sm text-green-600 mt-2">{message}</p>}
              </form>
            </>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default TrialSuccess;
