"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loginAsAdmin, setLoginAsAdmin] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implement login logic here
    console.log('Login submitted', { email, password, rememberMe, loginAsAdmin });
    // Redirect to dashboard or show error
    router.push('/dashboard');
  };

  const handleForgotPassword = () => {
    // Implement forgot password logic
    console.log('Forgot password clicked');
  };

  const handleExploreFeatures = () => {
    // Implement explore features logic
    console.log('Explore features clicked');
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Login Form Section */}
      <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Get Started</h1>
          <p className="text-gray-600 mb-8">Welcome to CoBill - Let's create your account</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hi@cobill.com"
                className="mt-1"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="mr-2"
                />
                <label htmlFor="remember-me" className="text-sm text-gray-600">Remember me</label>
              </div>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-green-600 hover:text-green-500"
              >
                Forgot?
              </button>
            </div>
            <div className="flex items-center">
              <Checkbox
                id="login-as-admin"
                checked={loginAsAdmin}
                onCheckedChange={(checked) => setLoginAsAdmin(checked as boolean)}
                className="mr-2"
              />
              <label htmlFor="login-as-admin" className="text-sm text-gray-600">Login as Admin</label>
            </div>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white">
              Sign in
            </Button>
          </form>
        </div>
      </div>

      {/* Information Panel Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-green-600 text-white p-8 flex-col justify-between items-center">
        <div className="flex flex-col items-center justify-center flex-grow">
          <h2 className="text-5xl font-bold mb-4">CoBill</h2>
          <p className="text-2xl mb-12 text-center">Internal Tool for your business</p>
          <div className="grid grid-cols-2 gap-12 mb-12">
            <FeatureIcon icon="analytics" label="Analytics" />
            <FeatureIcon icon="user-management" label="User Management" />
            <FeatureIcon icon="invoicing" label="Invoicing" />
            <FeatureIcon icon="settings" label="Settings" />
          </div>
          <Button
            onClick={handleExploreFeatures}
            className="bg-white text-green-600 hover:bg-gray-100 text-lg px-6 py-3"
          >
            Explore Features
          </Button>
        </div>
        <div className="flex justify-end space-x-4 w-full">
          {/* Add language and accessibility icons here */}
        </div>
      </div>
    </div>
  );
};

const FeatureIcon = ({ icon, label }: { icon: string; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="bg-green-500 p-6 rounded-2xl mb-3">
      {getIconSvg(icon)}
    </div>
    <span className="text-lg text-center">{label}</span>
  </div>
);

const getIconSvg = (icon: string) => {
  switch (icon) {
    case 'analytics':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case 'user-management':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case 'invoicing':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case 'settings':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    default:
      return null;
  }
};

export default LoginPage;
