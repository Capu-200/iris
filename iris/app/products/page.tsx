import { searchProducts, getAllBrands, getAllCategories } from "../lib/products";
import ProductsFilters from "./products-filters";
import ProductsGrid from "./products-grid";
import SearchBar from "./search-bar";

export default async function ProductsPage({ 
	searchParams 
}: { 
	searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
	const params = await searchParams;
	const q = typeof params.q === 'string' ? params.q : undefined;
	const brand = typeof params.brand === 'string' ? params.brand : undefined;
	const category = typeof params.category === 'string' ? params.category : undefined;
	
	// Gestion des tailles multiples
	const sizeParam = params.size;
	let sizes: number[] | undefined = undefined;
	if (typeof sizeParam === 'string') {
		sizes = sizeParam.split(',').map(s => Number(s)).filter(s => !isNaN(s));
		if (sizes.length === 0) sizes = undefined;
	}
	
	const priceMin = typeof params.min === 'string' ? Number(params.min) : undefined;
	const priceMax = typeof params.max === 'string' ? Number(params.max) : undefined;
	const sort = typeof params.sort === 'string' ? params.sort : 'newest';
	const page = typeof params.page === 'string' ? Number(params.page) : 1;

	const [brands, categories, allProducts] = await Promise.all([
		getAllBrands(),
		getAllCategories(),
		searchProducts({ 
			query: q, 
			brands: brand ? [brand] : undefined, 
			category,
			size: sizes, 
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
				<div className="mb-8 pt-12">
					<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
						Collection Sneakers
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300">
						Découvrez notre collection de chaussures éco-responsables, 
						conçues avec des matériaux durables et un design moderne.
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
							brand, category, size: sizes, priceMin, priceMax, sort, page
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
