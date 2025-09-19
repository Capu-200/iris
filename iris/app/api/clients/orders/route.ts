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
      console.error('Erreur récupération client:', clientResponse.status);
      return NextResponse.json({ error: "Client non trouvé" }, { status: 404 });
    }

    const clientData = await clientResponse.json();
    const orderIds = clientData.fields.Commandes || [];
    
    console.log('IDs de commande trouvés:', orderIds);

    if (orderIds.length === 0) {
      return NextResponse.json({ orders: [] });
    }

    // Récupérer les détails de chaque commande directement par son ID
    const ordersWithItems = await Promise.all(
      orderIds.map(async (orderId: string) => {
        try {
          // Récupérer la commande directement par son ID
          const orderResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Commandes/${orderId}`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
          });

          if (!orderResponse.ok) {
            console.error(`Erreur récupération commande ${orderId}:`, orderResponse.status);
            return null;
          }

          const order = await orderResponse.json();
          const orderNumber = order.fields['Numero de commande'];

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
                        image: productData.fields.Image?.[0]?.url || null,
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
                  productId: item.fields['Produit ID']?.[0] || '',
                  name: item.fields['Nom du produit'] || '',
                  quantity: item.fields.Quantite || 0,
                  size: item.fields.Taille || null,
                  unitPrice: item.fields['Prix unitaire'] || 0,
                  totalPrice: item.fields['Prix total'] || 0,
                  image: item.fields.Image?.[0]?.url || null,
                  product: productDetails
                };
              })
            );
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
            items
          };
        } catch (error) {
          console.error(`Erreur traitement commande ${orderId}:`, error);
          return null;
        }
      })
    );

    // Filtrer les commandes null et trier par date
    const validOrders = ordersWithItems
      .filter(order => order !== null)
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

    console.log('Commandes valides trouvées:', validOrders.length);

    return NextResponse.json({ orders: validOrders });

  } catch (error) {
    console.error('Erreur récupération commandes:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
