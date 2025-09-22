'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '../lib/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface OrderItem {
  id: string;
  productId: string | string[];
  productName: string;
  quantity: number;
  size: number | null;
  unitPrice: number;
  totalPrice: number;
  status: string;
  brand: string;
  image: string | null;
  currentPrice: number;
}

interface TrackingStep {
  name: string;
  completed: boolean;
  date: string | null;
}

interface OrderTrackingInfo {
  orderId: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  orderDate: string;
  estimatedDelivery: string;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    full: string;
  };
  paymentMethod: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  promoCode: string;
  items: OrderItem[];
  client: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  trackingSteps: TrackingStep[];
}

export default function OrderTrackingPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [trackingInfo, setTrackingInfo] = useState<OrderTrackingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Récupérer le numéro de commande depuis l'URL
  const orderNumber = searchParams.get('orderNumber');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/order-tracking');
    }
  }, [user, authLoading, router]);

  // Charger automatiquement les informations de la commande si le numéro est fourni
  useEffect(() => {
    if (orderNumber && user) {
      loadTrackingInfo(orderNumber);
    }
  }, [orderNumber, user]);

  const loadTrackingInfo = async (orderNum: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(orderNum)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la recherche');
      }

      const data = await response.json();
      setTrackingInfo(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setTrackingInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#576F66] mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Livrée':
        return 'text-green-600 dark:text-green-400';
      case 'Expédiée':
        return 'text-[#576F66] dark:text-blue-400';
      case 'En préparation':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'Confirmée':
        return 'text-purple-600 dark:text-purple-400';
      case 'En attente':
        return 'text-gray-600 dark:text-gray-400';
      case 'Annulée':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Livrée':
        return '✅';
      case 'Expédiée':
        return '🚚';
      case 'En préparation':
        return '📦';
      case 'Confirmée':
        return '✓';
      case 'En attente':
        return '⏳';
      case 'Annulée':
        return '❌';
      default:
        return '📋';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 pt-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Suivi de commande
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Consultez le statut de votre commande en temps réel
          </p>
          <div className="mt-4">
            <Link 
              href="/account"
              className="text-[#576F66] hover:text-[#34433D] font-medium"
            >
              ← Retour à mon compte
            </Link>
          </div>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-8">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 dark:text-red-200 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Chargement */}
        {isLoading && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#576F66] mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Chargement des informations de la commande...</p>
            </div>
          </div>
        )}

        {/* Informations de suivi */}
        {trackingInfo && (
          <div className="space-y-8">
            {/* Timeline des étapes - EN HAUT */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Suivi de votre commande
                </h3>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Commande #{trackingInfo.orderNumber}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Passée le {new Date(trackingInfo.orderDate).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              
              {/* Date de livraison prévue - MISE EN ÉVIDENCE */}
              {trackingInfo.estimatedDelivery && (
                <div className="mb-8 p-4 bg-gradient-to-r from-[#576F66] to-[#34433D] rounded-lg text-white">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-lg">Livraison prévue</p>
                      <p className="text-sm opacity-90">
                        {new Date(trackingInfo.estimatedDelivery).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="relative">
                {/* Ligne de progression */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                
                <div className="space-y-8">
                  {(trackingInfo.trackingSteps || []).map((step, index) => (
                    <div key={index} className="relative flex items-start">
                      {/* Cercle de statut */}
                      <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed 
                          ? "bg-[#576F66] text-white" 
                          : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      }`}>
                        {step.completed ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      
                      {/* Contenu de l'étape */}
                      <div className="ml-6 flex-1">
                        <h4 className={`text-lg font-medium ${
                          step.completed 
                            ? "text-gray-900 dark:text-white" 
                            : "text-gray-500 dark:text-gray-400"
                        }`}>
                          {step.name}
                        </h4>
                        {step.date && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(step.date).toLocaleDateString("fr-FR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric"
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Détails de la commande */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Articles commandés */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Articles commandés ({trackingInfo.items?.length || 0})
                </h3>
                {trackingInfo.items?.length > 0 ? (
                  <div className="space-y-4">
                    {trackingInfo.items?.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.productName}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs text-gray-500">IMG</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.productName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                          {item.brand} • Taille {item.size || 'N/A'} • Quantité {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.totalPrice.toFixed(2)} €
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      Aucun article trouvé pour cette commande
                    </p>
                  </div>
                )}
              </div>

              {/* Informations de livraison et paiement */}
              <div className="space-y-6">
                {/* Adresse de livraison */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Adresse de livraison
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium">{trackingInfo.shippingAddress?.street || "N/A"}</p>
                    <p>{trackingInfo.shippingAddress?.postalCode || ""} {trackingInfo.shippingAddress?.city || ""}</p>
                    <p className="font-medium">{trackingInfo.shippingAddress?.country || ""}</p>
                  </div>
                </div>

                {/* Informations de paiement */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Paiement
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Méthode:</span>
                      <span className="text-gray-900 dark:text-white">{trackingInfo.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Statut:</span>
                      <span className={`font-medium ${trackingInfo.paymentStatus === 'Payé' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                        {trackingInfo.paymentStatus}
                      </span>
                    </div>
                    {trackingInfo.promoCode && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Code promo:</span>
                        <span className="text-gray-900 dark:text-white">{trackingInfo.promoCode}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Récapitulatif financier */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Récapitulatif
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Sous-total:</span>
                  <span className="text-gray-900 dark:text-white">{trackingInfo.subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Frais de livraison:</span>
                  <span className="text-gray-900 dark:text-white">
                    {trackingInfo.shippingCost === 0 ? 'Gratuite' : `${trackingInfo.shippingCost.toFixed(2)} €`}
                  </span>
                </div>
                {trackingInfo.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Réduction:</span>
                    <span className="text-green-600 dark:text-green-400">-{trackingInfo.discount.toFixed(2)} €</span>
                  </div>
                )}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-900 dark:text-white">Total:</span>
                    <span className="text-gray-900 dark:text-white">{trackingInfo.total.toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations de contact */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-[#576F66] dark:text-blue-400 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        {/* Si pas de numéro de commande dans l'URL */}
        {!orderNumber && !isLoading && !trackingInfo && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Aucune commande sélectionnée
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Veuillez sélectionner une commande depuis votre compte pour voir son suivi.
              </p>
              <Link 
                href="/account"
                className="inline-flex items-center rounded-md bg-[#576F66] text-white px-4 py-2 font-medium hover:bg-[#34433D] transition-colors"
              >
                Retour à mon compte
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
