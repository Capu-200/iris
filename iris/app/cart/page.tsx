'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../lib/cart';

export default function CartPage() {
	const { state, setQuantity, removeItem, totalItems, totalPrice, clear } = useCart();
	return (
		<main className="max-w-6xl mx-auto px-4 py-8">
			<h1 className="text-2xl font-semibold mb-6">Panier</h1>
			{state.items.length === 0 ? (
				<div className="text-neutral-600 dark:text-neutral-300">
					Votre panier est vide. <Link className="underline" href="/products">Voir les produits</Link>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8">
					<section className="space-y-4">
						{state.items.map((i) => (
							<div key={`${i.productId}-${i.size ?? 'any'}`} className="flex items-center gap-4 border border-black/10 dark:border-white/10 rounded-lg p-3">
								<div className="relative h-20 w-28 bg-neutral-100 dark:bg-neutral-900 rounded overflow-hidden">
									<Image src={i.image || '/placeholder.png'} alt={i.title} fill className="object-cover" />
								</div>
								<div className="flex-1">
									<div className="font-medium">{i.title}</div>
									<div className="text-sm text-neutral-500">Pointure {i.size ?? '-'}</div>
									<div className="mt-1">{i.price.toFixed(2)} €</div>
								</div>
								<div className="flex items-center gap-2">
									<input className="w-16 border rounded px-2 py-1 bg-transparent" type="number" min={1} value={i.quantity} onChange={(e) => setQuantity(i.productId, Math.max(1, Number(e.target.value)), i.size)} />
									<button className="text-sm underline" onClick={() => removeItem(i.productId, i.size)}>Supprimer</button>
								</div>
							</div>
						))}
					</section>
					<aside className="border border-black/10 dark:border-white/10 rounded-lg p-4 h-max">
						<h2 className="text-lg font-semibold mb-2">Récapitulatif</h2>
						<div className="flex justify-between py-1"><span>Articles</span><span>{totalItems}</span></div>
						<div className="flex justify-between py-1 font-medium"><span>Total</span><span>{totalPrice.toFixed(2)} €</span></div>
						<button className="mt-4 w-full bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded font-medium">Passer la commande</button>
						<button className="mt-2 w-full text-sm underline" onClick={clear}>Vider le panier</button>
					</aside>
				</div>
			)}
		</main>
	);
} 