'use client';

import { useState, useEffect } from 'react';
import { useCart } from '../lib/cart';
import { useAuth } from '../lib/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createOrder, createOrGetClient, calculateShippingCost, applyPromoCode } from '../lib/api/client-orders';

interface PromoCode {
  code: string;
  type: string;
  value: number;
  description: string;
  minimumAmount: number;
  isShipping: boolean;
}

export default function CheckoutPage() {
	const { state, totalItems, totalPrice, clear } = useCart();
	const { user, isLoading: authLoading } = useAuth();
	const router = useRouter();
	const [isProcessing, setIsProcessing] = useState(false);
	const [currentStep, setCurrentStep] = useState(1);
	const [shippingCost, setShippingCost] = useState(9.99);
	const [promoDiscount, setPromoDiscount] = useState(0);
	const [promoCode, setPromoCode] = useState('');
	const [promoError, setPromoError] = useState('');
	const [isValidatingPromo, setIsValidatingPromo] = useState(false);
	const [availablePromoCodes, setAvailablePromoCodes] = useState<PromoCode[]>([]);
	const [isLoadingPromoCodes, setIsLoadingPromoCodes] = useState(true);
	const [appliedPromoType, setAppliedPromoType] = useState<string>('');

	// États du formulaire
	const [formData, setFormData] = useState({
		// Informations personnelles
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		
		// Adresse de livraison (champs séparés)
		street: '',
		city: '',
		postalCode: '',
		country: 'France',
		
		// Méthode de paiement
		paymentMethod: 'card',
		cardNumber: '',
		expiryDate: '',
		cvv: '',
		cardName: '',
	});

	// États de validation
	const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

	// Calculer le total final
	const finalTotal = totalPrice + shippingCost - promoDiscount;

	// Charger les codes promo disponibles
	useEffect(() => {
		const loadPromoCodes = async () => {
			try {
				const response = await fetch('/api/promo-codes/list');
				if (response.ok) {
					const data = await response.json();
					setAvailablePromoCodes(data.codes || []);
				}
			} catch (error) {
				console.error('Erreur chargement codes promo:', error);
			} finally {
				setIsLoadingPromoCodes(false);
			}
		};

		loadPromoCodes();
	}, []);

	// Mettre à jour les frais de livraison quand le pays change
	useEffect(() => {
		const cost = calculateShippingCost(formData.country, totalPrice);
		setShippingCost(cost);
	}, [formData.country, totalPrice]);

	// Rediriger si pas connecté
	useEffect(() => {
		if (!authLoading && !user) {
			router.push('/login?redirect=/checkout');
		}
	}, [user, authLoading, router]);

	// Pré-remplir les informations utilisateur
	useEffect(() => {
		if (user) {
			setFormData(prev => ({
				...prev,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				phone: user.phone || '',
			}));
		}
	}, [user]);

	// Fonctions de validation
	const validateEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const validatePhone = (phone: string): boolean => {
		const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
		return phoneRegex.test(phone);
	};

	const validateCardNumber = (cardNumber: string): boolean => {
		const cleanNumber = cardNumber.replace(/\s/g, '');
		return /^\d{13,19}$/.test(cleanNumber);
	};

	const validateExpiryDate = (expiryDate: string): boolean => {
		const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
		if (!regex.test(expiryDate)) return false;
		
		const [month, year] = expiryDate.split('/');
		const now = new Date();
		const currentYear = now.getFullYear() % 100;
		const currentMonth = now.getMonth() + 1;
		
		const expYear = parseInt(year);
		const expMonth = parseInt(month);
		
		return expYear > currentYear || (expYear === currentYear && expMonth >= currentMonth);
	};

	const validateCVV = (cvv: string): boolean => {
		return /^\d{3,4}$/.test(cvv);
	};

	const validatePostalCode = (postalCode: string, country: string): boolean => {
		switch (country) {
			case 'France':
				return /^\d{5}$/.test(postalCode);
			case 'Belgique':
				return /^\d{4}$/.test(postalCode);
			case 'Suisse':
				return /^\d{4}$/.test(postalCode);
			default:
				return postalCode.length >= 3;
		}
	};

	const validateStep = (step: number): boolean => {
		const errors: {[key: string]: string} = {};

		if (step === 1) {
			if (!formData.firstName.trim()) errors.firstName = 'Le prénom est obligatoire';
			if (!formData.lastName.trim()) errors.lastName = 'Le nom est obligatoire';
			if (!formData.email.trim()) {
				errors.email = 'L\'email est obligatoire';
			} else if (!validateEmail(formData.email)) {
				errors.email = 'Format d\'email invalide';
			}
			if (formData.phone && !validatePhone(formData.phone)) {
				errors.phone = 'Format de téléphone invalide';
			}
		}

		if (step === 2) {
			if (!formData.street.trim()) errors.street = 'La rue est obligatoire';
			if (!formData.city.trim()) errors.city = 'La ville est obligatoire';
			if (!formData.postalCode.trim()) {
				errors.postalCode = 'Le code postal est obligatoire';
			} else if (!validatePostalCode(formData.postalCode, formData.country)) {
				errors.postalCode = 'Format de code postal invalide pour ce pays';
			}
			if (!formData.country) errors.country = 'Le pays est obligatoire';
		}

		if (step === 3) {
			if (!formData.cardName.trim()) errors.cardName = 'Le nom sur la carte est obligatoire';
			if (!formData.cardNumber.trim()) {
				errors.cardNumber = 'Le numéro de carte est obligatoire';
			} else if (!validateCardNumber(formData.cardNumber)) {
				errors.cardNumber = 'Format de carte invalide';
			}
			if (!formData.expiryDate.trim()) {
				errors.expiryDate = 'La date d\'expiration est obligatoire';
			} else if (!validateExpiryDate(formData.expiryDate)) {
				errors.expiryDate = 'Date d\'expiration invalide ou expirée';
			}
			if (!formData.cvv.trim()) {
				errors.cvv = 'Le CVV est obligatoire';
			} else if (!validateCVV(formData.cvv)) {
				errors.cvv = 'Format de CVV invalide';
			}
		}

		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleInputChange = (field: string, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }));
		
		// Effacer l'erreur du champ modifié
		if (formErrors[field]) {
			setFormErrors(prev => {
				const newErrors = { ...prev };
				delete newErrors[field];
				return newErrors;
			});
		}
	};

	const handlePromoCodeSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!promoCode.trim()) return;

		setIsValidatingPromo(true);
		setPromoError('');

		try {
			const result = await applyPromoCode(promoCode, totalPrice);
			setPromoDiscount(result.discount);
			setAppliedPromoType(result.type);
			
			// Gérer les frais de livraison selon le type de code promo
			if (result.type === 'shipping') {
				// Code de livraison gratuite
				setShippingCost(0);
			} else {
				// Code promo normal - remettre les frais de livraison à la normale
				const normalShippingCost = calculateShippingCost(formData.country, totalPrice);
				setShippingCost(normalShippingCost);
			}
			
			setPromoError('');
		} catch (error: unknown) {
			setPromoError(error.message);
			setPromoDiscount(0);
			setAppliedPromoType('');
			// Remettre les frais de livraison normaux en cas d'erreur
			const normalShippingCost = calculateShippingCost(formData.country, totalPrice);
			setShippingCost(normalShippingCost);
		} finally {
			setIsValidatingPromo(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		// Valider toutes les étapes
		if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
			alert('Veuillez corriger les erreurs dans le formulaire');
			return;
		}

		setIsProcessing(true);

		try {
			// 1. Créer ou récupérer le client
			const clientId = await createOrGetClient({
				firstName: formData.firstName,
				lastName: formData.lastName,
				email: formData.email,
				phone: formData.phone,
			});

			// 2. Préparer les données de commande
			const orderData = {
				clientId,
				items: state.items.map(item => ({
					productId: item.productId, // ID Airtable
					title: item.title, // Titre du produit
					image: item.image, // Image du produit
					quantity: item.quantity,
					size: item.size,
					price: item.price,
				})),
				shippingAddress: {
					street: formData.street,
					city: formData.city,
					postalCode: formData.postalCode,
					country: formData.country,
				},
				promoCode: promoCode || undefined,
				paymentMethod: formData.paymentMethod,
			};

			// 3. Créer la commande
			const { orderId, orderNumber } = await createOrder(orderData);

			// 4. Vider le panier et rediriger
			clear();
			router.push(`/order-confirmation?orderId=${orderId}&orderNumber=${orderNumber}`);
		} catch (error: unknown) {
			alert('Erreur lors de la création de la commande: ' + error.message);
		} finally {
			setIsProcessing(false);
		}
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
					<div className="text-center pt-12">
						<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
							Votre panier est vide
						</h1>
						<p className="text-gray-600 dark:text-gray-400 mb-8">
							Ajoutez des articles à votre panier pour passer commande
						</p>
						<button
							onClick={() => router.push('/products')}
							className="bg-[#576F66] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#34433D] transition-colors"
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
			<div className="max-w-7xl mx-auto px-4 py-6 sm:py-12">
				{/* Header */}
				<div className="mb-6 sm:mb-8 pt-6 sm:pt-12">
					<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
						Finaliser la commande
					</h1>
					<p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
						Complétez votre commande en quelques étapes
					</p>
				</div>

				{/* Étapes de commande - Version responsive */}
				<div className="mb-6 sm:mb-8">
					{/* Version mobile - Timeline verticale */}
					<div className="block sm:hidden">
						<div className="space-y-4">
							{steps.map((step, stepIdx) => (
								<div key={step.id} className="flex items-center">
									<div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
										currentStep >= step.id
											? 'bg-[#576F66] text-white'
											: 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
									}`}>
										{step.id}
									</div>
									<div className="ml-4">
										<p className={`text-sm font-medium ${
											currentStep >= step.id
												? 'text-[#576F66] dark:text-[#576F66]'
												: 'text-gray-500 dark:text-gray-400'
										}`}>
											{step.name}
										</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											{step.description}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Version desktop - Timeline horizontale */}
					<nav className="hidden sm:flex items-center justify-center">
						<ol className="flex items-center space-x-4 lg:space-x-8">
							{steps.map((step, stepIdx) => (
								<li key={step.id} className="flex items-center">
									<div className="flex items-center">
										<div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
											currentStep >= step.id
												? 'bg-[#576F66] text-white'
												: 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
										}`}>
											{step.id}
										</div>
										<div className="ml-4">
											<p className={`text-sm font-medium ${
												currentStep >= step.id
													? 'text-[#576F66] dark:text-[#576F66]'
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
										<div className="ml-4 lg:ml-8 w-8 lg:w-16 h-0.5 bg-gray-200 dark:bg-gray-700" />
									)}
								</li>
							))}
						</ol>
					</nav>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 lg:gap-8">
					{/* Formulaire de commande */}
					<form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
						{/* Étape 1: Informations personnelles */}
						{currentStep === 1 && (
							<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
								<h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
									Informations personnelles
								</h2>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											Prénom *
										</label>
										<input
											type="text"
											required
											value={formData.firstName}
											onChange={(e) => handleInputChange('firstName', e.target.value)}
											className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#576F66] focus:border-transparent ${
												formErrors.firstName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
											}`}
										/>
										{formErrors.firstName && (
											<p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>
										)}
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
											className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#576F66] focus:border-transparent ${
												formErrors.lastName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
											}`}
										/>
										{formErrors.lastName && (
											<p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>
										)}
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
											className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#576F66] focus:border-transparent ${
												formErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
											}`}
										/>
										{formErrors.email && (
											<p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
										)}
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											Téléphone
										</label>
										<input
											type="tel"
											value={formData.phone}
											onChange={(e) => handleInputChange('phone', e.target.value)}
											className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#576F66] focus:border-transparent ${
												formErrors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
											}`}
										/>
										{formErrors.phone && (
											<p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
										)}
									</div>
								</div>
							</div>
						)}

						{/* Étape 2: Adresse de livraison */}
						{currentStep === 2 && (
							<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
								<h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
									Adresse de livraison
								</h2>
								<div className="space-y-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											Rue et numéro *
										</label>
										<input
											type="text"
											required
											value={formData.street}
											onChange={(e) => handleInputChange('street', e.target.value)}
											placeholder="123 Rue de la Paix"
											className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#576F66] focus:border-transparent ${
												formErrors.street ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
											}`}
										/>
										{formErrors.street && (
											<p className="text-red-500 text-sm mt-1">{formErrors.street}</p>
										)}
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
												Ville *
											</label>
											<input
												type="text"
												required
												value={formData.city}
												onChange={(e) => handleInputChange('city', e.target.value)}
												placeholder="Paris"
												className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#576F66] focus:border-transparent ${
													formErrors.city ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
												}`}
											/>
											{formErrors.city && (
												<p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
											)}
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
												placeholder="75001"
												className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#576F66] focus:border-transparent ${
													formErrors.postalCode ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
												}`}
											/>
											{formErrors.postalCode && (
												<p className="text-red-500 text-sm mt-1">{formErrors.postalCode}</p>
											)}
										</div>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											Pays *
										</label>
										<select
											value={formData.country}
											onChange={(e) => handleInputChange('country', e.target.value)}
											className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#576F66] focus:border-transparent ${
												formErrors.country ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
											}`}
										>
											<option value="France">France</option>
											<option value="Belgique">Belgique</option>
											<option value="Suisse">Suisse</option>
											<option value="Autre">Autre</option>
										</select>
										{formErrors.country && (
											<p className="text-red-500 text-sm mt-1">{formErrors.country}</p>
										)}
									</div>
									{/* Affichage des frais de livraison */}
									<div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
										<p className="text-sm text-green-800 dark:text-green-200">
											<strong>Frais de livraison :</strong> {shippingCost.toFixed(2)} €
											{formData.country === 'France' && totalPrice >= 125 && (
												<span className="text-green-600 dark:text-green-400 ml-2">(Gratuite dès 125€)</span>
											)}
											{appliedPromoType === 'shipping' && (
												<span className="text-green-600 dark:text-green-400 ml-2">(Code promo appliqué)</span>
											)}
										</p>
									</div>
								</div>
							</div>
						)}

						{/* Étape 3: Paiement */}
						{currentStep === 3 && (
							<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
								<h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
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
											className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#576F66] focus:border-transparent ${
												formErrors.cardName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
											}`}
										/>
										{formErrors.cardName && (
											<p className="text-red-500 text-sm mt-1">{formErrors.cardName}</p>
										)}
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
											className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#576F66] focus:border-transparent ${
												formErrors.cardNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
											}`}
										/>
										{formErrors.cardNumber && (
											<p className="text-red-500 text-sm mt-1">{formErrors.cardNumber}</p>
										)}
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
												className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#576F66] focus:border-transparent ${
													formErrors.expiryDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
												}`}
											/>
											{formErrors.expiryDate && (
												<p className="text-red-500 text-sm mt-1">{formErrors.expiryDate}</p>
											)}
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
												className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#576F66] focus:border-transparent ${
													formErrors.cvv ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
												}`}
											/>
											{formErrors.cvv && (
												<p className="text-red-500 text-sm mt-1">{formErrors.cvv}</p>
											)}
										</div>
									</div>
								</div>
							</div>
						)}

						{/* Étape 4: Confirmation */}
						{currentStep === 4 && (
							<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
								<h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
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
											{formData.street}, {formData.postalCode} {formData.city}, {formData.country}
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
						<div className="flex flex-col sm:flex-row justify-between gap-4">
							{currentStep > 1 && (
								<button
									type="button"
									onClick={() => setCurrentStep(currentStep - 1)}
									className="w-full sm:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
								>
									Précédent
								</button>
							)}
							
							{currentStep < 4 ? (
								<button
									type="button"
									onClick={() => {
										if (validateStep(currentStep)) {
											setCurrentStep(currentStep + 1);
										}
									}}
									className="w-full sm:w-auto px-6 py-3 bg-[#576F66] text-white rounded-lg hover:bg-[#34433D] transition-colors"
								>
									Suivant
								</button>
							) : (
								<button
									type="submit"
									disabled={isProcessing}
									className="w-full sm:w-auto px-8 py-3 bg-[#576F66] text-white rounded-lg hover:bg-[#34433D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isProcessing ? 'Traitement...' : 'Confirmer la commande'}
								</button>
							)}
						</div>
					</form>

					{/* Récapitulatif de la commande */}
					<aside className="lg:sticky lg:top-8 h-max">
						<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
							<h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
								Votre commande
							</h2>

							{/* Code promotionnel */}
							<div className="mb-4 sm:mb-6">
								<form onSubmit={handlePromoCodeSubmit} className="flex gap-2">
									<input
										type="text"
										value={promoCode}
										onChange={(e) => setPromoCode(e.target.value)}
										placeholder="Code promo"
										className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#576F66] focus:border-transparent"
									/>
									<button
										type="submit"
										disabled={isValidatingPromo || !promoCode.trim()}
										className="px-4 py-2 bg-[#576F66] text-white rounded-lg hover:bg-[#34433D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
									>
										{isValidatingPromo ? '...' : 'Appliquer'}
									</button>
								</form>
								{promoError && (
									<p className="text-red-600 dark:text-red-400 text-sm mt-2">{promoError}</p>
								)}
								{(promoDiscount > 0 || appliedPromoType === 'shipping') && (
									<p className="text-green-600 dark:text-green-400 text-sm mt-2">
										{appliedPromoType === 'shipping' 
											? 'Livraison gratuite appliquée !' 
											: `Réduction appliquée : -${promoDiscount.toFixed(2)} €`
										}
									</p>
								)}
								
								{/* Codes promo disponibles */}
								{!isLoadingPromoCodes && availablePromoCodes.length > 0 && (
									<div className="mt-4">
										<p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
											Codes disponibles :
										</p>
										<div className="space-y-2">
											{availablePromoCodes.slice(0, 3).map((code, index) => (
												<div key={index} className="text-xs text-gray-500 dark:text-gray-400">
													<span className="font-medium">{code.code}</span>
													{code.description && (
														<span className="ml-1">- {code.description}</span>
													)}
													{code.minimumAmount > 0 && (
														<span className="ml-1 text-gray-400">
															(dès {code.minimumAmount}€)
														</span>
													)}
												</div>
											))}
										</div>
									</div>
								)}
							</div>

							{/* Articles */}
							<div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
								{state.items.map((item) => (
									<div key={`${item.productId}-${item.size ?? 'any'}`} className="flex items-center gap-3">
										<div className="relative h-12 w-12 sm:h-16 sm:w-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
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
							<div className="space-y-2 sm:space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
								<div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
									<span>Sous-total</span>
									<span>{totalPrice.toFixed(2)} €</span>
								</div>
								<div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
									<span>Livraison</span>
									<span className={shippingCost === 0 ? 'text-green-600 dark:text-green-400' : ''}>
										{shippingCost === 0 ? 'Gratuite' : `${shippingCost.toFixed(2)} €`}
									</span>
								</div>
								{promoDiscount > 0 && (
									<div className="flex justify-between text-green-600 dark:text-green-400 text-sm">
										<span>Réduction</span>
										<span>-{promoDiscount.toFixed(2)} €</span>
									</div>
								)}
								<div className="flex justify-between text-base sm:text-lg font-bold text-gray-900 dark:text-white">
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
