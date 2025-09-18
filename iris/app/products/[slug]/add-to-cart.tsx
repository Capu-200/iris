'use client';

import { useState } from 'react';
import type { Product } from '../../lib/products';
import { useCart } from '../../lib/cart';

export default function AddToCart({ product }: { product: Product }) {
	const { addItem } = useCart();
	const [size, setSize] = useState<number | undefined>(product.sizesAvailable[0]);
	const [qty, setQty] = useState<number>(1);
	const [isAdding, setIsAdding] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);

	const handleAddToCart = async () => {
		if (!size || product.stock === 0) return;
		
		setIsAdding(true);
		
		// Simuler un délai pour l'animation
		await new Promise(resolve => setTimeout(resolve, 500));
		
		addItem({ product, quantity: qty, size });
		
		setIsAdding(false);
		setShowSuccess(true);
		
		// Masquer le message de succès après 2 secondes
		setTimeout(() => {
			setShowSuccess(false);
		}, 2000);
	};

	return (
		<div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
			{/* Sélection de la taille */}
			<div>
				<label className="block text-base font-semibold text-gray-900 dark:text-white mb-3">
					Pointure
				</label>
				<div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
					{product.sizesAvailable.map((s) => (
						<button
							key={s}
							onClick={() => setSize(s)}
							className={`
								relative px-4 py-3 rounded-lg border-2 font-medium transition-all duration-200
								${size === s 
									? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black shadow-lg scale-105' 
									: 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md'
								}
							`}
							type="button"
						>
							{s}
						</button>
					))}
				</div>
			</div>

			{/* Sélection de la quantité */}
			<div>
				<label className="block text-base font-semibold text-gray-900 dark:text-white mb-3">
					Quantité
				</label>
				<div className="flex items-center space-x-3">
					<button
						onClick={() => setQty(Math.max(1, qty - 1))}
						className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-center font-medium"
						type="button"
					>
						−
					</button>
					<input 
						className="w-20 h-10 border border-gray-300 dark:border-gray-600 rounded-lg px-3 text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium" 
						type="text" 
						min={1} 
						max={product.stock}
						value={qty} 
						onChange={(e) => setQty(Math.max(1, Math.min(product.stock, Number(e.target.value))))} 
					/>
					<button
						onClick={() => setQty(Math.min(product.stock, qty + 1))}
						className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-center font-medium"
						type="button"
					>
						+
					</button>
				</div>
			</div>

			{/* Bouton d'action principal avec animation */}
			<div className="pt-4 relative">
				<button
					onClick={handleAddToCart}
					disabled={!size || product.stock === 0 || isAdding}
					className={`
						w-full px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg transform
						${isAdding 
							? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed scale-95' 
							: showSuccess
							? 'bg-green-600 hover:bg-green-700 text-white scale-105'
							: product.stock === 0
							? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
							: 'bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 hover:scale-[1.02]'
						}
						disabled:cursor-not-allowed
					`}
					type="button"
				>
					<div className="flex items-center justify-center space-x-2">
						{isAdding ? (
							<>
								<svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								<span>Ajout en cours...</span>
							</>
						) : showSuccess ? (
							<>
								<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
								</svg>
								<span>Ajouté au panier !</span>
							</>
						) : product.stock === 0 ? (
							'Rupture de stock'
						) : (
							<>
								<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
								</svg>
								<span>Ajouter au panier</span>
							</>
						)}
					</div>
				</button>

				{/* Animation de confirmation */}
				{showSuccess && (
					<div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-ping">
						<div className="w-4 h-4 bg-green-500 rounded-full"></div>
					</div>
				)}
			</div>

			{/* Informations de livraison */}
			<div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
				<div className="flex items-center space-x-3 text-sm">
					<svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
					</svg>
					<span className="text-gray-700 dark:text-gray-300">Livraison gratuite dès 75€</span>
				</div>
				<div className="flex items-center space-x-3 text-sm">
					<svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
					</svg>
					<span className="text-gray-700 dark:text-gray-300">Paiement sécurisé</span>
				</div>
				<div className="flex items-center space-x-3 text-sm">
					<svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
					</svg>
					<span className="text-gray-700 dark:text-gray-300">Retours gratuits sous 30 jours</span>
				</div>
			</div>
		</div>
	);
}
