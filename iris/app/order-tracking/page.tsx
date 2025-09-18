'use client';

import { useState } from 'react';
import Image from 'next/image';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  size: number | null;
  unitPrice: number;
  totalPrice: number;
  status: string;
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
  const [orderNumber, setOrderNumber] = useState('');
  const [trackingInfo, setTrackingInfo] = useState<OrderTrackingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(orderNumber)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la recherche');
      }

      const data = await response.json();
      setTrackingInfo(data);
    } catch (err: any) {
      setError(err.message);
      setTrackingInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

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
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#576F66] focus:border-transparent"
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

        {/* Informations de suivi */}
        {trackingInfo && (
          <div className="space-y-8">
            {/* Statut actuel */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Commande #{trackingInfo.orderNumber}
                </h2>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl">{getStatusIcon(trackingInfo.status)}</span>
                  <p className={`text-lg font-medium ${getStatusColor(trackingInfo.status)}`}>
                    {trackingInfo.status}
                  </p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Commande passée le {new Date(trackingInfo.orderDate).toLocaleDateString('fr-FR')}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Livraison prévue le {new Date(trackingInfo.estimatedDelivery).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>

            {/* Détails de la commande */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Articles commandés */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Articles commandés ({trackingInfo.items.length})
                </h3>
                {trackingInfo.items.length > 0 ? (
                  <div className="space-y-4">
                    {trackingInfo.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-gray-500">IMG</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            Produit #{item.productId}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Taille {item.size || 'N/A'} • Quantité {item.quantity}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Statut: {item.status}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.totalPrice.toFixed(2)} €
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.unitPrice.toFixed(2)} € × {item.quantity}
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
                    <p className="font-medium">{trackingInfo.shippingAddress.street}</p>
                    <p>{trackingInfo.shippingAddress.postalCode} {trackingInfo.shippingAddress.city}</p>
                    <p className="font-medium">{trackingInfo.shippingAddress.country}</p>
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

            {/* Timeline des étapes */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Historique de votre commande
              </h3>
              <div className="space-y-6">
                {trackingInfo.trackingSteps.map((step, index) => (
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
                          {new Date(step.date).toLocaleDateString('fr-FR')}
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
      </div>
    </main>
  );
}
