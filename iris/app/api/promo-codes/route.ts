import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code, subtotal } = await request.json();
    const BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
    const API_KEY = process.env.AIRTABLE_API_KEY;

    if (!BASE_ID || !API_KEY) {
      return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
    }

    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Codes promo?filterByFormula=AND({Code}='${code}',{Actif}=1)`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Erreur API: ${response.status}` }, { status: response.status });
    }

    const data = await response.json();
    
    if (data.records.length === 0) {
      return NextResponse.json({ error: 'Code promotionnel invalide' }, { status: 400 });
    }

    const promoCode = data.records[0].fields;
    const now = new Date();
    const startDate = new Date(promoCode['Date de debut'] || '');
    const endDate = new Date(promoCode['Date de fin'] || '');

    // Validations
    if (now < startDate || now > endDate) {
      return NextResponse.json({ error: 'Code promotionnel expiré' }, { status: 400 });
    }

    if (subtotal < (promoCode['Montant minimum'] || 0)) {
      return NextResponse.json({ error: `Montant minimum de ${promoCode['Montant minimum']}€ requis` }, { status: 400 });
    }

    if (promoCode['Nombre utilisations actuelles'] >= (promoCode['Nombre utilisations max'] || 999999)) {
      return NextResponse.json({ error: 'Code promotionnel épuisé' }, { status: 400 });
    }

    // Calcul de la réduction
    let discount = 0;
    if (promoCode['Type'] === 'Pourcentage') {
      discount = (subtotal * promoCode['Valeur']) / 100;
    } else if (promoCode['Type'] === 'Montant fixe') {
      discount = promoCode['Valeur'];
    } else if (promoCode['Type'] === 'Livraison gratuite') {
      return NextResponse.json({ discount: 0, type: 'shipping' });
    }

    return NextResponse.json({ 
      discount: Math.min(discount, subtotal),
      type: promoCode['Type'],
      description: promoCode['Description'] || ''
    });

  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
