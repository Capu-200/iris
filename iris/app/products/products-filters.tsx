'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface CurrentFilters {
	brand?: string;
	category?: string;
	size?: number | number[]; // Changer de 'size' à 'size' mais accepter un tableau
	priceMin?: number;
	priceMax?: number;
	sort?: string;
	page?: number;
}

export default function ProductsFilters({ 
	brands, 
	categories, 
	currentFilters 
}: { 
	brands: string[];
	categories: string[];
	currentFilters: CurrentFilters;
}) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);

	const brand = searchParams.get('brand') ?? '';
	const category = searchParams.get('category') ?? '';
	const sizeParam = searchParams.get('size') ?? '';
	const sizes = sizeParam ? sizeParam.split(',').map(s => parseInt(s)).filter(s => !isNaN(s)) : [];
	const min = searchParams.get('min') ?? '';
	const max = searchParams.get('max') ?? '';
	const sort = searchParams.get('sort') ?? 'newest';

	// Tailles disponibles communes
	const availableSizes = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48];

	function update(param: string, value: string) {
		const next = new URLSearchParams(searchParams.toString());
		if (value) next.set(param, value); 
		else next.delete(param);
		// Reset to page 1 when filters change
		if (param !== 'page') next.delete('page');
		router.replace(`${pathname}?${next.toString()}`);
	}

	function toggleSize(size: number) {
		const next = new URLSearchParams(searchParams.toString());
		const currentSizes = sizes;
		
		if (currentSizes.includes(size)) {
			// Retirer la taille
			const newSizes = currentSizes.filter(s => s !== size);
			if (newSizes.length > 0) {
				next.set('size', newSizes.join(','));
			} else {
				next.delete('size');
			}
		} else {
			// Ajouter la taille
			const newSizes = [...currentSizes, size].sort((a, b) => a - b);
			next.set('size', newSizes.join(','));
		}
		
		next.delete('page');
		router.replace(`${pathname}?${next.toString()}`);
	}

	function clearAllFilters() {
		router.replace(pathname);
	}

	const hasActiveFilters = brand || category || sizes.length > 0 || min || max;

	return (
		<>
			{/* Bouton mobile pour ouvrir les filtres */}
			<div className="lg:hidden mb-4">
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
				>
					<span className="font-medium text-gray-900 dark:text-white">
						Filtres {hasActiveFilters && `(${[brand, category, sizes.length > 0 ? 'tailles' : '', min, max].filter(Boolean).length})`}
					</span>
					<svg 
						className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
						fill="none" 
						stroke="currentColor" 
						viewBox="0 0 24 24"
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
					</svg>
				</button>
			</div>

			{/* Panneau de filtres */}
			<aside className={`
				${isOpen ? 'block' : 'hidden'} lg:block
				bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-max
			`}>
				<div className="space-y-6">
					{/* Header des filtres */}
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filtres</h2>
						{hasActiveFilters && (
							<button
								onClick={clearAllFilters}
								className="text-sm text-[#576F66] hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
							>
								Réinitialiser
							</button>
						)}
					</div>

					{/* Tri */}
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Trier par
						</label>
						<select 
							className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#576F66] focus:border-transparent" 
							value={sort} 
							onChange={(e) => update('sort', e.target.value)}
						>
							<option value="newest">Plus récent</option>
							<option value="price-low">Prix croissant</option>
							<option value="price-high">Prix décroissant</option>
							<option value="name">Nom A-Z</option>
							<option value="brand">Marque A-Z</option>
						</select>
					</div>

					{/* Marque */}
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Marque
						</label>
						<select 
							className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#576F66] focus:border-transparent" 
							value={brand} 
							onChange={(e) => update('brand', e.target.value)}
						>
							<option value="">Toutes les marques</option>
							{brands.map((b) => (
								<option key={b} value={b}>{b}</option>
							))}
						</select>
					</div>

					{/* Catégorie */}
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Catégorie
						</label>
						<select 
							className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#576F66] focus:border-transparent" 
							value={category} 
							onChange={(e) => update('category', e.target.value)}
						>
							<option value="">Toutes les catégories</option>
							{categories.map((c) => (
								<option key={c} value={c}>{c}</option>
							))}
						</select>
					</div>

					{/* Pointures - Boutons multiples */}
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Pointures
						</label>
						<div className="grid grid-cols-4 gap-2">
							{availableSizes.map((size) => (
								<button
									key={size}
									onClick={() => toggleSize(size)}
									className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
										sizes.includes(size)
											? 'bg-[#576F66] text-white border-[#576F66]'
											: 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
									}`}
								>
									{size}
								</button>
							))}
						</div>
						{sizes.length > 0 && (
							<p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
								{sizes.length} taille{sizes.length > 1 ? 's' : ''} sélectionnée{sizes.length > 1 ? 's' : ''}
							</p>
						)}
					</div>

					{/* Prix */}
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Prix (€)
						</label>
						<div className="grid grid-cols-2 gap-3">
							<div>
								<input 
									className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#576F66] focus:border-transparent" 
									type="number" 
									placeholder="Min" 
									value={min} 
									onChange={(e) => update('min', e.target.value)} 
								/>
							</div>
							<div>
								<input 
									className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#576F66] focus:border-transparent" 
									type="number" 
									placeholder="Max" 
									value={max} 
									onChange={(e) => update('max', e.target.value)} 
								/>
							</div>
						</div>
					</div>

					{/* Tags de filtres actifs */}
					{hasActiveFilters && (
						<div className="pt-4 border-t border-gray-200 dark:border-gray-700">
							<p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filtres actifs :</p>
							<div className="flex flex-wrap gap-2">
								{brand && (
									<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
										Marque: {brand}
										<button onClick={() => update('brand', '')} className="ml-1 hover:text-green-600">
											×
										</button>
									</span>
								)}
								{category && (
									<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
										Catégorie: {category}
										<button onClick={() => update('category', '')} className="ml-1 hover:text-purple-600">
											×
										</button>
									</span>
								)}
								{sizes.length > 0 && (
									<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
										Tailles: {sizes.join(', ')}
										<button onClick={() => update('size', '')} className="ml-1 hover:text-yellow-600">
											×
										</button>
									</span>
								)}
								{(min || max) && (
									<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
										Prix: {min || '0'}€ - {max || '∞'}€
										<button onClick={() => { update('min', ''); update('max', ''); }} className="ml-1 hover:text-red-600">
											×
										</button>
									</span>
								)}
							</div>
						</div>
					)}
				</div>
			</aside>
		</>
	);
}
