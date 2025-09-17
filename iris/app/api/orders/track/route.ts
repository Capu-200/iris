import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('orderNumber');

    if (!orderNumber) {
      return NextResponse.json({ error: 'Numéro de commande requis' }, { status: 400 });
    }

    const BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
    const API_KEY = process.env.AIRTABLE_API_KEY;

    if (!BASE_ID || !API_KEY) {
      return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
    }

    // Récupérer la commande
    const orderResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Commandes?filterByFormula={Numero de commande}='${orderNumber}'`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });

    if (!orderResponse.ok) {
      return NextResponse.json({ error: `Erreur API: ${orderResponse.status}` }, { status: orderResponse.status });
    }

    const orderData = await orderResponse.json();
    
    if (orderData.records.length === 0) {
      return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 });
    }

    const order = orderData.records[0];
    const orderFields = order.fields;

    // Récupérer les articles de la commande
    const orderItemsResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/OrderItems?filterByFormula={Commande ID}='${order.id}'`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });

    let orderItems = [];
    if (orderItemsResponse.ok) {
      const itemsData = await orderItemsResponse.json();
      orderItems = itemsData.records.map((item: any) => ({
        id: item.id,
        productId: item.fields['Produit ID']?.[0] || '',
        quantity: item.fields['Quantite'] || 0,
        size: item.fields['Taille'] || null,
        unitPrice: item.fields['Prix unitaire'] || 0,
        totalPrice: item.fields['Prix total'] || 0,
        status: item.fields['Statut'] || 'En stock'
      }));
    }

    // Récupérer les informations du client
    let clientInfo = null;
    if (orderFields['Client ID']?.[0]) {
      const clientResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Clients/${orderFields['Client ID'][0]}`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      });

      if (clientResponse.ok) {
        const clientData = await clientResponse.json();
        clientInfo = {
          firstName: clientData.fields['Prenom'] || '',
          lastName: clientData.fields['Nom'] || '',
          email: clientData.fields['Email'] || ''
        };
      }
    }

    // Déterminer les étapes de suivi basées sur le statut
    const getTrackingSteps = (status: string, orderDate: string) => {
      const steps = [
        { name: 'Commande confirmée', completed: true, date: orderDate },
        { name: 'En cours de préparation', completed: false, date: null },
        { name: 'Expédiée', completed: false, date: null },
        { name: 'En transit', completed: false, date: null },
        { name: 'Livrée', completed: false, date: null }
      ];

      switch (status) {
        case 'En attente':
          steps[1].completed = false;
          break;
        case 'Confirmée':
          steps[1].completed = true;
          break;
        case 'En préparation':
          steps[1].completed = true;
          steps[2].completed = false;
          break;
        case 'Expédiée':
          steps[1].completed = true;
          steps[2].completed = true;
          steps[3].completed = true;
          break;
        case 'Livrée':
          steps[1].completed = true;
          steps[2].completed = true;
          steps[3].completed = true;
          steps[4].completed = true;
          break;
        case 'Annulée':
          return steps.map(step => ({ ...step, completed: false }));
      }

      return steps;
    };

    const trackingSteps = getTrackingSteps(orderFields['Statut'] || 'En attente', orderFields['Date de commande'] || '');

    // Calculer la date de livraison estimée
    const getEstimatedDelivery = (orderDate: string, country: string) => {
      const orderDateObj = new Date(orderDate);
      let deliveryDays = 3; // France par défaut
      
      switch (country) {
        case 'Belgique':
          deliveryDays = 4;
          break;
        case 'Suisse':
          deliveryDays = 5;
          break;
        case 'Autre':
          deliveryDays = 7;
          break;
      }

      const deliveryDate = new Date(orderDateObj);
      deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);
      return deliveryDate.toISOString().split('T')[0];
    };

    // Parser l'adresse pour extraire les composants
    const parseAddress = (address: string) => {
      if (!address) return { street: '', city: '', postalCode: '' };
      
      // Format: "123 Rue de la Paix, 75001 Paris"
      const parts = address.split(',');
      if (parts.length >= 2) {
        const street = parts[0].trim();
        const cityPart = parts[1].trim();
        const cityMatch = cityPart.match(/^(\d+)\s+(.+)$/);
        
        if (cityMatch) {
          return {
            street,
            postalCode: cityMatch[1],
            city: cityMatch[2]
          };
        }
      }
      
      return { street: address, city: '', postalCode: '' };
    };

    const addressComponents = parseAddress(orderFields['Adresse de livraison'] || '');

    const response = {
      orderId: order.id,
      orderNumber: orderFields['Numero de commande'] || '',
      status: orderFields['Statut'] || 'En attente',
      paymentStatus: orderFields['Statut de paiement'] || 'En attente',
      orderDate: orderFields['Date de commande'] || '',
      estimatedDelivery: getEstimatedDelivery(orderFields['Date de commande'] || '', orderFields['Pays de livraison'] || 'France'),
      shippingAddress: {
        street: addressComponents.street,
        city: addressComponents.city,
        postalCode: addressComponents.postalCode,
        country: orderFields['Pays de livraison'] || '',
        full: orderFields['Adresse de livraison'] || ''
      },
      paymentMethod: orderFields['Methode de paiement'] || '',
      subtotal: orderFields['Sous-total'] || 0,
      shippingCost: orderFields['Frais de livraison'] || 0,
      discount: orderFields['Reduction appliquee'] || 0,
      total: orderFields['Total final'] || 0,
      promoCode: orderFields['Code promotionnel'] || '',
      items: orderItems,
      client: clientInfo,
      trackingSteps
    };

    return NextResponse.json(response);

  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
