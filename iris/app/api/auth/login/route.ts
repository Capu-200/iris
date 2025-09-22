import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    const BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
    const API_KEY = process.env.AIRTABLE_API_KEY;

    if (!BASE_ID || !API_KEY) {
      console.error('❌ Configuration manquante - BASE_ID:', !!BASE_ID, 'API_KEY:', !!API_KEY);
      return NextResponse.json({ success: false, error: "Configuration manquante" }, { status: 500 });
    }

    // Rechercher le client par email
    const url = `https://api.airtable.com/v0/${BASE_ID}/Clients?filterByFormula={Email}='${email}'`;
    
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });


    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur Airtable:', errorText);
      return NextResponse.json({ success: false, error: "Erreur de connexion" }, { status: 500 });
    }

    const data = await response.json();

    if (data.records.length === 0) {
      return NextResponse.json({ success: false, error: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    const client = data.records[0];
    const clientData = client.fields;

    // Vérifier le mot de passe
    const storedPassword = clientData['Mot de passe'] || clientData['mot de passe'] || clientData['Password'];
    
    if (!storedPassword) {
      return NextResponse.json({ success: false, error: "Compte non configuré" }, { status: 401 });
    }

    if (storedPassword !== password) {
      return NextResponse.json({ success: false, error: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    // Vérifier que les champs existent et ont des valeurs
    const user = {
      id: client.id,
      email: clientData['Email'] || email,
      firstName: clientData['Prenom'] || clientData['Prénom'] || 'Utilisateur',
      lastName: clientData['Nom'] || 'Inconnu',
      phone: clientData['Telephone'] || clientData['Téléphone'] || ''
    };

    return NextResponse.json({ success: true, user });

  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
} 