'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmail } from '@/app/lib/auth';
import Image from 'next/image';
import { cn } from '@/app/lib/utils';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signInWithEmail(email, password);
      console.log('Login successful:', result);
      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <main className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/logo.svg"
              alt="BJÖRK & CO."
              width={200}
              height={40}
              className="mx-auto"
              priority
            />
          </Link>
          <p className="text-gray-500 text-[14px] mt-4">Admin Portal</p>
        </div>

        {/* Login Form */}
        <div className="bg-white shadow-sm border border-gray-200 p-8">
          <h2 className="font-serif text-[24px] text-black text-center mb-6">
            Sign In
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-[14px]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-[13px] font-medium tracking-[0.05em] text-black mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 text-[14px] text-black placeholder:text-gray-400 focus:outline-none focus:border-[#013220] transition-colors"
                placeholder="admin@bjorkco.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[13px] font-medium tracking-[0.05em] text-black mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 text-[14px] text-black placeholder:text-gray-400 focus:outline-none focus:border-[#013220] transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'w-full py-4 px-8 text-[13px] font-medium tracking-[0.1em] uppercase transition-all duration-300',
                'bg-[#013220] text-white hover:bg-black',
                isLoading && 'opacity-70 cursor-not-allowed'
              )}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Back to site */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-[13px] text-gray-500 hover:text-[#013220] transition-colors"
          >
            ← Back to website
          </Link>
        </div>
      </main>
    </div>
  );
}
