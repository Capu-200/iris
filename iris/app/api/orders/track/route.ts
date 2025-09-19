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
    const orderItemsResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/OrderItems?filterByFormula={Commande ID}='${orderFields['Numero de commande']}'`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });

    // Fonction pour récupérer les détails de base d'un produit
    const getProductDetails = async (productId: string | string[]) => {
      try {
        // Extraire l'ID du tableau si c'est un tableau
        const actualProductId = Array.isArray(productId) ? productId[0] : productId;
        
        // Si c'est un ID Airtable (commence par 'rec'), chercher directement par ID
        if (actualProductId && actualProductId.startsWith('rec')) {
          const productResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Produits/${actualProductId}`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
          });
          
          if (productResponse.ok) {
            const productData = await productResponse.json();
            const product = productData.fields;
            if (product) {
              // Parser les images si c'est une chaîne séparée par des points-virgules
              let imageUrl = null;
              if (product['Images']) {
                if (typeof product['Images'] === 'string') {
                  const images = product['Images'].split(';').map(url => url.trim()).filter(url => url.length > 0);
                  imageUrl = images[0] || null;
                } else if (Array.isArray(product['Images'])) {
                  imageUrl = product['Images'][0] || null;
                }
              }
              
              return {
                brand: product['Marque'] || 'Marque inconnue',
                model: product['Modèle'] || actualProductId,
                image: imageUrl,
                price: product['Prix'] ? parseFloat(product['Prix'].match(/(\d+\.?\d*)/)?.[1] || '0') : 0
              };
            }
          }
        } else {
          // Sinon, chercher par modèle (ancienne méthode)
          const productResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Produits?filterByFormula={Modèle}='${actualProductId}'`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
          });
          
          if (productResponse.ok) {
            const productData = await productResponse.json();
            const product = productData.records[0]?.fields;
            if (product) {
              // Parser les images si c'est une chaîne séparée par des points-virgules
              let imageUrl = null;
              if (product['Images']) {
                if (typeof product['Images'] === 'string') {
                  const images = product['Images'].split(';').map(url => url.trim()).filter(url => url.length > 0);
                  imageUrl = images[0] || null;
                } else if (Array.isArray(product['Images'])) {
                  imageUrl = product['Images'][0] || null;
                }
              }
              
              return {
                brand: product['Marque'] || 'Marque inconnue',
                model: product['Modèle'] || actualProductId,
                image: imageUrl,
                price: product['Prix'] ? parseFloat(product['Prix'].match(/(\d+\.?\d*)/)?.[1] || '0') : 0
              };
            }
          }
        }
      } catch (error) {
        console.error('Erreur récupération produit:', error);
      }
      return null;
    };

    let orderItems = [];
    if (orderItemsResponse.ok) {
      const itemsData = await orderItemsResponse.json();
      
      // Récupérer les détails de tous les produits en parallèle
      const itemsWithDetails = await Promise.all(
        itemsData.records.map(async (item: any) => {
          const productDetails = await getProductDetails(item.fields['Produit ID']);
          
          return {
            id: item.id,
            productId: item.fields['Produit ID'],
            productName: item.fields['Nom du produit'] || 'Produit inconnu',
            quantity: item.fields['Quantite'] || 0,
            size: item.fields['Taille'] || null,
            unitPrice: item.fields['Prix unitaire'] || 0,
            totalPrice: item.fields['Prix total'] || 0,
            status: item.fields['Statut'] || 'En stock',
            // Informations de base du produit
            brand: productDetails?.brand || 'Marque inconnue',
            model: productDetails?.model || item.fields['Produit ID'],
            image: productDetails?.image || item.fields['Image'] || null,
            currentPrice: productDetails?.price || item.fields['Prix unitaire'] || 0
          };
        })
      );
      
      orderItems = itemsWithDetails;
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
      discount: orderFields['Reduction'] || 0,
      total: orderFields['Total'] || 0,
      promoCode: orderFields['Code promo'] || '',
      items: orderItems,
      client: clientInfo,
      trackingSteps
    };

    return NextResponse.json(response);

  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
