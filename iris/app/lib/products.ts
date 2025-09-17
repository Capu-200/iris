// Modèle de données correspondant à la structure Airtable
export type Product = {
	id: string;
	slug: string;
	title: string; // Modèle
	brand: string; // Marque
	category: string; // Catégorie
	price: number; // Prix (165.00 EUR)
	sizesAvailable: number[]; // Tailles disponibles (liste séparée par ;)
	images: string[]; // Images (liste d'URL séparée par ;)
	stock: number; // Stock (nombre)
	manufacturingOrigin: string; // Origine fabrication
	intro: string; // Intro (texte)
	materials: string; // Matériaux
	description: string; // Description
	featured?: boolean;
};

export type ProductFilter = {
	query?: string;
	brands?: string[];
	size?: number;
	priceMin?: number;
	priceMax?: number;
	category?: string;
};

// Import des fonctions Airtable
import { 
	fetchProductsFromAirtable, 
	fetchProductBySlugFromAirtable, 
	fetchBrandsFromAirtable, 
	fetchCategoriesFromAirtable, 
	searchProductsFromAirtable 
} from './api/airtable';

// Cache pour éviter les appels API répétés
let productsCache: Product[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fonction pour vérifier si le cache est valide
function isCacheValid(): boolean {
	return productsCache !== null && (Date.now() - cacheTimestamp) < CACHE_DURATION;
}

// Fonction pour récupérer les produits (avec cache)
export async function getProducts(): Promise<Product[]> {
	if (isCacheValid()) {
		return productsCache!;
	}

	try {
		productsCache = await fetchProductsFromAirtable();
		cacheTimestamp = Date.now();
		return productsCache;
	} catch (error) {
		console.error('Erreur lors de la récupération des produits:', error);
		// Retourner les données de fallback en cas d'erreur
		return getFallbackProducts();
	}
}

// Fonction pour récupérer un produit par slug
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
	try {
		return await fetchProductBySlugFromAirtable(slug);
	} catch (error) {
		console.error('Erreur lors de la récupération du produit:', error);
		// Fallback sur les données locales
		const fallbackProducts = getFallbackProducts();
		return fallbackProducts.find(p => p.slug === slug);
	}
}

// Fonction pour récupérer toutes les marques
export async function getAllBrands(): Promise<string[]> {
	try {
		return await fetchBrandsFromAirtable();
	} catch (error) {
		console.error('Erreur lors de la récupération des marques:', error);
		const fallbackProducts = getFallbackProducts();
		return Array.from(new Set(fallbackProducts.map(p => p.brand))).sort();
	}
}

// Fonction pour récupérer toutes les catégories
export async function getAllCategories(): Promise<string[]> {
	try {
		return await fetchCategoriesFromAirtable();
	} catch (error) {
		console.error('Erreur lors de la récupération des catégories:', error);
		const fallbackProducts = getFallbackProducts();
		return Array.from(new Set(fallbackProducts.map(p => p.category))).sort();
	}
}

// Fonction pour rechercher des produits
export async function searchProducts(filter: ProductFilter = {}): Promise<Product[]> {
	try {
		return await searchProductsFromAirtable(filter);
	} catch (error) {
		console.error('Erreur lors de la recherche de produits:', error);
		// Fallback sur les données locales
		const fallbackProducts = getFallbackProducts();
		return filterProducts(fallbackProducts, filter);
	}
}

// Fonction pour récupérer les produits en vedette
export async function getFeaturedProducts(): Promise<Product[]> {
	try {
		const products = await getProducts();
		return products.filter(p => p.featured);
	} catch (error) {
		console.error('Erreur lors de la récupération des produits en vedette:', error);
		const fallbackProducts = getFallbackProducts();
		return fallbackProducts.filter(p => p.featured);
	}
}

