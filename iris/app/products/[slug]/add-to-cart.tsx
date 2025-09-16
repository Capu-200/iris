'use client';

import { useState } from 'react';
import type { Product } from '../../lib/products';
import { useCart } from '../../lib/cart';

export default function AddToCart({ product }: { product: Product }) {
	const { addItem } = useCart();
	const [size, setSize] = useState<number | undefined>(product.sizes[0]);
	const [qty, setQty] = useState<number>(1);

	return (
		<div className="mt-6 space-y-4">
			<div>
				<label className="block text-sm mb-1">Pointure</label>
				<div className="flex flex-wrap gap-2">
					{product.sizes.map((s) => (
						<button
							key={s}
							onClick={() => setSize(s)}
							className={`px-3 py-1 rounded border ${size === s ? 'bg-black text-white dark:bg-white dark:text-black' : ''}`}
							type="button"
						>
							{s}
						</button>
					))}
				</div>
			</div>
			<div>
				<label className="block text-sm mb-1">Quantité</label>
				<input className="w-24 border rounded px-2 py-1 bg-transparent" type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value)))} />
			</div>
			<button
				onClick={() => size && addItem({ product, quantity: qty, size })}
				className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded font-medium"
				type="button"
			>
				Ajouter au panier
			</button>
		</div>
	);
} 