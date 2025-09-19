import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
    const API_KEY = process.env.AIRTABLE_API_KEY;

    if (!BASE_ID || !API_KEY) {
      return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
    }

    // Récupérer tous les codes promo actifs
    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Codes promo?filterByFormula={Actif}=1`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Airtable API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Filtrer les codes valides (dates et utilisations)
    const now = new Date();
    const validCodes = data.records
      .map((record: any) => {
        const fields = record.fields;
        const startDate = new Date(fields['Date de debut'] || '');
        const endDate = new Date(fields['Date de fin'] || '');
        const currentUses = fields['Nombre utilisations actuelles'] || 0;
        const maxUses = fields['Nombre utilisations max'] || 999999;

        // Vérifier si le code est valide
        if (now < startDate || now > endDate) return null;
        if (currentUses >= maxUses) return null;

        return {
          code: fields['Code'] || '',
          type: fields['Type'] || '',
          value: fields['Valeur'] || 0,
          description: fields['Description'] || '',
          minimumAmount: fields['Montant minimum'] || 0,
          isShipping: fields['Type'] === 'Livraison gratuite' || fields['Type'] === 'Livraison'
        };
      })
      .filter((code: any) => code !== null);

    return NextResponse.json({ codes: validCodes });

  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
