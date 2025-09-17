import Link from 'next/link';
import Image from 'next/image';
import type { Product } from "../lib/products";

// Fonction pour déterminer le statut de stock
function getStockStatus(stock: number): { text: string; color: string; bgColor: string } {
	if (stock === 0) {
		return { text: 'Rupture', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/20' };
	} else if (stock <= 5) {
		return { text: 'Bientôt en rupture', color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/20' };
	} else if (stock <= 45) {
		return { text: 'Stock limité', color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/20' };
	} else {
		return { text: 'Disponible', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/20' };
	}
}

// Composant de pagination
function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
	if (totalPages <= 1) return null;

	const pages = [];
	const maxVisiblePages = 5;
	
	// Calculer les pages à afficher
	let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
	let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
	
	if (endPage - startPage + 1 < maxVisiblePages) {
		startPage = Math.max(1, endPage - maxVisiblePages + 1);
	}

	for (let i = startPage; i <= endPage; i++) {
		pages.push(i);
	}

	return (
		<div className="flex items-center justify-center space-x-2 mt-8">
			{/* Bouton précédent */}
			{currentPage > 1 && (
				<Link
					href={`?page=${currentPage - 1}`}
					className="px-3 py-2 text-sm font-medium text-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
				>
					Précédent
				</Link>
			)}

			{/* Pages */}
			{pages.map((page) => (
				<Link
					key={page}
					href={`?page=${page}`}
					className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
						page === currentPage
							? 'bg-blue-600 text-white'
							: 'text-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
					}`}
				>
					{page}
				</Link>
			))}

			{/* Bouton suivant */}
			{currentPage < totalPages && (
				<Link
					href={`?page=${currentPage + 1}`}
					className="px-3 py-2 text-sm font-medium text-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
				>
					Suivant
				</Link>
			)}
		</div>
	);
}

export default function ProductsGrid({ 
	products, 
	totalProducts, 
	currentPage, 
	totalPages 
}: { 
	products: Product[];
	totalProducts: number;
	currentPage: number;
	totalPages: number;
}) {
	return (
		<>
			{/* Grille de produits */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{products.map((product) => {					
					return (
						<Link 
							key={product.id} 
							href={`/products/${product.slug}`} 
							className="group block bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
						>
							{/* Image du produit */}
							<div className="relative aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
								<Image 
									src={product.images[0] || '/placeholder.png'} 
									alt={product.title} 
									fill 
									className="object-cover group-hover:scale-105 transition-transform duration-300" 
								/>
								
								{/* Badge de statut de stock */}
								<div className="absolute top-3 right-3">
									<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#576F66] text-white">
										{product.brand}
									</span>
								</div>
							</div>
							
							{/* Informations du produit - SIMPLIFIÉES */}
							<div className="p-4">
								{/* Marque */}
								<div className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">
									{product.title}
								</div>
								
								{/* Prix */}
								<div className="text-lg font-bold text-gray-900 dark:text-white">
									{product.price.toFixed(2)} €
								</div>
							</div>
						</Link>
					);
				})}
			</div>

			{/* Message si aucun produit */}
			{products.length === 0 && (
				<div className="text-center py-12">
					<svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33M15 6.75a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
					<h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun produit trouvé</h3>
					<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
						Essayez de modifier vos filtres pour voir plus de résultats.
					</p>
				</div>
			)}

			{/* Pagination */}
			<Pagination currentPage={currentPage} totalPages={totalPages} />
		</>
	);
}
