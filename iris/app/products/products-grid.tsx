import Link from 'next/link';
import Image from 'next/image';
import type { Product } from "../lib/products";

export default function ProductsGrid({ products }: { products: Product[] }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
			{products.map((p) => (
				<Link key={p.id} href={`/products/${p.slug}`} className="group block border border-black/10 dark:border-white/10 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
					<div className="relative aspect-[4/3] bg-neutral-100 dark:bg-neutral-900">
						<Image src={p.images[0] || '/placeholder.png'} alt={p.title} fill className="object-cover" />
					</div>
					<div className="p-4">
						<div className="text-sm text-neutral-500">{p.brand}</div>
						<div className="font-medium">{p.title}</div>
						<div className="mt-1">{p.price.toFixed(2)} €</div>
					</div>
				</Link>
			))}
			{products.length === 0 && (
				<div className="col-span-full text-neutral-500">Aucun produit trouvé.</div>
			)}
		</div>
	);
} 