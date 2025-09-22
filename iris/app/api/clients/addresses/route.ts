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

    // Si c'est un admin, retourner toutes les adresses de toutes les commandes
    if (clientId === 'admin-demo' || clientId.includes('admin')) {
      // Récupérer toutes les commandes pour les admins
      const ordersResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Commandes`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      });

      if (!ordersResponse.ok) {
        return NextResponse.json({ error: "Erreur récupération commandes" }, { status: 500 });
      }

      const ordersData = await ordersResponse.json();
      
      const addresses = ordersData.records.map((order: any) => ({
        id: order.id,
        orderNumber: order.fields['Numero de commande'] || '',
        lastUsed: order.fields['Date de commande'] || '',
        street: order.fields['Adresse de livraison'] || '',
        city: '',
        postalCode: '',
        country: order.fields['Pays de livraison'] || '',
        isDefault: false,
        createdAt: order.fields['Date de commande'] || '',
        type: 'livraison'
      }));

      return NextResponse.json({ addresses });
    }

    // Récupérer les commandes du client spécifique
    const clientResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Clients/${clientId}`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });

    if (!clientResponse.ok) {
      return NextResponse.json({ error: "Client non trouvé" }, { status: 404 });
    }

    const clientData = await clientResponse.json();
    
    if (!clientData.fields.Commandes || !Array.isArray(clientData.fields.Commandes)) {
      return NextResponse.json({ addresses: [] });
    }

    // Récupérer les détails des commandes
    const addresses = await Promise.all(
      clientData.fields.Commandes.map(async (orderId: string) => {
        try {
          const orderResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Commandes/${orderId}`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
          });
          
          if (orderResponse.ok) {
            const orderData = await orderResponse.json();
            return {
              id: orderData.id,
              orderNumber: orderData.fields['Numero de commande'] || '',
              lastUsed: orderData.fields['Date de commande'] || '',
              street: orderData.fields['Adresse de livraison'] || '',
              city: '',
              postalCode: '',
              country: orderData.fields['Pays de livraison'] || '',
              isDefault: false,
              createdAt: orderData.fields['Date de commande'] || '',
              type: 'livraison'
            };
          }
        } catch (error) {
          console.error('Erreur récupération commande:', error);
          return null;
        }
      })
    );

    const validAddresses = addresses.filter(addr => addr !== null);

    return NextResponse.json({ addresses: validAddresses });

  } catch (error) {
    console.error('Erreur récupération adresses:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
