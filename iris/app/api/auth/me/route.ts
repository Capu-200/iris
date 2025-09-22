import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Récupérer un vrai client admin depuis Airtable
    const BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
    const API_KEY = process.env.AIRTABLE_API_KEY;

    if (!BASE_ID || !API_KEY) {
      return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
    }

    // Chercher un client avec le rôle "Admin"
    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Clients?filterByFormula={Role}='Admin'&maxRecords=1`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Erreur récupération admin" }, { status: 500 });
    }

    const data = await response.json();
    
    if (data.records.length === 0) {
      // Si aucun admin trouvé, retourner null pour forcer la connexion
      return NextResponse.json({ user: null });
    }

    const adminClient = data.records[0];
    const user = {
      id: adminClient.id,
      email: adminClient.fields.Email || '',
      firstName: adminClient.fields.Prénom || '',
      lastName: adminClient.fields.Nom || '',
      role: 'admin'
    };

    return NextResponse.json({ user });

  } catch (error) {
    console.error('Erreur auth me:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
