import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: "ID de commande et statut requis" }, { status: 400 });
    }

    const BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
    const API_KEY = process.env.AIRTABLE_API_KEY;

    if (!BASE_ID || !API_KEY) {
      return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
    }

    console.log(`🔄 Mise à jour du statut de la commande ${id} vers: ${status}`);

    // Si la commande est confirmée, déduire le stock des produits
    if (status === 'Confirmée') {
      console.log('📦 Commande confirmée - déduction du stock...');
      
      try {
        // Récupérer les articles de la commande
        const orderResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Commandes/${id}`, {
          headers: { 'Authorization': `Bearer ${API_KEY}` }
        });

        if (orderResponse.ok) {
          const orderData = await orderResponse.json();
          const orderItems = orderData.fields.OrderItems || [];

          console.log(`🛍️ Récupération de ${orderItems.length} articles de la commande`);

          // Pour chaque article, déduire le stock
          for (const itemId of orderItems) {
            try {
              // Récupérer les détails de l'article
              const itemResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/OrderItems/${itemId}`, {
                headers: { 'Authorization': `Bearer ${API_KEY}` }
              });

              if (itemResponse.ok) {
                const itemData = await itemResponse.json();
                const productId = itemData.fields['Produit ID']?.[0];
                const quantity = itemData.fields['Quantite'] || 0;

                if (productId && quantity > 0) {
                  console.log(`📦 Déduction du stock: Produit ${productId}, Quantité ${quantity}`);
                  
                  // Appeler l'API de mise à jour du stock
                  const stockUpdateResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products/${productId}/stock`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      quantity: quantity,
                      operation: 'subtract'
                    })
                  });

                  if (stockUpdateResponse.ok) {
                    const stockResult = await stockUpdateResponse.json();
                    console.log(`✅ Stock mis à jour pour le produit ${productId}:`, stockResult);
                  } else {
                    console.error(`❌ Erreur mise à jour stock pour le produit ${productId}`);
                  }
                }
              }
            } catch (itemError) {
              console.error(`❌ Erreur récupération article ${itemId}:`, itemError);
            }
          }
        }
      } catch (stockError) {
        console.error('❌ Erreur lors de la déduction du stock:', stockError);
        // Ne pas faire échouer la mise à jour du statut si la déduction du stock échoue
      }
    }

    // Mettre à jour le statut de la commande
    const updateResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Commandes/${id}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fields: {
          "Statut": status
        }
      })
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      console.error("❌ Erreur Airtable:", errorData);
      return NextResponse.json({ 
        error: "Erreur mise à jour statut", 
        details: errorData 
      }, { status: 500 });
    }

    const result = await updateResponse.json();
    console.log("✅ Statut mis à jour avec succès:", result);

    return NextResponse.json({ success: true, status });

  } catch (error) {
    console.error("❌ Erreur update status:", error);
    return NextResponse.json({ 
      error: "Erreur serveur", 
      details: error instanceof Error ? error.message : "Erreur inconnue"
    }, { status: 500 });
  }
}
