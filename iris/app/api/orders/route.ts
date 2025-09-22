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

    console.log('🔍 Données de commande reçues:', JSON.stringify(orderData, null, 2));

    // Calculs
    const subtotal = orderData.items.reduce((sum: number, item: { price: number; quantity: number }) => sum + (item.price * item.quantity), 0);
    
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

    console.log('📊 Calculs:', { subtotal, shippingCost, discount, total, orderNumber });

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

    console.log('📝 Création commande:', JSON.stringify(orderRecord, null, 2));

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
      console.error('❌ Erreur création commande:', response.status, errorText);
      return NextResponse.json({ error: `Erreur création commande: ${response.status}` }, { status: response.status });
    }

    const result = await response.json();
    const orderId = result.id; // ID de l'enregistrement Airtable
    console.log('✅ Commande créée:', orderId);

    // Créer les articles de commande seulement s'il y en a
    if (orderData.items && orderData.items.length > 0) {
      console.log(`🛍️ Création de ${orderData.items.length} articles...`);
      
      for (const item of orderData.items) {
        console.log('📦 Création article:', item);
        
        // Structure correcte pour les champs de liaison
        const orderItemRecord = {
          fields: {
            'Commande ID': [orderId], // CORRECTION: Utiliser l'ID de l'enregistrement, pas le numéro
            'Produit ID': [item.productId], // Lien vers la table Produits
            'Nom du produit': item.title,
            'Quantite': item.quantity,
            'Taille': item.size || null,
            'Prix unitaire': item.price,
            'Prix total': item.price * item.quantity,
            'Image': item.image || null
          }
        };

        console.log('📝 Article record:', JSON.stringify(orderItemRecord, null, 2));

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
        } else {
          const itemResult = await itemResponse.json();
          console.log('✅ Article créé:', itemResult.id);
        }
      }
    } else {
      console.log('⚠️ Aucun article à créer');
    }

    // Mettre à jour le nombre de commandes du client
    try {
      // Récupérer d'abord les données actuelles du client
      const clientGetResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Clients/${orderData.clientId}`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      });

      if (clientGetResponse.ok) {
        const clientData = await clientGetResponse.json();
        const currentOrderCount = clientData.fields['Nombre de commandes'] || 0;
        const currentTotal = clientData.fields['Total commandes'] || 0;

        // Mettre à jour avec les nouvelles valeurs
        const clientUpdateResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Clients/${orderData.clientId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fields: {
              'Nombre de commandes': currentOrderCount + 1,
              'Total commandes': currentTotal + total
            }
          })
        });

        if (!clientUpdateResponse.ok) {
          const errorText = await clientUpdateResponse.text();
          console.error('Erreur mise à jour client:', clientUpdateResponse.status, errorText);
        } else {
          console.log('✅ Client mis à jour avec succès');
        }
      } else {
        console.error('Erreur récupération client pour mise à jour');
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
