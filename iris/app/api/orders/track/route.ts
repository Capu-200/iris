import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('orderNumber');
    
    if (!orderNumber) {
      return NextResponse.json({ error: "Numéro de commande requis" }, { status: 400 });
    }

    const BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
    const API_KEY = process.env.AIRTABLE_API_KEY;

    if (!BASE_ID || !API_KEY) {
      return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
    }

    // Récupérer la commande par son numéro
    const orderResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Commandes?filterByFormula={Numero de commande}='${orderNumber}'`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });

    if (!orderResponse.ok) {
      return NextResponse.json({ error: "Erreur récupération commande" }, { status: 500 });
    }

    const orderData = await orderResponse.json();
    
    if (orderData.records.length === 0) {
      return NextResponse.json({ error: "Commande non trouvée" }, { status: 404 });
    }

    const order = orderData.records[0];

    // Récupérer les articles de la commande
    const itemsResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/OrderItems?filterByFormula={Commande ID}='${orderNumber}'`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });

    let items = [];
    if (itemsResponse.ok) {
      const itemsData = await itemsResponse.json();
      
      items = await Promise.all(
        itemsData.records.map(async (item: any) => {
          
          // Récupérer les détails du produit
          let productDetails = null;
          if (item.fields['Produit ID'] && item.fields['Produit ID'].length > 0) {
            try {
              const productResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Produits/${item.fields['Produit ID'][0]}`, {
                headers: { 'Authorization': `Bearer ${API_KEY}` }
              });
              
              if (productResponse.ok) {
                const productData = await productResponse.json();
                
                productDetails = {
                  id: productData.id,
                  name: productData.fields.Nom || '',
                  brand: productData.fields.Marque || '',
                  category: productData.fields.Categorie || '',
                  price: productData.fields.Prix || 0,
                  image: (() => {
                    if (Array.isArray(productData.fields.Image)) {
                      return productData.fields.Image[0]?.url || null;
                    } else if (typeof productData.fields.Image === "string") {
                      return productData.fields.Image;
                    }
                    return null;
                  })(),
                  description: productData.fields.Description || '',
                  sizes: productData.fields.Tailles || []
                };
              }
            } catch (error) {
              console.error('Erreur récupération produit:', error);
            }
          }

          // Récupérer l'image de l'item
          const itemImage = (() => {
            
            if (productDetails?.image) {
              return productDetails.image;
            }
            
            if (Array.isArray(item.fields.Image) && item.fields.Image.length > 0) {
              return item.fields.Image[0]?.url || null;
            } else if (typeof item.fields.Image === "string" && item.fields.Image.trim() !== "") {
              return item.fields.Image;
            }
            
            return null;
          })();
          

          return {
            id: item.id,
            productId: item.fields['Produit ID']?.[0] || '',
            name: item.fields['Nom du produit'] || '',
            quantity: item.fields.Quantite || 0,
            size: item.fields.Taille || null,
            unitPrice: item.fields['Prix unitaire'] || 0,
            totalPrice: item.fields['Prix total'] || 0,
            image: itemImage,
            product: productDetails
          };
        })
      );
    }

    // Déterminer le statut de suivi
    const status = order.fields.Statut || 'En attente';
    let trackingStatus = 'pending';
    let trackingMessage = 'Votre commande est en cours de traitement';
    let estimatedDelivery = null;

    switch (status) {
      case 'En attente':
        trackingStatus = 'pending';
        trackingMessage = 'Votre commande est en cours de traitement';
        break;
      case 'Confirmée':
        trackingStatus = 'confirmed';
        trackingMessage = 'Votre commande a été confirmée et est en préparation';
        break;
      case 'Expédiée':
        trackingStatus = 'shipped';
        trackingMessage = 'Votre commande a été expédiée';
        estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // +3 jours
        break;
      case 'Livrée':
        trackingStatus = 'delivered';
        trackingMessage = 'Votre commande a été livrée';
        break;
      case 'Annulée':
        trackingStatus = 'cancelled';
        trackingMessage = 'Votre commande a été annulée';
        break;
      default:
        trackingStatus = 'unknown';
        trackingMessage = 'Statut inconnu';
    }

    const orderDetails = {
      id: order.id,
      orderNumber: order.fields['Numero de commande'] || '',
      status: status,
      trackingStatus: trackingStatus,
      trackingMessage: trackingMessage,
      orderDate: order.fields['Date de commande'] || '',
      estimatedDelivery: estimatedDelivery,
      subtotal: order.fields['Sous-total'] || 0,
      shippingCost: order.fields['Frais de livraison'] || 0,
      discount: order.fields.Reduction || 0,
      total: order.fields.Total || 0,
      shippingAddress: order.fields['Adresse de livraison'] || '',
      country: order.fields['Pays de livraison'] || '',
      paymentMethod: order.fields['Methode de paiement'] || '',
      promoCode: order.fields['Code promo'] || '',
      items: items
    };

    return NextResponse.json({ order: orderDetails });

  } catch (error) {
    console.error('Erreur suivi commande:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
