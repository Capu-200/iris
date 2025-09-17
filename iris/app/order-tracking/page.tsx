'use client';

import { useState } from 'react';

export default function OrderTrackingPage() {
	const [orderNumber, setOrderNumber] = useState('');
	const [trackingInfo, setTrackingInfo] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleTrackOrder = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!orderNumber.trim()) return;

		setIsLoading(true);
		
		// Simuler la recherche de commande
		await new Promise(resolve => setTimeout(resolve, 1500));
		
		// Simuler des données de suivi
		setTrackingInfo({
			orderNumber: orderNumber,
			status: 'En cours de préparation',
			estimatedDelivery: '2024-01-15',
			steps: [
				{ name: 'Commande confirmée', completed: true, date: '2024-01-10' },
				{ name: 'En cours de préparation', completed: true, date: '2024-01-11' },
				{ name: 'Expédiée', completed: false, date: null },
				{ name: 'En transit', completed: false, date: null },
				{ name: 'Livrée', completed: false, date: null },
			]
		});
		
		setIsLoading(false);
	};

	return (
		<main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
			<div className="max-w-4xl mx-auto px-4 py-12">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
						Suivi de commande
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300">
						Consultez le statut de votre commande en temps réel
					</p>
				</div>

				{/* Formulaire de recherche */}
				<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
					<form onSubmit={handleTrackOrder} className="max-w-md mx-auto">
						<div className="mb-6">
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Numéro de commande
							</label>
							<input
								type="text"
								value={orderNumber}
								onChange={(e) => setOrderNumber(e.target.value)}
								placeholder="Ex: CMD-ABC123XYZ"
								className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								required
							/>
						</div>
						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? 'Recherche...' : 'Suivre ma commande'}
						</button>
					</form>
				</div>

				{/* Informations de suivi */}
				{trackingInfo && (
					<div className="space-y-8">
						{/* Statut actuel */}
						<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
							<div className="text-center mb-6">
								<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
									Commande #{trackingInfo.orderNumber}
								</h2>
								<p className="text-lg text-blue-600 dark:text-blue-400 font-medium">
									{trackingInfo.status}
								</p>
								<p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
									Livraison prévue le {trackingInfo.estimatedDelivery}
								</p>
							</div>
						</div>

						{/* Timeline des étapes */}
						<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
							<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
								Historique de votre commande
							</h3>
							<div className="space-y-6">
								{trackingInfo.steps.map((step: any, index: number) => (
									<div key={index} className="flex items-start">
										<div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
											step.completed 
												? 'bg-green-100 dark:bg-green-900/20' 
												: 'bg-gray-100 dark:bg-gray-700'
										}`}>
											{step.completed ? (
												<svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
												</svg>
											) : (
												<span className={`text-sm font-medium ${
													step.completed 
														? 'text-green-600 dark:text-green-400' 
														: 'text-gray-400 dark:text-gray-500'
												}`}>
													{index + 1}
												</span>
											)}
										</div>
										<div className="ml-4 flex-1">
											<h4 className={`font-medium ${
												step.completed 
													? 'text-gray-900 dark:text-white' 
													: 'text-gray-500 dark:text-gray-400'
											}`}>
												{step.name}
											</h4>
											{step.date && (
												<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
													{step.date}
												</p>
											)}
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Informations de contact */}
						<div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
							<div className="flex items-start">
								<svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<div>
									<h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
										Questions sur votre commande ?
									</h3>
									<p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
										Notre service client est disponible pour vous aider
									</p>
									<div className="text-sm text-blue-800 dark:text-blue-200">
										<p>📞 +33 1 23 45 67 89</p>
										<p>✉️ service@iris-sneakers.com</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</main>
	);
}
