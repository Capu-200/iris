import { searchProducts, getAllBrands } from "../lib/products";
import ProductsFilters from "./products-filters";
import ProductsGrid from "./products-grid";

export default function ProductsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
	const q = typeof searchParams.q === 'string' ? searchParams.q : undefined;
	const brand = typeof searchParams.brand === 'string' ? searchParams.brand : undefined;
	const size = typeof searchParams.size === 'string' ? Number(searchParams.size) : undefined;
	const priceMin = typeof searchParams.min === 'string' ? Number(searchParams.min) : undefined;
	const priceMax = typeof searchParams.max === 'string' ? Number(searchParams.max) : undefined;

	const brands = getAllBrands();
	const products = searchProducts({ query: q, brands: brand ? [brand] : undefined, size, priceMin, priceMax });

	return (
		<main className="max-w-6xl mx-auto px-4 py-8">
			<h1 className="text-2xl font-semibold mb-6">Tous les produits</h1>
			<div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
				<ProductsFilters brands={brands} />
				<ProductsGrid products={products} />
			</div>
		</main>
	);
} 