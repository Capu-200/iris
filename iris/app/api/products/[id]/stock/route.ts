import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { quantity, operation = 'subtract' } = await request.json();

    if (!id || quantity === undefined || quantity <= 0) {
      return NextResponse.json({ 
        error: "ID de produit et quantité requise" 
      }, { status: 400 });
    }

    const BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
    const API_KEY = process.env.AIRTABLE_API_KEY;

    if (!BASE_ID || !API_KEY) {
      return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
    }

    console.log(`📦 Mise à jour du stock du produit ${id}: ${operation} ${quantity}`);

    // Récupérer le stock actuel du produit
    const productResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Produits/${id}`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });

    if (!productResponse.ok) {
      return NextResponse.json({ 
        error: "Produit non trouvé" 
      }, { status: 404 });
    }

    const productData = await productResponse.json();
    const currentStock = productData.fields.Stock || 0;

    // Calculer le nouveau stock
    let newStock;
    if (operation === 'subtract') {
      newStock = Math.max(0, currentStock - quantity);
    } else if (operation === 'add') {
      newStock = currentStock + quantity;
    } else {
      return NextResponse.json({ 
        error: "Opération invalide. Utilisez 'add' ou 'subtract'" 
      }, { status: 400 });
    }

    // Mettre à jour le stock
    const updateResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Produits/${id}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fields: {
          "Stock": newStock
        }
      })
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      console.error("❌ Erreur Airtable:", errorData);
      return NextResponse.json({ 
        error: "Erreur mise à jour stock", 
        details: errorData 
      }, { status: 500 });
    }

    const result = await updateResponse.json();
    console.log(`✅ Stock mis à jour: ${currentStock} → ${newStock}`);

    return NextResponse.json({ 
      success: true, 
      productId: id,
      previousStock: currentStock,
      newStock: newStock,
      operation: operation,
      quantity: quantity
    });

  } catch (error) {
    console.error("❌ Erreur update stock:", error);
    return NextResponse.json({ 
      error: "Erreur serveur", 
      details: error instanceof Error ? error.message : "Erreur inconnue"
    }, { status: 500 });
  }
}
