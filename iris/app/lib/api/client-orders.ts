// Fonctions client sécurisées pour les commandes

export interface ClientData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  size?: number;
  price: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface OrderData {
  clientId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  promoCode?: string;
  paymentMethod: string;
}

// Appliquer un code promotionnel
export async function applyPromoCode(code: string, subtotal: number): Promise<number> {
  try {
    const response = await fetch('/api/promo-codes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, subtotal }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur validation code promo');
    }

    const data = await response.json();
    return data.discount || 0;
  } catch (error: any) {
    throw error;
  }
}

// Créer ou récupérer un client
export async function createOrGetClient(clientData: ClientData): Promise<string> {
  try {
    const response = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clientData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur création client');
    }

    const data = await response.json();
    return data.clientId;
  } catch (error: any) {
    throw error;
  }
}

// Créer une commande
export async function createOrder(orderData: OrderData): Promise<{ 
  orderId: string; 
  orderNumber: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  discount: number;
}> {
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur création commande');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw error;
  }
}

// Calculer les frais de livraison
export function calculateShippingCost(country: string, subtotal: number = 0): number {
  const SHIPPING_RATES: { [key: string]: number } = {
    'France': 9.99,
    'Belgique': 12.99,
    'Suisse': 15.99,
    'Autre': 19.99
  };

  if (country === 'France' && subtotal >= 125) return 0;
  return SHIPPING_RATES[country] || SHIPPING_RATES['Autre'];
}
