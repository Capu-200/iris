import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, phone } = await request.json();
    const BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
    const API_KEY = process.env.AIRTABLE_API_KEY;

    if (!BASE_ID || !API_KEY) {
      return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
    }

    // Vérifier si le client existe déjà
    const existingClientResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Clients?filterByFormula={Email}='${email}'`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });

    if (existingClientResponse.ok) {
      const existingData = await existingClientResponse.json();
      if (existingData.records.length > 0) {
        return NextResponse.json({ clientId: existingData.records[0].id });
      }
    }

    // Créer un nouveau client
    const clientRecord = {
      fields: {
        'Prenom': firstName,
        'Nom': lastName,
        'Email': email,
        'Telephone': phone || '',
        'Date de creation': new Date().toISOString().split('T')[0],
        'Statut': 'Actif',
        'Total commandes': 0,
        'Nombre de commandes': 0
      }
    };

    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Clients`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientRecord)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Erreur création client: ${response.status}` }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json({ clientId: result.id });

  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
