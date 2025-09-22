import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
    const API_KEY = process.env.AIRTABLE_API_KEY;

    if (!BASE_ID || !API_KEY) {
      return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
    }

    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Clients/${id}`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Client non trouvé" }, { status: 404 });
    }

    const data = await response.json();
    const client = {
      id: data.id,
      firstName: data.fields.Prenom || '',
      lastName: data.fields.Nom || '',
      email: data.fields.Email || '',
      phone: data.fields.Telephone || '',
      totalOrders: data.fields['Total commandes'] || 0,
      orderCount: data.fields['Nombre de commandes'] || 0,
      createdAt: data.fields['Date de creation'] || '',
      status: data.fields.Statut || 'Actif'
    };

    return NextResponse.json({ client });

  } catch (error) {
    console.error('Erreur récupération client:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { firstName, lastName, email, phone } = await request.json();
    const BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
    const API_KEY = process.env.AIRTABLE_API_KEY;

    if (!BASE_ID || !API_KEY) {
      return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
    }

    const updateData = {
      fields: {
        'Prenom': firstName,
        'Nom': lastName,
        'Email': email,
        'Telephone': phone || ''
      }
    };

    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Clients/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Erreur mise à jour: ${response.status}` }, { status: response.status });
    }

    const result = await response.json();
    const updatedClient = {
      id: result.id,
      firstName: result.fields.Prenom || '',
      lastName: result.fields.Nom || '',
      email: result.fields.Email || '',
      phone: result.fields.Telephone || '',
      totalOrders: result.fields['Total commandes'] || 0,
      orderCount: result.fields['Nombre de commandes'] || 0,
      createdAt: result.fields['Date de creation'] || '',
      status: result.fields.Statut || 'Actif'
    };

    return NextResponse.json({ client: updatedClient });

  } catch (error) {
    console.error('Erreur mise à jour client:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
