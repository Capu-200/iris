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
    const orderId = order.id; // ID de l'enregistrement Airtable

    console.log("🔍 Recherche OrderItems pour orderId:", orderId);
    console.log("📦 Données de la commande:", order.fields);

    let items = [];
    
    // Méthode 1: Essayer de récupérer via le champ OrderItems de la commande
    if (order.fields.OrderItems && Array.isArray(order.fields.OrderItems) && order.fields.OrderItems.length > 0) {
      console.log("📋 OrderItems trouvés dans la commande:", order.fields.OrderItems);
      
      items = await Promise.all(
        order.fields.OrderItems.map(async (itemId: string) => {
          try {
            console.log("🔍 Récupération OrderItem:", itemId);
            const itemResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/OrderItems/${itemId}`, {
              headers: { 'Authorization': `Bearer ${API_KEY}` }
            });
            
            if (itemResponse.ok) {
              const itemData = await itemResponse.json();
              console.log("✅ OrderItem récupéré:", itemData.fields);
              
              // Récupérer les détails du produit
              let productDetails = null;
              const produitId = itemData.fields['Produit ID'];
              console.log("🛍️ Produit ID:", produitId);
              
              if (produitId && Array.isArray(produitId) && produitId.length > 0) {
                try {
                  const productResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Produits/${produitId[0]}`, {
                    headers: { 'Authorization': `Bearer ${API_KEY}` }
                  });
                  
                  if (productResponse.ok) {
                    const productData = await productResponse.json();
                    console.log("✅ Produit trouvé:", productData.fields.Nom);
                    
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
                
                if (Array.isArray(itemData.fields.Image) && itemData.fields.Image.length > 0) {
                  return itemData.fields.Image[0]?.url || null;
                } else if (typeof itemData.fields.Image === "string" && itemData.fields.Image.trim() !== "") {
                  return itemData.fields.Image;
                }
                
                return null;
              })();
              
              console.log("🖼️ Image finale:", itemImage);

              return {
                id: itemData.id,
                productId: Array.isArray(produitId) ? produitId[0] : '',
                productName: itemData.fields['Nom du produit'] || '',
                brand: productDetails?.brand || '',
                quantity: itemData.fields.Quantite || 0,
                size: itemData.fields.Taille || null,
                unitPrice: itemData.fields['Prix unitaire'] || 0,
                totalPrice: itemData.fields['Prix total'] || 0,
                image: itemImage,
                status: 'En cours',
                product: productDetails
              };
            } else {
              console.error("❌ Erreur récupération OrderItem:", itemResponse.status);
              return null;
            }
          } catch (error) {
            console.error('Erreur récupération OrderItem:', error);
            return null;
          }
        })
      );
      
      // Filtrer les items null
      items = items.filter(item => item !== null);
    } else {
      console.log("❌ Aucun OrderItems trouvé dans la commande");
    }

    console.log("📦 Items finaux:", items);

    // Déterminer le statut de suivi et calculer la date de livraison prévue
    const status = order.fields.Statut || 'En attente';
    let trackingStatus = 'pending';
    let trackingMessage = 'Votre commande est en cours de traitement';
    let estimatedDelivery = null;

    // Calculer la date de livraison prévue basée sur le statut
    const orderDate = new Date(order.fields['Date de commande'] || new Date());
    
    switch (status) {
      case 'En attente':
        trackingStatus = 'pending';
        trackingMessage = 'Votre commande est en cours de traitement';
        // Livraison prévue dans 5-7 jours
        estimatedDelivery = new Date(orderDate.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case 'Confirmée':
        trackingStatus = 'confirmed';
        trackingMessage = 'Votre commande a été confirmée et est en préparation';
        // Livraison prévue dans 4-6 jours
        estimatedDelivery = new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case 'En préparation':
        trackingStatus = 'preparing';
        trackingMessage = 'Votre commande est en préparation';
        // Livraison prévue dans 2-4 jours
        estimatedDelivery = new Date(orderDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case 'Expédiée':
        trackingStatus = 'shipped';
        trackingMessage = 'Votre commande a été expédiée';
        // Livraison prévue dans 1-3 jours
        estimatedDelivery = new Date(orderDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case 'Livrée':
        trackingStatus = 'delivered';
        trackingMessage = 'Votre commande a été livrée';
        // Si livrée, utiliser la date de commande + 5 jours comme date de livraison
        estimatedDelivery = new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case 'Annulée':
        trackingStatus = 'cancelled';
        trackingMessage = 'Votre commande a été annulée';
        estimatedDelivery = null;
        break;
      default:
        trackingStatus = 'unknown';
        trackingMessage = 'Statut inconnu';
        // Par défaut, livraison dans 5-7 jours
        estimatedDelivery = new Date(orderDate.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    }

    // Construire l'adresse de livraison à partir des champs de la commande
    const shippingAddress = {
      street: order.fields['Adresse de livraison'] || '',
      city: '',
      postalCode: '',
      country: order.fields['Pays de livraison'] || '',
      full: `${order.fields['Adresse de livraison'] || ''}, ${order.fields['Pays de livraison'] || ''}`
    };

    const orderDetails = {
      orderId: order.id,
      orderNumber: order.fields['Numero de commande'] || '',
      status: status,
      paymentStatus: 'Payé', // Par défaut
      trackingStatus: trackingStatus,
      trackingMessage: trackingMessage,
      orderDate: order.fields['Date de commande'] || '',
      estimatedDelivery: estimatedDelivery,
      subtotal: order.fields['Sous-total'] || 0,
      shippingCost: order.fields['Frais de livraison'] || 0,
      discount: order.fields.Reduction || 0,
      total: order.fields.Total || 0,
      shippingAddress: shippingAddress,
      paymentMethod: order.fields['Methode de paiement'] || '',
      promoCode: order.fields['Code promo'] || '',
      items: items,
      trackingSteps: [
        {
          name: "Commande reçue",
          completed: true,
          date: order.fields["Date de commande"] || new Date().toISOString().split("T")[0]
        },
        {
          name: "Commande confirmée",
          completed: status === "Confirmée" || status === "En préparation" || status === "Expédiée" || status === "Livrée",
          date: status === "Confirmée" || status === "En préparation" || status === "Expédiée" || status === "Livrée" ? new Date().toISOString().split("T")[0] : null
        },
        {
          name: "En préparation",
          completed: status === "En préparation" || status === "Expédiée" || status === "Livrée",
          date: status === "En préparation" || status === "Expédiée" || status === "Livrée" ? new Date().toISOString().split("T")[0] : null
        },
        {
          name: "Expédiée",
          completed: status === "Expédiée" || status === "Livrée",
          date: status === "Expédiée" || status === "Livrée" ? new Date().toISOString().split("T")[0] : null
        },
        {
          name: "Livrée",
          completed: status === "Livrée",
          date: status === "Livrée" ? new Date().toISOString().split("T")[0] : null
        }
      ]
    };

    return NextResponse.json(orderDetails);

  } catch (error) {
    console.error('Erreur suivi commande:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
