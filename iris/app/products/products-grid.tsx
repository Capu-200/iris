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
							? 'bg-[#576F66] text-white'
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
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
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
