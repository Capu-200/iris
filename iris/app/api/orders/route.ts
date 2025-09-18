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

    console.log('🔍 Données de commande reçues:', {
      itemsCount: orderData.items?.length || 0,
      items: orderData.items
    });

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
        'Statut de paiement': 'En attente',
        'Statut': 'En attente',
        'Date de commande': new Date().toISOString().split('T')[0],
      }
    };

    console.log('🔍 Création commande Airtable:', orderRecord);

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
      console.error('❌ Erreur création commande:', errorText);
      return NextResponse.json({ error: `Erreur création commande: ${orderResponse.status}` }, { status: orderResponse.status });
    }

    const orderResult = await orderResponse.json();
    const orderId = orderResult.id;
    console.log('✅ Commande créée avec ID:', orderId);

    // Créer les articles de commande seulement s'il y en a
    if (orderData.items.length > 0) {
      console.log('🔍 Création des articles de commande...');
      for (const item of orderData.items) {
        // Structure adaptée sans Produit ID - stockage direct des infos produit
        const orderItemRecord = {
          fields: {
            'Commande ID': [orderId],
            'Nom du produit': item.title || `Produit ${item.productId}`,
            'Quantite': item.quantity,
            'Taille': item.size || null,
            'Prix unitaire': item.price,
            'Prix total': item.price * item.quantity,
            'Statut': 'En stock',
            'Image': item.image || null
          }
        };

        console.log('🔍 Création article:', orderItemRecord);

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
      // Récupérer les informations actuelles du client
      const clientResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Clients/${orderData.clientId}`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      });

      if (clientResponse.ok) {
        const clientData = await clientResponse.json();
        const currentTotal = clientData.fields['Total commandes'] || 0;
        const currentCount = clientData.fields['Nombre de commandes'] || 0;

        // Mettre à jour le client
        const updateClientRecord = {
          fields: {
            'Total commandes': currentTotal + total,
            'Nombre de commandes': currentCount + 1,
            'Derniere commande': new Date().toISOString().split('T')[0]
          }
        };

        await fetch(`https://api.airtable.com/v0/${BASE_ID}/Clients/${orderData.clientId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateClientRecord)
        });
      }
    } catch (error) {
      // Ne pas faire échouer la commande si la mise à jour du client échoue
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
    console.error('❌ Erreur serveur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
