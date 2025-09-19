import { NextRequest, NextResponse } from 'next/server';

const SHIPPING_RATES: { [key: string]: number } = {
  'France': 9.99,
  'Belgique': 12.99,
  'Suisse': 15.99,
  'Autre': 19.99
};

function calculateShippingCost(country: string, subtotal: number = 0, isFreeShipping: boolean = false): number {
  if (isFreeShipping) return 0;
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
    let isFreeShipping = false;
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
          isFreeShipping = promoData.type === 'shipping';
        }
      } catch (error) {
        // Continuer sans le code promo
      }
    }
    
    const shippingCost = calculateShippingCost(orderData.shippingAddress.country, subtotal, isFreeShipping);
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

    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Commandes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderRecord)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur création commande:', response.status, errorText);
      return NextResponse.json({ error: `Erreur création commande: ${response.status}` }, { status: response.status });
    }

    const result = await response.json();
    const orderId = result.id;

    // Créer les articles de commande seulement s'il y en a
    if (orderData.items.length > 0) {
      for (const item of orderData.items) {
        // Structure adaptée avec le numéro de commande
        const orderItemRecord = {
          fields: {
            'Commande ID': orderNumber, // Utiliser le numéro de commande au lieu de l'ID interne
            'Produit ID': [item.productId], // Référence vers le produit (ID Airtable)
            'Nom du produit': item.title, // Nom du produit pour l'affichage
            'Quantite': item.quantity,
            'Taille': item.size || null,
            'Prix unitaire': item.price,
            'Prix total': item.price * item.quantity,
            'Image': item.image || null
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
          const errorText = await itemResponse.text();
          console.error('❌ Erreur création article:', itemResponse.status, errorText);
        }
      }
    }

    // Mettre à jour le nombre de commandes du client
    try {
      const clientUpdateResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Clients/${orderData.clientId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            'Nombre de commandes': { $increment: 1 },
            'Total commandes': { $increment: total }
          }
        })
      });

      if (!clientUpdateResponse.ok) {
        console.error('Erreur mise à jour client:', clientUpdateResponse.status);
      }
    } catch (error) {
      console.error('Erreur mise à jour client:', error);
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
    console.error('Erreur création commande:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
