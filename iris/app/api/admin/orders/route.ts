import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get('brand');

    const BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
    const API_KEY = process.env.AIRTABLE_API_KEY;

    if (!BASE_ID || !API_KEY) {
      return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
    }

    // Récupérer toutes les commandes
    const ordersResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Commandes`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });

    if (!ordersResponse.ok) {
      return NextResponse.json({ error: "Erreur récupération commandes" }, { status: 500 });
    }

    const ordersData = await ordersResponse.json();
    
    // Pour chaque commande, récupérer les détails complets
    const orders = await Promise.all(
      ordersData.records.map(async (order: any) => {
        // Récupérer les informations du client
        let clientInfo = null;
        if (order.fields['Client ID'] && Array.isArray(order.fields['Client ID']) && order.fields['Client ID'].length > 0) {
          try {
            const clientResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Clients/${order.fields['Client ID'][0]}`, {
              headers: { 'Authorization': `Bearer ${API_KEY}` }
            });
            if (clientResponse.ok) {
              const clientData = await clientResponse.json();
              clientInfo = {
                firstName: clientData.fields.Prénom || '',
                lastName: clientData.fields.Nom || '',
                email: clientData.fields.Email || ''
              };
            }
          } catch (error) {
            console.error('Erreur récupération client:', error);
          }
        }

        // Récupérer les articles de la commande et leurs marques
        let items = [];
        let orderBrands = new Set(); // Pour collecter toutes les marques de cette commande
        
        if (order.fields.OrderItems && Array.isArray(order.fields.OrderItems) && order.fields.OrderItems.length > 0) {
          items = await Promise.all(
            order.fields.OrderItems.map(async (itemId: string) => {
              try {
                const itemResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/OrderItems/${itemId}`, {
                  headers: { 'Authorization': `Bearer ${API_KEY}` }
                });
                
                if (itemResponse.ok) {
                  const itemData = await itemResponse.json();
                  
                  // Récupérer les détails du produit pour obtenir la marque
                  let brand = '';
                  const produitId = itemData.fields['Produit ID'];
                  if (produitId && Array.isArray(produitId) && produitId.length > 0) {
                    try {
                      const productResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Produits/${produitId[0]}`, {
                        headers: { 'Authorization': `Bearer ${API_KEY}` }
                      });
                      
                      if (productResponse.ok) {
                        const productData = await productResponse.json();
                        brand = productData.fields.Marque || '';
                        orderBrands.add(brand); // Ajouter la marque à l'ensemble
                      }
                    } catch (error) {
                      console.error('Erreur récupération produit:', error);
                    }
                  }

                  return {
                    id: itemData.id,
                    productName: itemData.fields['Nom du produit'] || '',
                    brand: brand,
                    quantity: itemData.fields.Quantite || 0,
                    size: itemData.fields.Taille || null,
                    unitPrice: itemData.fields['Prix unitaire'] || 0,
                    totalPrice: itemData.fields['Prix total'] || 0,
                    image: (() => {
                      if (Array.isArray(itemData.fields.Image)) {
                        return itemData.fields.Image[0]?.url || null;
                      } else if (typeof itemData.fields.Image === "string") {
                        return itemData.fields.Image;
                      }
                      return null;
                    })()
                  };
                }
              } catch (error) {
                console.error('Erreur récupération item:', error);
                return null;
              }
            })
          );
          
          // Filtrer les items null
          items = items.filter(item => item !== null);
        }

        // Filtrer par marque si spécifiée
        if (brand && brand !== 'all') {
          const hasBrandItems = Array.from(orderBrands).includes(brand);
          if (!hasBrandItems) {
            return null;
          }
        }

        return {
          id: order.id,
          orderNumber: order.fields['Numero de commande'] || '',
          status: order.fields.Statut || 'En attente',
          orderDate: order.fields['Date de commande'] || '',
          subtotal: order.fields['Sous-total'] || 0,
          shippingCost: order.fields['Frais de livraison'] || 0,
          discount: order.fields.Reduction || 0,
          total: order.fields.Total || 0,
          shippingAddress: order.fields['Adresse de livraison'] || '',
          country: order.fields['Pays de livraison'] || '',
          paymentMethod: order.fields['Methode de paiement'] || '',
          promoCode: order.fields['Code promo'] || '',
          items: items,
          client: clientInfo,
          brands: Array.from(orderBrands) // Ajouter les marques de la commande
        };
      })
    );

    // Filtrer les commandes null
    const filteredOrders = orders.filter(order => order !== null);

    return NextResponse.json({ orders: filteredOrders });

  } catch (error) {
    console.error('Erreur admin orders:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
