import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '../../lib/products';
import AddToCart from './add-to-cart';

export default function ProductDetail({ params }: { params: { slug: string } }) {
	const product = getProductBySlug(params.slug);
	if (!product) return notFound();
	return (
		<main className="max-w-6xl mx-auto px-4 py-8">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div>
					<div className="relative aspect-[4/3] bg-neutral-100 dark:bg-neutral-900 rounded-lg overflow-hidden">
						<Image src={product.images[0] || '/placeholder.png'} alt={product.title} fill className="object-cover" />
					</div>
				</div>
				<div>
					<div className="text-sm text-neutral-500">{product.brand}</div>
					<h1 className="text-2xl font-semibold">{product.title}</h1>
					<div className="text-lg mt-2">{product.price.toFixed(2)} €</div>
					<p className="mt-4 text-neutral-600 dark:text-neutral-300">{product.description}</p>
					<AddToCart product={product} />
				</div>
			</div>
		</main>
	);
} 