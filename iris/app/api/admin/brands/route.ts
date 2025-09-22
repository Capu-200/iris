import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
    const API_KEY = process.env.AIRTABLE_API_KEY;

    if (!BASE_ID || !API_KEY) {
      return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
    }

    // Récupérer tous les produits pour extraire les marques
    const productsResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Produits`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });

    if (!productsResponse.ok) {
      return NextResponse.json({ error: "Erreur récupération produits" }, { status: 500 });
    }

    const productsData = await productsResponse.json();
    
    // Compter les marques
    const brandCounts: { [key: string]: number } = {};
    
    productsData.records.forEach((product: any) => {
      const brand = product.fields.Marque;
      if (brand) {
        brandCounts[brand] = (brandCounts[brand] || 0) + 1;
      }
    });

    // Convertir en tableau trié
    const brands = Object.entries(brandCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({ brands });

  } catch (error) {
    console.error('Erreur admin brands:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
