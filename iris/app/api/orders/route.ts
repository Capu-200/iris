import { NextRequest, NextResponse } from 'next/server';

const SHIPPING_RATES: { [key: string]: number } = {
  'France': 9.99,
  'Belgique': 12.99,
  'Suisse': 15.99,
  'Autre': 19.99
};

function calculateShippingCost(country: string, subtotal: number = 0): number {
  if (country === 'France' && subtotal >= 125) return 0;
  return SHIPPING_RATES[country] || SHIPPING_RATES['Autre'];
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    const BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
    const API_KEY = process.env.AIRTABLE_API_KEY;

    if (!BASE_ID || !API_KEY) {
      return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
    }

    // Calculs
    const subtotal = orderData.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    
    // Code promotionnel
    let discount = 0;
    if (orderData.promoCode) {
      try {
        const promoResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/promo-codes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: orderData.promoCode, subtotal })
        });
        
        if (promoResponse.ok) {
          const promoData = await promoResponse.json();
          discount = promoData.discount || 0;
        }
      } catch (error) {
        // Continuer sans le code promo
      }
    }
    
    const shippingCost = calculateShippingCost(orderData.shippingAddress.country, subtotal);
    const total = Math.round((subtotal + shippingCost - discount) * 100) / 100;
    const orderNumber = `CMD-${Date.now().toString(36).toUpperCase()}`;

    // Construire l'adresse complète
    const fullAddress = `${orderData.shippingAddress.street}, ${orderData.shippingAddress.postalCode} ${orderData.shippingAddress.city}`;

    // Créer la commande avec les bons noms de champs
    const orderRecord = {
      fields: {
        'Numero de commande': orderNumber,
        'Client ID': [orderData.clientId],
        'Adresse de livraison': fullAddress,
        'Pays de livraison': orderData.shippingAddress.country,
        'Frais de livraison': shippingCost,
        'Code promo': orderData.promoCode || '',
        'Reduction': discount,
        'Sous-total': subtotal,
        'Total': total,
        'Methode de paiement': orderData.paymentMethod,
        'Statut': 'En attente',
        'Date de commande': new Date().toISOString().split('T')[0],
      }
    };

    const orderResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Commandes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderRecord)
    });

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      return NextResponse.json({ error: `Erreur création commande: ${orderResponse.status}` }, { status: orderResponse.status });
    }

    const orderResult = await orderResponse.json();
    const orderId = orderResult.id;

    // Créer les articles de commande seulement s'il y en a
    if (orderData.items.length > 0) {
      for (const item of orderData.items) {
        const orderItemRecord = {
          fields: {
            'Commande ID': [orderId],
            'Produit ID': [item.productId],
            'Quantite': item.quantity,
            'Taille': item.size || null,
            'Prix unitaire': item.price,
            'Prix total': item.price * item.quantity,
            'Statut': 'En stock'
          }
        };

        const itemResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/OrderItems`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderItemRecord)
        });

        if (!itemResponse.ok) {
          // Ne pas faire échouer la commande si les articles ne peuvent pas être créés
          console.error('Erreur création article:', itemResponse.status);
        }
      }
    }

    return NextResponse.json({ 
      orderId, 
      orderNumber,
      total,
      subtotal,
      shippingCost,
      discount
    });

  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
