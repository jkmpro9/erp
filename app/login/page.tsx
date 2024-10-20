"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Users, FileText, BarChart2, Settings } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Login Form Section */}
      <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connexion</h2>
          <p className="text-gray-600 mb-8">Bienvenue ! Veuillez entrer vos identifiants.</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre email"
                className="mt-1"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Se souvenir de moi
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-green-600 hover:text-green-500">
                  Mot de passe oublié ?
                </a>
              </div>
            </div>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">Se connecter</Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Vous n'avez pas de compte ?{' '}
            <Link href="/signup" className="font-medium text-green-600 hover:text-green-500">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>

      {/* Illustration Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-green-100 flex-col items-center justify-center p-12">
        <h2 className="text-3xl font-bold text-green-800 mb-8">Bienvenue sur CoBill CRM</h2>
        <div className="grid grid-cols-2 gap-12">
          <div className="flex flex-col items-center">
            <Users size={64} className="text-green-600 mb-4" />
            <p className="text-center text-green-800 text-lg">Gérer les Clients</p>
          </div>
          <div className="flex flex-col items-center">
            <FileText size={64} className="text-green-600 mb-4" />
            <p className="text-center text-green-800 text-lg">Créer des Factures</p>
          </div>
          <div className="flex flex-col items-center">
            <BarChart2 size={64} className="text-green-600 mb-4" />
            <p className="text-center text-green-800 text-lg">Suivre les Analyses</p>
          </div>
          <div className="flex flex-col items-center">
            <Settings size={64} className="text-green-600 mb-4" />
            <p className="text-center text-green-800 text-lg">Personnaliser les Paramètres</p>
          </div>
        </div>
      </div>
    </div>
  );
}
