'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SearchBar({ currentQuery }: { currentQuery?: string }) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const [query, setQuery] = useState(currentQuery || '');

	// Mettre à jour l'état local quand la query change dans l'URL
	useEffect(() => {
		setQuery(currentQuery || '');
	}, [currentQuery]);

	function handleSearch(value: string) {
		setQuery(value);
		const next = new URLSearchParams(searchParams.toString());
		if (value.trim()) {
			next.set('q', value.trim());
		} else {
			next.delete('q');
		}
		// Reset to page 1 when searching
		next.delete('page');
		router.replace(`${pathname}?${next.toString()}`);
	}

	function clearSearch() {
		setQuery('');
		const next = new URLSearchParams(searchParams.toString());
		next.delete('q');
		next.delete('page');
		router.replace(`${pathname}?${next.toString()}`);
	}

	return (
		<div className="max-w-2xl mx-auto">
			<div className="relative">
				<input 
					className="w-full pl-12 pr-12 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:border-transparent shadow-sm" 
					placeholder="Rechercher des sneakers..." 
					value={query} 
					onChange={(e) => handleSearch(e.target.value)}
				/>
				
				{/* Icône de recherche */}
				<svg className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>

				{/* Bouton de suppression */}
				{query && (
					<button
						onClick={clearSearch}
						className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
					>
						<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				)}
			</div>

			{/* Suggestions de recherche rapide */}
			<div className="mt-4 flex flex-wrap gap-2 justify-center">
				{['CONDOR', 'GEN8', 'BLACK', 'SILVER', 'WHITE', 'VOLLEY'].map((suggestion) => (
					<button
						key={suggestion}
						onClick={() => handleSearch(suggestion)}
						className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
					>
						{suggestion}
					</button>
				))}
			</div>
		</div>
	);
}
