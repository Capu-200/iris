import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
    }

    const BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
    const API_KEY = process.env.AIRTABLE_API_KEY;

    if (!BASE_ID || !API_KEY) {
      return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
    }

    // Rechercher le client par email
    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Clients?filterByFormula={Email}='${email}'`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Erreur de connexion" }, { status: 500 });
    }

    const data = await response.json();
    
    if (data.records.length === 0) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    const client = data.records[0];
    
    // Vérifier le mot de passe stocké dans Airtable
    const storedPassword = client.fields['Mot de passe'] || client.fields.Password || '';
    
    if (storedPassword !== password) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    const user = {
      id: client.id,
      email: client.fields.Email || '',
      firstName: client.fields.Prenom || '',
      lastName: client.fields.Nom || '',
      role: client.fields.Role || 'client'
    };

    return NextResponse.json({ user });

  } catch (error) {
    console.error('Erreur login:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
