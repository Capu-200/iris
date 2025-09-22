import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, searchProducts, Product } from '../../lib/products';
import AddToCart from './add-to-cart';

// Fonction pour déterminer le statut de stock
function getStockStatus(stock: number): { text: string; color: string; bgColor: string } {
	if (stock === 0) {
		return { text: 'Rupture', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/20' };
	} else if (stock <= 5) {
		return { text: 'Bientôt en rupture', color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/20' };
	} else if (stock <= 45) {
		return { text: 'Stock limité', color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/20' };
	} else {
		return { text: 'Disponible', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/20' };
	}
}

// Composant pour une carte de produit recommandé
function RecommendedProductCard({ product }: { product: Product }) {
	const stockStatus = getStockStatus(product.stock);
	const isOutOfStock = product.stock === 0;
	
	return (
		<Link href={`/products/${product.slug}`} className="group">
			<div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${
				isOutOfStock ? 'opacity-75' : ''
			}`}>
				{/* Image du produit */}
				<div className="relative aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
					<Image 
						src={product.images[0] || '/placeholder.png'} 
						alt={product.title} 
						fill 
						className={`object-cover transition-transform duration-300 ${
							isOutOfStock ? 'grayscale' : 'group-hover:scale-105'
						}`}
					/>
					
					{/* Overlay pour les produits en rupture de stock */}
					{isOutOfStock && (
						<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
							<div className="text-center text-white">
								<svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
								</svg>
								<p className="text-sm font-bold">Rupture</p>
							</div>
						</div>
					)}
					
					{/* Badge de statut */}
					<div className="absolute top-2 right-2">
						<span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color} ${stockStatus.bgColor}`}>
							{stockStatus.text}
						</span>
					</div>
				</div>
				
				{/* Informations du produit */}
				<div className="p-4">
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm text-gray-500 dark:text-gray-400">{product.brand}</span>
					</div>
					<h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-black dark:group-hover:text-white transition-colors">
						{product.title}
					</h3>
					<div className="flex items-center justify-between">
						<span className="text-md font-bold text-gray-900 dark:text-white">
							{product.price.toFixed(2)} €
						</span>
					</div>
				</div>
			</div>
		</Link>
	);
}

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const product = await getProductBySlug(slug);
	if (!product) return notFound();
	
	const stockStatus = getStockStatus(product.stock);
	const isOutOfStock = product.stock === 0;
	
	// Récupérer les produits recommandés (même marque ou même origine)
	const recommendedProducts = await searchProducts({
		brands: [product.brand],
		category: product.category
	}).then(products => 
		products.filter(p => p.id !== product.id).slice(0, 4)
	);
	
	// Si pas assez de produits de la même marque, ajouter des produits de la même origine
	if (recommendedProducts.length < 4) {
		const sameOriginProducts = await searchProducts({
			category: product.category
		}).then(products => 
			products.filter(p => 
				p.id !== product.id && 
				p.manufacturingOrigin === product.manufacturingOrigin &&
				!recommendedProducts.some(rec => rec.id === p.id)
			).slice(0, 4 - recommendedProducts.length)
		);
		recommendedProducts.push(...sameOriginProducts);
	}
	
	return (
		<main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
			<div className="max-w-7xl mx-auto px-4 py-12">
				{/* Breadcrumb */}
				<nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
					<span>Accueil</span>
					<span>/</span>
					<span>Produits</span>
					<span>/</span>
					<span className="text-gray-900 dark:text-white font-medium">{product.title}</span>
				</nav>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
					{/* Galerie d'images */}
					<div className="space-y-4">
						<div className="relative aspect-square bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl">
							<Image 
								src={product.images[0] || '/placeholder.png'} 
								alt={product.title} 
								fill 
								className={`object-cover transition-transform duration-500 ${
									isOutOfStock ? 'grayscale' : 'hover:scale-105'
								}`}
							/>
							
							{/* Overlay pour les produits en rupture de stock */}
							{isOutOfStock && (
								<div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
									<div className="text-center text-white">
										<svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
										</svg>
										<h3 className="text-2xl font-bold mb-2">Rupture de stock</h3>
										<p className="text-lg opacity-90">Produit temporairement indisponible</p>
									</div>
								</div>
							)}
							
							{/* Badge de statut de stock */}
							<div className="absolute top-4 left-4">
								<span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${stockStatus.color} ${stockStatus.bgColor}`}>
									{stockStatus.text}
								</span>
							</div>
							
							{/* Badge de stock limité */}
							{product.stock <= 45 && product.stock > 0 && (
								<div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
									Stock limité
								</div>
							)}
						</div>
						
						{/* Miniatures */}
						{product.images.length > 1 && (
							<div className="grid grid-cols-3 gap-3">
								{product.images.slice(1).map((image, index) => (
									<div key={index} className={`relative aspect-square bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer ${
										isOutOfStock ? 'grayscale' : ''
									}`}>
										<Image 
											src={image} 
											alt={`${product.title} ${index + 2}`} 
											fill 
											className={`object-cover transition-transform duration-300 ${
												isOutOfStock ? '' : 'hover:scale-110'
											}`}
										/>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Informations produit */}
					<div className="space-y-8">
						{/* Header */}
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
									{product.category}
								</span>
								<span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${stockStatus.color} ${stockStatus.bgColor}`}>
									{stockStatus.text}
								</span>
							</div>
							
							<div>
								<p className="text-lg text-gray-600 dark:text-gray-300 font-medium">{product.brand}</p>
								<h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-1">{product.title}</h1>
							</div>
							
							<div className="flex items-baseline space-x-2">
								<span className="text-3xl font-bold text-gray-900 dark:text-white">{product.price.toFixed(2)} €</span>
								<span className="text-sm text-gray-500 dark:text-gray-400">TTC</span>
							</div>
							
							{/* Informations de stock */}
							{!isOutOfStock && (
								<div className="text-sm text-gray-600 dark:text-gray-400">
									{product.stock} articles disponibles
								</div>
							)}
						</div>

						{/* Introduction */}
						<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
							<p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
								{product.intro}
							</p>
						</div>

						{/* Sélection et ajout au panier */}
						<AddToCart product={product} />

						{/* Détails techniques */}
						<div className="space-y-6">
							<div className="border-t border-gray-200 dark:border-gray-700 pt-6">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Matériaux</h3>
								<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
									{product.materials}
								</p>
							</div>

							{/* Description complète */}
							<div className="border-t border-gray-200 dark:border-gray-700 pt-6">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Description</h3>
								<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
									{product.description}
								</p>
							</div>

							{/* Caractéristiques */}
							<div className="border-t border-gray-200 dark:border-gray-700 pt-6">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Caractéristiques</h3>
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
									<div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
										<div className="text-2xl font-bold text-[#576F66] dark:text-blue-400">{product.sizesAvailable.length}</div>
										<div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Tailles disponibles</div>
									</div>
									<div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
										<div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{product.images.length}</div>
										<div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Photos</div>
									</div>
									<div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg">
										<div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{product.manufacturingOrigin}</div>
										<div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Origine</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Section recommandations */}
				{recommendedProducts.length > 0 && (
					<div className="mt-20 border-t border-gray-200 dark:border-gray-700 pt-12">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Vous pourriez aussi aimer</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
							{recommendedProducts.map((recommendedProduct) => (
								<RecommendedProductCard key={recommendedProduct.id} product={recommendedProduct} />
							))}
						</div>
					</div>
				)}
			</div>
		</main>
	);
}
