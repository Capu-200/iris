'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../lib/auth';

interface ClientData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  totalOrders: number;
  orderCount: number;
  createdAt: string;
  status: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  orderDate: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  shippingAddress: string;
  country: string;
  paymentMethod: string;
  promoCode: string;
  items: OrderItem[];
}

interface OrderItem {
  product?: {
    id: string;
    name: string;
    brand: string;
    category: string;
    price: number;
    image?: string;
    description: string;
    sizes: number[];
  };
  id: string;
  productId: string;
  name: string;
  quantity: number;
  size?: number;
  unitPrice: number;
  totalPrice: number;
  image?: string;
}

interface Address {
  orderNumber?: string;
  lastUsed?: string;
  id: string;
  type: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
}

export default function Account() {
    const { user, logout } = useAuth();
    const [tab, setTab] = useState<'profil' | 'commandes' | 'adresses'>('profil');
    const [clientData, setClientData] = useState<ClientData | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    
    // États pour les formulaires
    const [profileForm, setProfileForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });
    

    // Charger les données du client
    useEffect(() => {
        if (user?.id) {
            loadClientData();
            loadOrders();
            loadAddresses();
        }
    }, [user?.id]);

    const loadClientData = async () => {
        if (!user?.id) return;
        
        try {
            setLoading(true);
            const response = await fetch(`/api/clients/${user.id}`);
            const data = await response.json();
            
            if (data.client) {
                setClientData(data.client);
                setProfileForm({
                    firstName: data.client.firstName,
                    lastName: data.client.lastName,
                    email: data.client.email,
                    phone: data.client.phone || ''
                });
            }
        } catch (error) {
            console.error('Erreur chargement client:', error);
            setError('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    const loadOrders = async () => {
        if (!user?.id) return;
        
        try {
            const response = await fetch(`/api/clients/orders?clientId=${user.id}`);
            const data = await response.json();
            setOrders(data.orders || []);
        } catch (error) {
            console.error('Erreur chargement commandes:', error);
        }
    };

    const loadAddresses = async () => {
        if (!user?.id) return;
        
        try {
            const response = await fetch(`/api/clients/addresses?clientId=${user.id}`);
            const data = await response.json();
            setAddresses(data.addresses || []);
        } catch (error) {
            console.error('Erreur chargement adresses:', error);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;

        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`/api/clients/${user.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileForm)
            });

            const data = await response.json();
            
            if (data.client) {
                setClientData(data.client);
                setSuccess('Profil mis à jour avec succès');
                setTimeout(() => setSuccess(null), 3000);
            } else {
                setError(data.error || 'Erreur lors de la mise à jour');
            }
        } catch (error) {
            console.error('Erreur mise à jour profil:', error);
            setError('Erreur lors de la mise à jour du profil');
        } finally {
            setLoading(false);
        }
    };


    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'En attente': return 'bg-yellow-100 text-yellow-800';
            case 'Confirmée': return 'bg-blue-100 text-blue-800';
            case 'Expédiée': return 'bg-purple-100 text-purple-800';
            case 'Livrée': return 'bg-green-100 text-green-800';
            case 'Annulée': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const baseTab = "flex items-center px-4 py-3 rounded-md text-sm font-medium";
    const active = "bg-[#D6DDDA] text-[#576F66] font-semibold";
    const inactive = "text-gray-950 hover:bg-gray-50 border border-transparent";

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 py-20 text-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold mb-4">Accès non autorisé</h1>
                    <p className="text-gray-600 mb-6">Vous devez être connecté pour accéder à cette page.</p>
                    <a href="/login" className="inline-flex items-center rounded-md bg-[#576F66] text-white px-4 py-2 font-medium hover:bg-[#34433D] transition-colors">
                        Se connecter
                    </a>
                </div>
            </div>
        );
    }

    return(
        <div className="min-h-screen bg-gray-50 py-20 text-gray-950">
            <div className="max-w-5xl mx-auto px-4">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-semibold">Mon compte</h1>
                        <p className="text-gray-600 mt-1">Gérez vos informations personnelles et vos commandes</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                            Connecté en tant que {user.firstName} {user.lastName}
                        </span>
                        <button
                            onClick={logout}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Se déconnecter
                        </button>
                    </div>
                </div>

                {/* Lien Admin pour les administrateurs */}
                {user.role === 'admin' && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-[#576F66] to-[#34433D] rounded-lg text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">Dashboard Administrateur</h2>
                                <p className="text-sm opacity-90">Gérez les commandes et les marques</p>
                            </div>
                            <Link 
                                href="/admin"
                                className="inline-flex items-center px-4 py-2 bg-white text-[#576F66] rounded-md font-medium hover:bg-gray-100 transition-colors"
                            >
                                Accéder au dashboard
                            </Link>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-green-800">{success}</p>
                    </div>
                )}

                <div className="bg-white border border-gray-200 rounded-xl">
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex gap-2">
                            <button
                                className={`${baseTab} ${tab === 'profil' ? active : inactive}`}
                                onClick={() => setTab('profil')}
                                aria-selected={tab === 'profil'}
                                role="tab"
                            >
                                <span className="i-hero-user text-[14px]" aria-hidden />
                                Profil
                            </button>
                            <button
                                className={`${baseTab} ${tab === 'commandes' ? active : inactive}`}
                                onClick={() => setTab('commandes')}
                                aria-selected={tab === 'commandes'}
                                role="tab"
                            >
                                <span className="i-hero-cube text-[14px]" aria-hidden />
                                Commandes ({orders.length})
                            </button>
                            <button
                                className={`${baseTab} ${tab === 'adresses' ? active : inactive}`}
                                onClick={() => setTab('adresses')}
                                aria-selected={tab === 'adresses'}
                                role="tab"
                            >
                                <span className="i-hero-map-pin text-[14px]" aria-hidden />
                                Adresses ({addresses.length})
                            </button>
                        </div>
                    </div>

                    <div className="p-6" role="tabpanel">
                        {tab === 'profil' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-semibold">Informations personnelles</h2>
                                    <p className="text-gray-600 text-sm">Modifiez vos informations personnelles et de contact</p>
                                </div>
                                
                                {clientData && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="text-sm text-gray-600">Membre depuis</p>
                                            <p className="font-medium">{formatDate(clientData.createdAt)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Commandes</p>
                                            <p className="font-medium">{clientData.orderCount}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Total dépensé</p>
                                            <p className="font-medium">{formatPrice(clientData.totalOrders)}</p>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleProfileUpdate} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm mb-1">Prénom</label>
                                            <input 
                                                className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#576F66]" 
                                                value={profileForm.firstName}
                                                onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm mb-1">Nom</label>
                                            <input 
                                                className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#576F66]" 
                                                value={profileForm.lastName}
                                                onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-1">Email</label>
                                        <input 
                                            type="email"
                                            className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#576F66]" 
                                            value={profileForm.email}
                                            onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-1">Téléphone</label>
                                        <input 
                                            type="tel"
                                            className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#576F66]" 
                                            value={profileForm.phone}
                                            onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button 
                                            type="submit" 
                                            disabled={loading}
                                            className="inline-flex items-center rounded-md bg-[#576F66] text-white px-4 py-2 font-medium hover:bg-[#34433D] transition-colors disabled:opacity-50"
                                        >
                                            {loading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {tab === 'commandes' && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Mes commandes</h2>
                                
                                {loading ? (
                                    <p className="text-gray-600">Chargement des commandes...</p>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-600 mb-4">Aucune commande trouvée.</p>
                                        <Link href="/products" className="inline-flex items-center rounded-md bg-[#576F66] text-white px-4 py-2 font-medium hover:bg-[#34433D] transition-colors">
                                            Découvrir nos produits
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {orders.map((order) => (
                                            <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-lg font-semibold">Commande #{order.orderNumber}</h3>                                                   
                                                <p className="text-sm text-gray-600">Passée le {formatDate(order.orderDate)}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                {/* Articles commandés avec détails des chaussures */}
                                                {order.items.length > 0 && (
                                                    <div className="mb-4">
                                                        <h4 className="font-medium mb-3 text-gray-900">Articles commandés :</h4>
                                                        <div className="space-y-3">
                                                            {order.items.map((item) => (
                                                                <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                                                    {item.product?.image && (
                                                                        <Image 
                                                                            src={item.product.image} 
                                                                            alt={item.name}
                                                                            width={64}
                                                                            height={64}
                                                                            className="w-16 h-16 object-cover rounded-md"
                                                                        />
                                                                    )}
                                                                    <div className="flex-1">
                                                                        <div className="flex justify-between items-start">
                                                                            <div>
                                                                                <h5 className="font-medium text-gray-900">{item.name}</h5>
                                                                                {item.product?.brand && (
                                                                                    <p className="text-sm text-gray-600">{item.product.brand}</p>
                                                                                )}
                                                                                {item.size && (
                                                                                    <p className="text-sm text-gray-500">Taille {item.size}</p>
                                                                                )}
                                                                                <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {/* Informations de livraison et paiement */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-gray-600 font-medium">Adresse de livraison</p>
                                                        <p className="text-gray-900">{order.shippingAddress}</p>
                                                        <p className="text-gray-600">{order.country}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600 font-medium">Méthode de paiement</p>
                                                        <p className="text-gray-900">{order.paymentMethod}</p>
                                                        {order.promoCode && (
                                                            <p className="text-gray-600 mt-1">Code promo: {order.promoCode}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                {/* Détails financiers */}
                                                <div className="mt-4 pt-4 border-t border-gray-200">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Sous-total</span>
                                                        <span>{formatPrice(order.subtotal)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Frais de livraison</span>
                                                        <span>{formatPrice(order.shippingCost)}</span>
                                                    </div>
                                                    {order.discount > 0 && (
                                                        <div className="flex justify-between text-sm text-green-600">
                                                            <span>Remise</span>
                                                            <span>-{formatPrice(order.discount)}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between text-lg font-semibold mt-2 pt-2 border-t border-gray-200">
                                                        <span>Total</span>
                                                        <span>{formatPrice(order.total)}</span>
                                                    </div>
                                                </div>
                                                
                                                {/* Actions de commande */}
                                                <div className="mt-4 flex flex-wrap gap-3">
                                                    <Link 
                                                        href={`/order-tracking?orderNumber=${order.orderNumber}`}
                                                        className="inline-flex items-center rounded-md bg-[#576F66] text-white px-4 py-2 font-medium hover:bg-[#34433D] transition-colors"
                                                    >
                                                        <span className="i-hero-truck text-sm mr-2" aria-hidden />
                                                        Suivre la commande
                                                    </Link>
                                                    <button 
                                                        onClick={() => window.print()}
                                                        className="inline-flex items-center rounded-md border border-gray-300 text-gray-700 px-4 py-2 font-medium hover:bg-gray-50 transition-colors"
                                                    >
                                                        <span className="i-hero-printer text-sm mr-2" aria-hidden />
                                                        Imprimer
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        {tab === 'adresses' && (
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-xl font-semibold">Adresses de livraison</h2>
                                    <p className="text-gray-600 text-sm">Adresses extraites de vos commandes précédentes</p>
                                </div>

                                {loading ? (
                                    <p className="text-gray-600">Chargement des adresses...</p>
                                ) : addresses.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-600 mb-4">Aucune adresse de livraison trouvée.</p>
                                        <p className="text-sm text-gray-500">Les adresses apparaîtront ici après votre première commande.</p>
                                        <Link href="/products" className="inline-flex items-center rounded-md bg-[#576F66] text-white px-4 py-2 font-medium hover:bg-[#34433D] transition-colors mt-4">
                                            Passer une commande
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {addresses.map((address) => (
                                            <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-semibold">Adresse de livraison</h3>
                                                    <span className="text-xs text-gray-500">
                                                        Utilisée le {formatDate(address.lastUsed || '')}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    <p className="font-medium">{address.street}</p>
                                                    <p>{address.country}</p>
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        Commande #{address.orderNumber}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        
                                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                            <p className="text-sm text-blue-800">
                                                <strong>Note :</strong> Les adresses affichées sont extraites de vos commandes précédentes. 
                                                Pour ajouter une nouvelle adresse, passez une commande avec cette adresse.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
