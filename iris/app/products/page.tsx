import { searchProducts, getAllBrands, getAllCategories } from "../lib/products";
import ProductsFilters from "./products-filters";
import ProductsGrid from "./products-grid";
import SearchBar from "./search-bar";

export default async function ProductsPage({ 
	searchParams 
}: { 
	searchParams: { [key: string]: string | string[] | undefined } 
}) {
	const q = typeof searchParams.q === 'string' ? searchParams.q : undefined;
	const brand = typeof searchParams.brand === 'string' ? searchParams.brand : undefined;
	const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
	const size = typeof searchParams.size === 'string' ? Number(searchParams.size) : undefined;
	const priceMin = typeof searchParams.min === 'string' ? Number(searchParams.min) : undefined;
	const priceMax = typeof searchParams.max === 'string' ? Number(searchParams.max) : undefined;
	const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'newest';
	const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;

	const [brands, categories, allProducts] = await Promise.all([
		getAllBrands(),
		getAllCategories(),
		searchProducts({ 
			query: q, 
			brands: brand ? [brand] : undefined, 
			category,
			size, 
			priceMin, 
			priceMax 
		})
	]);

	// Tri des produits
	let sortedProducts = [...allProducts];
	switch (sort) {
		case 'price-low':
			sortedProducts.sort((a, b) => a.price - b.price);
			break;
		case 'price-high':
			sortedProducts.sort((a, b) => b.price - a.price);
			break;
		case 'name':
			sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
			break;
		case 'brand':
			sortedProducts.sort((a, b) => a.brand.localeCompare(b.brand));
			break;
		default: // 'newest'
			// Garder l'ordre par défaut (plus récent en premier)
			break;
	}

	// Pagination - 50 produits par page
	const PRODUCTS_PER_PAGE = 25;
	const totalProducts = sortedProducts.length;
	const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
	const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
	const endIndex = startIndex + PRODUCTS_PER_PAGE;
	const products = sortedProducts.slice(startIndex, endIndex);

	return (
		<main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
			<div className="max-w-7xl mx-auto px-4 py-12">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
						Collection Sneakers
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300">
						Découvrez notre sélection de sneakers premium
					</p>
				</div>

				{/* Barre de recherche indépendante */}
				<div className="mb-8">
					<SearchBar currentQuery={q} />
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
					{/* Filtres */}
					<ProductsFilters 
						brands={brands} 
						categories={categories}
						currentFilters={{
							brand, category, size, priceMin, priceMax, sort, page
						}}
					/>
					
					{/* Grille de produits */}
					<div className="space-y-6">
						{/* Compteur et tri */}
						<div className="flex items-center justify-between">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								{totalProducts} produit{totalProducts > 1 ? 's' : ''} trouvé{totalProducts > 1 ? 's' : ''}
							</p>
							{totalPages > 1 && (
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Page {page} sur {totalPages}
								</p>
							)}
						</div>

						<ProductsGrid 
							products={products} 
							totalProducts={totalProducts}
							currentPage={page}
							totalPages={totalPages}
						/>
					</div>
				</div>
			</div>
		</main>
	);
}
