import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password, phone } = await request.json();
    
    const BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
    const API_KEY = process.env.AIRTABLE_API_KEY;

    if (!BASE_ID || !API_KEY) {
      console.error('❌ Configuration manquante');
      return NextResponse.json({ success: false, error: "Configuration manquante" }, { status: 500 });
    }

    // Vérifier si l'email existe déjà
    const existingResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Clients?filterByFormula={Email}='${email}'`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });

    if (existingResponse.ok) {
      const existingData = await existingResponse.json();
      if (existingData.records.length > 0) {
        return NextResponse.json({ success: false, error: "Cet email est déjà utilisé" }, { status: 400 });
      }
    }

    // Créer le nouveau client avec le mot de passe
    const clientRecord = {
      fields: {
        'Prenom': firstName,
        'Nom': lastName,
        'Email': email,
        'Mot de passe': password, // Stocker le mot de passe
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
      console.error('❌ Erreur création client:', errorText);
      return NextResponse.json({ success: false, error: "Erreur lors de la création du compte" }, { status: 500 });
    }

    const result = await response.json();

    const user = {
      id: result.id,
      email: email,
      firstName: firstName,
      lastName: lastName,
      phone: phone || ''
    };

    return NextResponse.json({ success: true, user });

  } catch (error) {
    console.error('❌ Erreur d\'inscription:', error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
} 