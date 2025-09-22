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

    // Récupérer le client pour obtenir ses commandes
    const clientResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Clients/${clientId}`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });

    if (!clientResponse.ok) {
      return NextResponse.json({ error: "Client non trouvé" }, { status: 404 });
    }

    const clientData = await clientResponse.json();
    const orderIds = clientData.fields.Commandes || [];

    console.log('Numéros de commande trouvés:', orderIds);

    // Récupérer les détails de chaque commande
    const orders = [];
    for (const orderId of orderIds) {
      try {
        const orderResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Commandes/${orderId}`, {
          headers: { 'Authorization': `Bearer ${API_KEY}` }
        });

        if (orderResponse.ok) {
          const orderData = await orderResponse.json();
          
          // Récupérer les articles de cette commande
          const itemsResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/OrderItems?filterByFormula={Commande ID}='${orderId}'`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
          });

          let items = [];
          if (itemsResponse.ok) {
            const itemsData = await itemsResponse.json();
            
            items = await Promise.all(
              itemsData.records.map(async (item: { id: string; fields: Record<string, unknown> }) => {
                // Récupérer les détails du produit
                let productDetails = null;
                const produitId = item.fields['Produit ID'];
                if (produitId && Array.isArray(produitId) && produitId.length > 0) {
                  try {
                    const productResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Produits/${produitId[0]}`, {
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

                return {
                  id: item.id,
                  productId: Array.isArray(produitId) ? produitId[0] : '',
                  name: item.fields['Nom du produit'] || '',
                  quantity: item.fields.Quantite || 0,
                  size: item.fields.Taille || null,
                  unitPrice: item.fields['Prix unitaire'] || 0,
                  totalPrice: item.fields['Prix total'] || 0,
                  image: item.fields.Image || null,
                  product: productDetails
                };
              })
            );
          }

          orders.push({
            id: orderData.id,
            orderNumber: orderData.fields['Numero de commande'] || '',
            status: orderData.fields.Statut || 'En attente',
            orderDate: orderData.fields['Date de commande'] || '',
            subtotal: orderData.fields['Sous-total'] || 0,
            shippingCost: orderData.fields['Frais de livraison'] || 0,
            discount: orderData.fields.Reduction || 0,
            total: orderData.fields.Total || 0,
            shippingAddress: orderData.fields['Adresse de livraison'] || '',
            country: orderData.fields['Pays de livraison'] || '',
            paymentMethod: orderData.fields['Methode de paiement'] || '',
            promoCode: orderData.fields['Code promo'] || '',
            items: items
          });
        }
      } catch (error) {
        console.error('Erreur récupération commande:', error);
      }
    }

    console.log('Commandes valides trouvées:', orders.length);

    return NextResponse.json({ orders });

  } catch (error) {
    console.error('Erreur récupération commandes:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