// Fonction de fallback avec des données locales
function getFallbackProducts(): Product[] {
	return [
		{
			id: "1",
			slug: "air-zoom-pegasus-40",
			title: "Air Zoom Pegasus 40",
			brand: "Nike",
			category: "Running",
			price: 129.99,
			sizesAvailable: [38, 39, 40, 41, 42, 43, 44],
			images: [
				"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop",
				"https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=600&fit=crop",
				"https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=600&fit=crop"
			],
			stock: 25,
			manufacturingOrigin: "Vietnam",
			intro: "La chaussure de running Nike Air Zoom Pegasus 40 continue la tradition d'excellence avec des améliorations notables.",
			materials: "Mesh respirant, Mousse Nike React, Unité Zoom Air",
			description: "Chaussure de running polyvalente avec amorti réactif pour tous types de coureurs. Conçue pour offrir un équilibre parfait entre confort, durabilité et performance.",
			featured: true,
		},
		{
			id: "2",
			slug: "ultraboost-23",
			title: "Ultraboost 23",
			brand: "Adidas",
			category: "Running",
			price: 179.99,
			sizesAvailable: [36, 37, 38, 39, 40, 41, 42],
			images: [
				"https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=600&fit=crop",
				"https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=600&fit=crop",
				"https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&h=600&fit=crop"
			],
			stock: 18,
			manufacturingOrigin: "Allemagne",
			intro: "L'Ultraboost 23 repousse les limites du confort avec sa technologie BOOST révolutionnaire.",
			materials: "Primeknit, Technologie BOOST, Semelle Continental",
			description: "Confort ultime et retour d'énergie exceptionnel pour des performances optimales à chaque foulée.",
			featured: true,
		},
		{
			id: "3",
			slug: "classic-leather",
			title: "Classic Leather",
			brand: "Reebok",
			category: "Lifestyle",
			price: 89.99,
			sizesAvailable: [38, 39, 40, 41, 42, 43, 44, 45],
			images: [
				"https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&h=600&fit=crop",
				"https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&h=600&fit=crop"
			],
			stock: 32,
			manufacturingOrigin: "Corée du Sud",
			intro: "Un classique intemporel qui traverse les générations avec style et authenticité.",
			materials: "Cuir pleine fleur, Semelle en caoutchouc, Doublure textile",
			description: "Icône lifestyle en cuir premium, parfaite pour un look décontracté et élégant.",
			featured: false,
		},
		{
			id: "4",
			slug: "gel-kayano-30",
			title: "GEL-Kayano 30",
			brand: "ASICS",
			category: "Running",
			price: 199.99,
			sizesAvailable: [40, 41, 42, 43, 44, 45, 46],
			images: [
				"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
				"https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&h=600&fit=crop"
			],
			stock: 15,
			manufacturingOrigin: "Japon",
			intro: "La 30ème édition de la GEL-Kayano offre un support et un confort inégalés pour les longues distances.",
			materials: "Mesh technique, Technologie GEL, Mousse FF BLAST PLUS",
			description: "Stabilité et confort longue distance pour les coureurs en surpronation.",
			featured: false,
		},
	];
}

// Fonction utilitaire pour filtrer les produits (fallback)
function filterProducts(products: Product[], filter: ProductFilter): Product[] {
	const { query, brands, size, priceMin, priceMax, category } = filter;
	return products.filter(p => {
		if (query) {
			const q = query.toLowerCase();
			if (!p.title.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q)) return false;
		}
		if (brands && brands.length > 0 && !brands.includes(p.brand)) return false;
		if (typeof size === "number" && !p.sizesAvailable.includes(size)) return false;
		if (typeof priceMin === "number" && p.price < priceMin) return false;
		if (typeof priceMax === "number" && p.price > priceMax) return false;
		if (category && p.category.toLowerCase() !== category.toLowerCase()) return false;
		return true;
	});
}

// Fonction pour vider le cache (utile pour le développement)
export function clearProductsCache(): void {
	productsCache = null;
	cacheTimestamp = 0;
}
