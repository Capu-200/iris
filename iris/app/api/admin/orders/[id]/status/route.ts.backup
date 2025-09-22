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
