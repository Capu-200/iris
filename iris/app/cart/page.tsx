'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../lib/cart';
import { useState } from 'react';

export default function CartPage() {
	const { state, setQuantity, removeItem, totalItems, totalPrice, clear } = useCart();
	const [isRemoving, setIsRemoving] = useState<string | null>(null);

	const handleRemoveItem = async (productId: string, size?: number) => {
		const itemKey = `${productId}-${size ?? 'any'}`;
		setIsRemoving(itemKey);
		
		// Animation de suppression
		await new Promise(resolve => setTimeout(resolve, 300));
		
		removeItem(productId, size);
		setIsRemoving(null);
	};

	const handleQuantityChange = (productId: string, size: number | undefined, newQuantity: number) => {
		if (newQuantity <= 0) {
			handleRemoveItem(productId, size);
		} else {
			setQuantity(productId, newQuantity, size);
		}
	};

	const shippingCost = totalPrice >= 75 ? 0 : 9.99;
	const finalTotal = totalPrice + shippingCost;

	return (
		<main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
			<div className="max-w-7xl mx-auto px-4 py-12">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
						Mon Panier
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300">
						{totalItems} article{totalItems > 1 ? 's' : ''} dans votre panier
					</p>
				</div>

				{state.items.length === 0 ? (
					/* Panier vide */
					<div className="text-center py-16">
						<div className="max-w-md mx-auto">
							<svg className="mx-auto h-24 w-24 text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
							</svg>
							<h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
								Votre panier est vide
							</h2>
							<p className="text-gray-600 dark:text-gray-400 mb-8">
								Découvrez notre collection de sneakers premium
							</p>
							<Link 
								href="/products"
								className="inline-flex items-center px-6 py-3 bg-black text-white dark:bg-white dark:text-black rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
							>
								<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
								</svg>
								Voir les produits
							</Link>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
						{/* Articles du panier */}
						<section className="space-y-4">
							{state.items.map((item) => {
								const itemKey = `${item.productId}-${item.size ?? 'any'}`;
								const isRemovingItem = isRemoving === itemKey;
								
								return (
									<div 
										key={itemKey} 
										className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 ${
											isRemovingItem ? 'opacity-50 scale-95' : 'hover:shadow-md'
										}`}
									>
										<div className="flex items-start gap-6">
											{/* Image du produit */}
											<div className="relative h-24 w-24 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
												<Image 
													src={item.image || '/placeholder.png'} 
													alt={item.title} 
													fill 
													className="object-cover" 
												/>
											</div>

											{/* Informations du produit */}
											<div className="flex-1 min-w-0">
												<Link 
													href={`/products/${item.slug}`}
													className="block group"
												>
													<h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
														{item.title}
													</h3>
												</Link>
												
												<div className="mt-2 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
													<span>Pointure {item.size ?? 'Unique'}</span>
													<span>•</span>
													<span>{item.price.toFixed(2)} €</span>
												</div>

												{/* Contrôles de quantité */}
												<div className="mt-4 flex items-center gap-4">
													<div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
														<button
															onClick={() => handleQuantityChange(item.productId, item.size, item.quantity - 1)}
															className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
															disabled={isRemovingItem}
														>
															−
														</button>
														<input 
															className="w-16 h-10 text-center border-0 bg-transparent text-gray-900 dark:text-white font-medium" 
															type="number" 
															min={1} 
															value={item.quantity} 
															onChange={(e) => handleQuantityChange(item.productId, item.size, Math.max(1, Number(e.target.value)))}
															disabled={isRemovingItem}
														/>
														<button
															onClick={() => handleQuantityChange(item.productId, item.size, item.quantity + 1)}
															className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
															disabled={isRemovingItem}
														>
															+
														</button>
													</div>

													{/* Prix total pour cet article */}
													<div className="text-lg font-bold text-gray-900 dark:text-white">
														{(item.price * item.quantity).toFixed(2)} €
													</div>
												</div>
											</div>

											{/* Bouton de suppression */}
											<button
												onClick={() => handleRemoveItem(item.productId, item.size)}
												disabled={isRemovingItem}
												className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
											>
												<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
												</svg>
											</button>
										</div>
									</div>
								);
							})}

							{/* Actions du panier */}
							<div className="flex justify-between items-center pt-4">
								<Link 
									href="/products"
									className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
								>
									← Continuer mes achats
								</Link>
								<button
									onClick={clear}
									className="text-sm text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
								>
									Vider le panier
								</button>
							</div>
						</section>

						{/* Récapitulatif de commande */}
						<aside className="lg:sticky lg:top-8 h-max">
							<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
								<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
									Récapitulatif
								</h2>

								{/* Détail des prix */}
								<div className="space-y-3 mb-6">
									<div className="flex justify-between text-gray-600 dark:text-gray-400">
										<span>Sous-total ({totalItems} article{totalItems > 1 ? 's' : ''})</span>
										<span>{totalPrice.toFixed(2)} €</span>
									</div>
									
									<div className="flex justify-between text-gray-600 dark:text-gray-400">
										<span>Livraison</span>
										<span className={shippingCost === 0 ? 'text-green-600 dark:text-green-400' : ''}>
											{shippingCost === 0 ? 'Gratuite' : `${shippingCost.toFixed(2)} €`}
										</span>
									</div>

									{shippingCost > 0 && (
										<div className="text-sm text-blue-600 dark:text-blue-400">
											Ajoutez {(75 - totalPrice).toFixed(2)} € pour la livraison gratuite
										</div>
									)}

									<div className="border-t border-gray-200 dark:border-gray-700 pt-3">
										<div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
											<span>Total</span>
											<span>{finalTotal.toFixed(2)} €</span>
										</div>
									</div>
								</div>

								{/* Bouton de commande */}
								<Link 
									href="/checkout"
									className="w-full bg-black text-white dark:bg-white dark:text-black px-6 py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-center block shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
								>
									Passer la commande
								</Link>

								{/* Informations de sécurité */}
								<div className="mt-6 space-y-3 text-sm text-gray-500 dark:text-gray-400">
									<div className="flex items-center gap-2">
										<svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
										</svg>
										<span>Paiement sécurisé</span>
									</div>
									<div className="flex items-center gap-2">
										<svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
										</svg>
										<span>Livraison rapide</span>
									</div>
									<div className="flex items-center gap-2">
										<svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
										</svg>
										<span>Retours gratuits</span>
									</div>
								</div>
							</div>
						</aside>
					</div>
				)}
			</div>
		</main>
	);
}
