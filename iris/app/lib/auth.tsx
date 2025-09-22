'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type User = {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	phone?: string;
};

type AuthContextType = {
	user: User | null;
	login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
	register: (userData: { firstName: string; lastName: string; email: string; password: string; phone?: string }) => Promise<{ success: boolean; error?: string }>;
	logout: () => void;
	isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'iris_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Charger l'utilisateur depuis le localStorage au démarrage
		try {
			const storedUser = localStorage.getItem(STORAGE_KEY);
			if (storedUser) {
				setUser(JSON.parse(storedUser));
			}
		} catch (error) {
			console.error('Erreur lors du chargement de l\'utilisateur:', error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});

			const data = await response.json();

			if (data.success) {
				setUser(data.user);
				localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
				return { success: true };
			} else {
				return { success: false, error: data.error || 'Erreur de connexion' };
			}
		} catch (error) {
			console.error('❌ Erreur de connexion:', error);
			return { success: false, error: 'Erreur de connexion' };
		}
	};

	const register = async (userData: { firstName: string; lastName: string; email: string; password: string; phone?: string }): Promise<{ success: boolean; error?: string }> => {
		try {
			const response = await fetch('/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(userData)
			});

			const data = await response.json();

			if (data.success) {
				setUser(data.user);
				localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
				return { success: true };
			} else {
				return { success: false, error: data.error || 'Erreur d\'inscription' };
			}
		} catch (error) {
			console.error('Erreur d\'inscription:', error);
			return { success: false, error: 'Erreur d\'inscription' };
		}
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem(STORAGE_KEY);
	};

	return (
		<AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return context;
} 