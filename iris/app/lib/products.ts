export type Product = {
	id: string;
	slug: string;
	title: string;
	brand: string;
	description: string;
	price: number;
	images: string[];
	sizes: number[];
	colors: string[];
	categories: string[];
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

export const products: Product[] = [
	{
		id: "1",
		slug: "air-zoom-pegasus-40",
		title: "Air Zoom Pegasus 40",
		brand: "Nike",
		description: "Chaussure de running polyvalente avec amorti réactif.",
		price: 129.99,
		images: [
			"/products/nike-pegasus-40-1.jpg",
			"/products/nike-pegasus-40-2.jpg",
		],
		sizes: [38, 39, 40, 41, 42, 43, 44],
		colors: ["noir", "blanc"],
		categories: ["running"],
		featured: true,
	},
	{
		id: "2",
		slug: "ultraboost-23",
		title: "Ultraboost 23",
		brand: "Adidas",
		description: "Confort ultime et retour d'énergie exceptionnel.",
		price: 179.99,
		images: [
			"/products/adidas-ultraboost-23-1.jpg",
			"/products/adidas-ultraboost-23-2.jpg",
		],
		sizes: [36, 37, 38, 39, 40, 41, 42],
		colors: ["gris", "bleu"],
		categories: ["running", "lifestyle"],
		featured: true,
	},
	{
		id: "3",
		slug: "classic-leather",
		title: "Classic Leather",
		brand: "Reebok",
		description: "Icône lifestyle en cuir premium.",
		price: 89.99,
		images: [
			"/products/reebok-classic-leather-1.jpg",
			"/products/reebok-classic-leather-2.jpg",
		],
		sizes: [38, 39, 40, 41, 42, 43, 44, 45],
		colors: ["blanc"],
		categories: ["lifestyle"],
	},
	{
		id: "4",
		slug: "gel-kayano-30",
		title: "GEL-Kayano 30",
		brand: "ASICS",
		description: "Stabilité et confort longue distance.",
		price: 199.99,
		images: [
			"/products/asics-gel-kayano-30-1.jpg",
			"/products/asics-gel-kayano-30-2.jpg",
		],
		sizes: [40, 41, 42, 43, 44, 45, 46],
		colors: ["noir", "vert"],
		categories: ["running"],
	},
];

export function getAllBrands(): string[] {
	return Array.from(new Set(products.map((p) => p.brand))).sort();
}

export function getProductBySlug(slug: string): Product | undefined {
	return products.find((p) => p.slug === slug);
}

export function searchProducts(filter: ProductFilter = {}): Product[] {
	const { query, brands, size, priceMin, priceMax, category } = filter;
	return products.filter((p) => {
		if (query) {
			const q = query.toLowerCase();
			if (!p.title.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q)) return false;
		}
		if (brands && brands.length > 0 && !brands.includes(p.brand)) return false;
		if (typeof size === "number" && !p.sizes.includes(size)) return false;
		if (typeof priceMin === "number" && p.price < priceMin) return false;
		if (typeof priceMax === "number" && p.price > priceMax) return false;
		if (category && !p.categories.includes(category)) return false;
		return true;
	});
}

export function getFeaturedProducts(): Product[] {
	return products.filter((p) => p.featured);
} 