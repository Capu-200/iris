'use client';

import Image from "next/image";
import Logo from '@/public/Logo-vert.svg';
import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/account';

    // Vérifier que le contexte d'authentification est bien chargé
    useEffect(() => {
    }, [login]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setIsLoading(true);
        setError('');

        try {
            const result = await login(email, password);
            
            if (result.success) {
                router.push(redirectTo);
            } else {
                setError(result.error || 'Erreur de connexion');
            }
        } catch (err) {
            console.error('❌ Erreur lors de la connexion:', err);
            setError('Erreur de connexion');
        } finally {
            setIsLoading(false);
        }
    };

    return (
      <div className="h-full bg-gray-50">
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <Image
              alt="Logo en forme de fleur"
              src={Logo}
              className="mx-auto h-10 w-auto"
            />
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-950">Connectez-vous !</h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-950">
                  Adresse mail
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-950 focus:outline-2 focus:-outline-offset-2 focus:outline-[#576F66] sm:text-sm/6"
                  />
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm/6 font-medium text-gray-950">
                    Mot de passe
                  </label>
                  <div className="text-sm">
                    <a href="#" className="font-semibold text-[#576F66] hover:text-[#34433D]">
                      Mot de passe oublié ?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-950 outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-950 focus:outline-2 focus:-outline-offset-2 focus:outline-[#576F66] sm:text-sm/6"
                  />
                </div>
              </div>
  
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-md bg-[#576F66] px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-[#34433D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#576F66] disabled:opacity-50"
                >
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </button>
              </div>
            </form>
  
            <p className="mt-10 text-center text-sm/6 text-gray-400">
              Vous n'avez pas de compte ?{' '}
              <Link href="/register" className="font-semibold text-[#576F66] hover:text-[#34433D]">
                Créez vous en un !
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
}
  