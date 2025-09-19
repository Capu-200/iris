import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    
    if (!clientId) {
      return NextResponse.json({ error: "ID client requis" }, { status: 400 });
    }

    const BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
    const API_KEY = process.env.AIRTABLE_API_KEY;

    if (!BASE_ID || !API_KEY) {
      return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
    }

    // D'abord, récupérer le client pour obtenir les IDs de commande
    const clientResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Clients/${clientId}`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });

    if (!clientResponse.ok) {
      console.error('Erreur récupération client pour adresses:', clientResponse.status);
      return NextResponse.json({ error: "Client non trouvé" }, { status: 404 });
    }

    const clientData = await clientResponse.json();
    const orderIds = clientData.fields.Commandes || [];
    
    if (orderIds.length === 0) {
      return NextResponse.json({ addresses: [] });
    }

    // Récupérer les commandes pour extraire les adresses
    const addressMap = new Map();
    
    await Promise.all(
      orderIds.map(async (orderId: string) => {
        try {
          const orderResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Commandes/${orderId}`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
          });

          if (orderResponse.ok) {
            const order = await orderResponse.json();
            const address = order.fields['Adresse de livraison'];
            const country = order.fields['Pays de livraison'];
            const orderDate = order.fields['Date de commande'];
            const orderNumber = order.fields['Numero de commande'];
            
            if (address && country) {
              const addressKey = `${address}|${country}`;
              if (!addressMap.has(addressKey)) {
                addressMap.set(addressKey, {
                  id: `addr_${order.id}`,
                  type: 'livraison',
                  street: address,
                  city: '',
                  postalCode: '',
                  country: country,
                  isDefault: false,
                  createdAt: orderDate,
                  orderNumber: orderNumber,
                  lastUsed: orderDate
                });
              } else {
                // Mettre à jour la date d'utilisation la plus récente
                const existing = addressMap.get(addressKey);
                if (new Date(orderDate) > new Date(existing.lastUsed)) {
                  existing.lastUsed = orderDate;
                  existing.orderNumber = orderNumber;
                }
              }
            }
          }
        } catch (error) {
          console.error(`Erreur traitement commande ${orderId} pour adresses:`, error);
        }
      })
    );

    // Convertir en tableau et trier par date d'utilisation
    const addresses = Array.from(addressMap.values()).sort((a, b) => 
      new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime()
    );

    return NextResponse.json({ addresses });

  } catch (error) {
    console.error('Erreur récupération adresses:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { clientId, type, street, city, postalCode, country, isDefault } = await request.json();
    
    if (!clientId || !street || !city || !postalCode || !country) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    // Pour l'instant, on ne peut pas créer d'adresses car elles sont liées aux commandes
    // Cette fonctionnalité pourrait être ajoutée plus tard si nécessaire
    return NextResponse.json({ 
      error: "La création d'adresses n'est pas encore implémentée. Les adresses sont automatiquement extraites de vos commandes." 
    }, { status: 501 });

  } catch (error) {
    console.error('Erreur création adresse:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
