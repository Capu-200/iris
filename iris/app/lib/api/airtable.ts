// Service API pour Airtable
export interface AirtableRecord {
  id: string;
  fields: {
    'Modèle'?: string;
    'Marque'?: string;
    'Catégorie'?: string;
    'Prix'?: string; // Format: "165.00 EUR"
    'Tailles disponibles'?: string; // Format: "38;39;40;41;42"
    'Images'?: string; // Format: "url1;url2;url3"
    'Stock'?: number;
    'Origine fabrication'?: string;
    'Intro'?: string;
    'Matériaux'?: string;
    'Description'?: string;
  };
  createdTime: string;
}

export interface AirtableResponse {
  records: AirtableRecord[];
  offset?: string;
}

// Configuration Airtable
const AIRTABLE_BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.NEXT_PUBLIC_AIRTABLE_TABLE_NAME || 'Produits';
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;

if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) {
  console.warn('Variables d\'environnement Airtable manquantes');
}

// Fonction pour parser le prix depuis le format "165.00 EUR"
function parsePrice(priceString?: string): number {
  if (!priceString || typeof priceString !== 'string') {
    return 0;
  }
  const match = priceString.match(/(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : 0;
}

// Fonction pour parser les tailles depuis le format "38;39;40;41;42"
function parseSizes(sizesString?: string): number[] {
  if (!sizesString || typeof sizesString !== 'string') {
    return [];
  }
  return sizesString
    .split(';')
    .map(size => parseFloat(size.trim()))
    .filter(size => !isNaN(size))
    .sort((a, b) => a - b);
}

// Fonction pour parser les images depuis le format "url1;url2;url3"
function parseImages(imagesString?: string): string[] {
  if (!imagesString || typeof imagesString !== 'string') {
    return [];
  }
  return imagesString
    .split(';')
    .map(url => url.trim())
    .filter(url => url.length > 0);
}

// Fonction pour créer un slug à partir du modèle
function createSlug(model?: string): string {
  if (!model || typeof model !== 'string') {
    return 'produit-sans-nom';
  }
  return model
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Fonction pour obtenir une valeur de champ sécurisée
function getFieldValue<T>(field: T | undefined, defaultValue: T, fieldName: string): T {
  if (field === undefined || field === null) {
    return defaultValue;
  }
  return field;
}

// Fonction pour récupérer tous les produits depuis Airtable
export async function fetchProductsFromAirtable(): Promise<any[]> {
  if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) {
    console.error('Configuration Airtable manquante');
    return [];
  }

  try {
    // Encoder le nom de la table pour l'URL
    const encodedTableName = encodeURIComponent(AIRTABLE_TABLE_NAME);
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodedTableName}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur Airtable:', response.status, response.statusText, errorText);
      throw new Error(`Erreur Airtable: ${response.status} ${response.statusText}`);
    }

    const data: AirtableResponse = await response.json();
    
    // Transformer les données Airtable en format Product avec vérifications de sécurité
    return data.records.map(record => {
      const fields = record.fields;
      
      return {
        id: record.id,
        slug: createSlug(fields['Modèle']),
        title: getFieldValue(fields['Modèle'], 'Produit sans nom', 'Modèle'),
        brand: getFieldValue(fields['Marque'], 'Marque inconnue', 'Marque'),
        category: getFieldValue(fields['Catégorie'], 'Non classé', 'Catégorie'),
        price: parsePrice(fields['Prix']),
        sizesAvailable: parseSizes(fields['Tailles disponibles']),
        images: parseImages(fields['Images']),
        stock: getFieldValue(fields['Stock'], 0, 'Stock'),
        manufacturingOrigin: getFieldValue(fields['Origine fabrication'], 'Non spécifiée', 'Origine fabrication'),
        intro: getFieldValue(fields['Intro'], '', 'Intro') || 'Découvrez cette paire de chaussures qui allie style et confort pour accompagner vos journées. Conçue avec soin, elle s\'adapte à tous vos moments, que ce soit pour une sortie décontractée ou un usage quotidien.',
        materials: getFieldValue(fields['Matériaux'], '', 'Matériaux'),
        description: getFieldValue(fields['Description'], '', 'Description'),
      };
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des données Airtable:', error);
    return [];
  }
}

// Fonction pour récupérer un produit par slug
export async function fetchProductBySlugFromAirtable(slug: string): Promise<any | null> {
  const products = await fetchProductsFromAirtable();
  return products.find(product => product.slug === slug) || null;
}

// Fonction pour récupérer les marques uniques
export async function fetchBrandsFromAirtable(): Promise<string[]> {
  const products = await fetchProductsFromAirtable();
  return Array.from(new Set(products.map(p => p.brand))).sort();
}

// Fonction pour récupérer les catégories uniques
export async function fetchCategoriesFromAirtable(): Promise<string[]> {
  const products = await fetchProductsFromAirtable();
  return Array.from(new Set(products.map(p => p.category))).sort();
}

// Fonction pour rechercher des produits avec filtres
export async function searchProductsFromAirtable(filters: {
  query?: string;
  brands?: string[];
  size?: number | number[]; // Modifier pour accepter un tableau
  priceMin?: number;
  priceMax?: number;
  category?: string;
}): Promise<any[]> {
  const products = await fetchProductsFromAirtable();
  
  const { query, brands, size, priceMin, priceMax, category } = filters;
  
  return products.filter(product => {
    if (query) {
      const q = query.toLowerCase();
      if (!product.title.toLowerCase().includes(q) && !product.brand.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (brands && brands.length > 0 && !brands.includes(product.brand)) {
      return false;
    }
    
    // Gestion des tailles multiples
    if (size !== undefined) {
      if (Array.isArray(size)) {
        // Si c'est un tableau, vérifier qu'au moins une taille est disponible
        if (size.length > 0 && !size.some(s => product.sizesAvailable.includes(s))) {
          return false;
        }
      } else {
        // Si c'est un nombre, vérifier que la taille est disponible
        if (!product.sizesAvailable.includes(size)) {
          return false;
        }
      }
    }
    
    if (typeof priceMin === "number" && product.price < priceMin) {
      return false;
    }
    if (typeof priceMax === "number" && product.price > priceMax) {
      return false;
    }
    if (category && product.category.toLowerCase() !== category.toLowerCase()) {
      return false;
    }
    return true;
  });
}
