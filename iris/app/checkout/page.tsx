'use client';

import { useState } from 'react';
import { useCart } from '../lib/cart';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CheckoutPage() {
	const { state, totalItems, totalPrice, clear } = useCart();
	const router = useRouter();
	const [isProcessing, setIsProcessing] = useState(false);
	const [currentStep, setCurrentStep] = useState(1);

	// États du formulaire
	const [formData, setFormData] = useState({
		// Informations personnelles
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		
		// Adresse de livraison
		address: '',
		city: '',
		postalCode: '',
		country: 'France',
		
		// Adresse de facturation (optionnelle)
		sameAsDelivery: true,
		billingAddress: '',
		billingCity: '',
		billingPostalCode: '',
		billingCountry: 'France',
		
		// Méthode de livraison
		deliveryMethod: 'standard',
		
		// Méthode de paiement
		paymentMethod: 'card',
		cardNumber: '',
		expiryDate: '',
		cvv: '',
		cardName: '',
	});

	const shippingCost = totalPrice >= 75 ? 0 : 9.99;
	const finalTotal = totalPrice + shippingCost;

	const handleInputChange = (field: string, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsProcessing(true);

		// Simuler le traitement de la commande
		await new Promise(resolve => setTimeout(resolve, 2000));

		// Vider le panier et rediriger vers la confirmation
		clear();
		router.push('/order-confirmation');
	};

	const steps = [
		{ id: 1, name: 'Informations', description: 'Vos coordonnées' },
		{ id: 2, name: 'Livraison', description: 'Adresse de livraison' },
		{ id: 3, name: 'Paiement', description: 'Moyen de paiement' },
		{ id: 4, name: 'Confirmation', description: 'Récapitulatif' },
	];

	if (state.items.length === 0) {
		return (
			<main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
				<div className="max-w-7xl mx-auto px-4 py-12">
					<div className="text-center">
						<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
							Votre panier est vide
						</h1>
						<p className="text-gray-600 dark:text-gray-400 mb-8">
							Ajoutez des articles à votre panier pour passer commande
						</p>
						<button
							onClick={() => router.push('/products')}
							className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
						>
							Voir les produits
						</button>
					</div>
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
			<div className="max-w-7xl mx-auto px-4 py-12">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
						Finaliser la commande
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300">
						Complétez votre commande en quelques étapes
					</p>
				</div>

				{/* Étapes de commande */}
				<div className="mb-8">
					<nav className="flex items-center justify-center">
						<ol className="flex items-center space-x-8">
							{steps.map((step, stepIdx) => (
								<li key={step.id} className="flex items-center">
									<div className="flex items-center">
										<div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
											currentStep >= step.id
												? 'bg-blue-600 text-white'
												: 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
										}`}>
											{step.id}
										</div>
										<div className="ml-4">
											<p className={`text-sm font-medium ${
												currentStep >= step.id
													? 'text-blue-600 dark:text-blue-400'
													: 'text-gray-500 dark:text-gray-400'
											}`}>
												{step.name}
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												{step.description}
											</p>
										</div>
									</div>
									{stepIdx < steps.length - 1 && (
										<div className="ml-8 w-16 h-0.5 bg-gray-200 dark:bg-gray-700" />
									)}
								</li>
							))}
						</ol>
					</nav>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
					{/* Formulaire de commande */}
					<form onSubmit={handleSubmit} className="space-y-8">
						{/* Étape 1: Informations personnelles */}
						{currentStep === 1 && (
							<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
								<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
									Informations personnelles
								</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											Prénom *
										</label>
										<input
											type="text"
											required
											value={formData.firstName}
											onChange={(e) => handleInputChange('firstName', e.target.value)}
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											Nom *
										</label>
										<input
											type="text"
											required
											value={formData.lastName}
											onChange={(e) => handleInputChange('lastName', e.target.value)}
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											Email *
										</label>
										<input
											type="email"
											required
											value={formData.email}
											onChange={(e) => handleInputChange('email', e.target.value)}
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											Téléphone
										</label>
										<input
											type="tel"
											value={formData.phone}
											onChange={(e) => handleInputChange('phone', e.target.value)}
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</div>
								</div>
							</div>
						)}

						{/* Étape 2: Adresse de livraison */}
						{currentStep === 2 && (
							<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
								<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
									Adresse de livraison
								</h2>
								<div className="space-y-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											Adresse *
										</label>
										<input
											type="text"
											required
											value={formData.address}
											onChange={(e) => handleInputChange('address', e.target.value)}
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
												Ville *
											</label>
											<input
												type="text"
												required
												value={formData.city}
												onChange={(e) => handleInputChange('city', e.target.value)}
												className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
												Code postal *
											</label>
											<input
												type="text"
												required
												value={formData.postalCode}
												onChange={(e) => handleInputChange('postalCode', e.target.value)}
												className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
												Pays *
											</label>
											<select
												value={formData.country}
												onChange={(e) => handleInputChange('country', e.target.value)}
												className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											>
												<option value="France">France</option>
												<option value="Belgique">Belgique</option>
												<option value="Suisse">Suisse</option>
											</select>
										</div>
									</div>
								</div>
							</div>
						)}

						{/* Étape 3: Paiement */}
						{currentStep === 3 && (
							<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
								<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
									Moyen de paiement
								</h2>
								<div className="space-y-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											Nom sur la carte *
										</label>
										<input
											type="text"
											required
											value={formData.cardName}
											onChange={(e) => handleInputChange('cardName', e.target.value)}
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											Numéro de carte *
										</label>
										<input
											type="text"
											required
											placeholder="1234 5678 9012 3456"
											value={formData.cardNumber}
											onChange={(e) => handleInputChange('cardNumber', e.target.value)}
											className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
												Date d'expiration *
											</label>
											<input
												type="text"
												required
												placeholder="MM/AA"
												value={formData.expiryDate}
												onChange={(e) => handleInputChange('expiryDate', e.target.value)}
												className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
												CVV *
											</label>
											<input
												type="text"
												required
												placeholder="123"
												value={formData.cvv}
												onChange={(e) => handleInputChange('cvv', e.target.value)}
												className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											/>
										</div>
									</div>
								</div>
							</div>
						)}

						{/* Étape 4: Confirmation */}
						{currentStep === 4 && (
							<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
								<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
									Récapitulatif de votre commande
								</h2>
								<div className="space-y-4">
									<div>
										<h3 className="font-medium text-gray-900 dark:text-white mb-2">Informations personnelles</h3>
										<p className="text-sm text-gray-600 dark:text-gray-400">
											{formData.firstName} {formData.lastName}
										</p>
										<p className="text-sm text-gray-600 dark:text-gray-400">{formData.email}</p>
									</div>
									<div>
										<h3 className="font-medium text-gray-900 dark:text-white mb-2">Adresse de livraison</h3>
										<p className="text-sm text-gray-600 dark:text-gray-400">
											{formData.address}, {formData.postalCode} {formData.city}, {formData.country}
										</p>
									</div>
									<div>
										<h3 className="font-medium text-gray-900 dark:text-white mb-2">Paiement</h3>
										<p className="text-sm text-gray-600 dark:text-gray-400">
											Carte se terminant par {formData.cardNumber.slice(-4)}
										</p>
									</div>
								</div>
							</div>
						)}

						{/* Boutons de navigation */}
						<div className="flex justify-between">
							{currentStep > 1 && (
								<button
									type="button"
									onClick={() => setCurrentStep(currentStep - 1)}
									className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
								>
									Précédent
								</button>
							)}
							
							{currentStep < 4 ? (
								<button
									type="button"
									onClick={() => setCurrentStep(currentStep + 1)}
									className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
								>
									Suivant
								</button>
							) : (
								<button
									type="submit"
									disabled={isProcessing}
									className="px-8 py-3 bg-black text-white dark:bg-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isProcessing ? 'Traitement...' : 'Confirmer la commande'}
								</button>
							)}
						</div>
					</form>

					{/* Récapitulatif de la commande */}
					<aside className="lg:sticky lg:top-8 h-max">
						<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
							<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
								Votre commande
							</h2>

							{/* Articles */}
							<div className="space-y-4 mb-6">
								{state.items.map((item) => (
									<div key={`${item.productId}-${item.size ?? 'any'}`} className="flex items-center gap-3">
										<div className="relative h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
											<Image 
												src={item.image || '/placeholder.png'} 
												alt={item.title} 
												fill 
												className="object-cover" 
											/>
										</div>
										<div className="flex-1 min-w-0">
											<h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">
												{item.title}
											</h3>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												Taille {item.size} • Qté {item.quantity}
											</p>
										</div>
										<div className="text-sm font-medium text-gray-900 dark:text-white">
											{(item.price * item.quantity).toFixed(2)} €
										</div>
									</div>
								))}
							</div>

							{/* Total */}
							<div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
								<div className="flex justify-between text-gray-600 dark:text-gray-400">
									<span>Sous-total</span>
									<span>{totalPrice.toFixed(2)} €</span>
								</div>
								<div className="flex justify-between text-gray-600 dark:text-gray-400">
									<span>Livraison</span>
									<span className={shippingCost === 0 ? 'text-green-600 dark:text-green-400' : ''}>
										{shippingCost === 0 ? 'Gratuite' : `${shippingCost.toFixed(2)} €`}
									</span>
								</div>
								<div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
									<span>Total</span>
									<span>{finalTotal.toFixed(2)} €</span>
								</div>
							</div>
						</div>
					</aside>
				</div>
			</div>
		</main>
	);
}
