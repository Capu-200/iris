'use client';

import Image from "next/image";
import Logo from '@/public/Logo-vert.svg';
import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const result = await register(formData);
        
        if (result.success) {
            router.push('/account');
        } else {
            setError(result.error || 'Erreur d\'inscription');
        }
        
        setIsLoading(false);
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
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-950">Créez un compte !</h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="lastName" className="block text-sm/6 font-medium text-gray-950">
                  Nom
                </label>
                <div className="mt-2">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-950 focus:outline-2 focus:-outline-offset-2 focus:outline-[#576F66] sm:text-sm/6"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="firstName" className="block text-sm/6 font-medium text-gray-950">
                    Prénom
                </label>
                <div className="mt-2">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-950 focus:outline-2 focus:-outline-offset-2 focus:outline-[#576F66] sm:text-sm/6"
                  />
                </div>
              </div>

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
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-950 focus:outline-2 focus:-outline-offset-2 focus:outline-[#576F66] sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm/6 font-medium text-gray-950">
                    Téléphone (optionnel)
                </label>
                <div className="mt-2">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-950 focus:outline-2 focus:-outline-offset-2 focus:outline-[#576F66] sm:text-sm/6"
                  />
                </div>
              </div>
  
              <div>
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-950">
                    Mot de passe
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
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
                  {isLoading ? 'Création...' : 'Créer mon compte'}
                </button>
              </div>
            </form>
  
            <p className="mt-10 text-center text-sm/6 text-gray-400">
              Vous avez déjà un compte ?{' '}
              <Link href="/login" className="font-semibold text-[#576F66] hover:text-[#34433D]">
                Connectez-vous !
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
}
  