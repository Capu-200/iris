'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function OrderConfirmationPage() {
	const searchParams = useSearchParams();
	const [orderNumber, setOrderNumber] = useState('');
	const [orderId, setOrderId] = useState('');

	useEffect(() => {
		const orderNum = searchParams.get('orderNumber') || 'CMD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
		const orderIdParam = searchParams.get('orderId') || '';
		setOrderNumber(orderNum);
		setOrderId(orderIdParam);
	}, [searchParams]);

	return (
		<main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
			<div className="max-w-4xl mx-auto px-4 py-12">
				{/* Confirmation de commande */}
				<div className="text-center mb-12 pt-12">
					<div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
						<svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
						</svg>
					</div>
					<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
						Commande confirmée !
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
						Merci pour votre achat. Votre commande a été traitée avec succès.
					</p>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						Numéro de commande : <span className="font-mono font-semibold">{orderNumber}</span>
					</p>
				</div>

				{/* Informations de suivi */}
				<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
					<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
						Prochaines étapes
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="text-center">
							<div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
								<svg className="w-6 h-6 text-[#576F66] dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<h3 className="font-semibold text-gray-900 dark:text-white mb-2">Confirmation</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Vous recevrez un email de confirmation dans les prochaines minutes
							</p>
						</div>
						<div className="text-center">
							<div className="mx-auto w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-4">
								<svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
								</svg>
							</div>
							<h3 className="font-semibold text-gray-900 dark:text-white mb-2">Préparation</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Votre commande sera préparée et expédiée sous 24-48h
							</p>
						</div>
						<div className="text-center">
							<div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
								<svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
								</svg>
							</div>
							<h3 className="font-semibold text-gray-900 dark:text-white mb-2">Livraison</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Livraison prévue sous 2-5 jours ouvrés
							</p>
						</div>
					</div>
				</div>

				{/* Informations de contact */}
				<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
					<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
						Besoin d'aide ?
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<h3 className="font-medium text-gray-900 dark:text-white mb-2">Service client</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
								Notre équipe est là pour vous aider
							</p>
							<p className="text-sm text-gray-900 dark:text-white font-mono">
								+33 1 23 45 67 89
							</p>
							<p className="text-sm text-gray-900 dark:text-white">
								service@iris-sneakers.com
							</p>
						</div>
						<div>
							<h3 className="font-medium text-gray-900 dark:text-white mb-2">Suivi de commande</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
								Consultez le statut de votre commande
							</p>
							<Link 
								href="/order-tracking"
								className="inline-flex items-center text-sm text-[#576F66] hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
							>
								Suivre ma commande
								<svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
								</svg>
							</Link>
						</div>
					</div>
				</div>

				{/* Actions */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Link 
						href="/products"
						className="inline-flex items-center justify-center px-6 py-3 bg-black text-white dark:bg-white dark:text-black rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
					>
						<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
						</svg>
						Continuer mes achats
					</Link>
					<Link 
						href="/"
						className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
						</svg>
						Retour à l'accueil
					</Link>
				</div>
			</div>
		</main>
	);
}
