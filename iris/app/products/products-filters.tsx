'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function ProductsFilters({ brands }: { brands: string[] }) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const q = searchParams.get('q') ?? '';
	const brand = searchParams.get('brand') ?? '';
	const size = searchParams.get('size') ?? '';
	const min = searchParams.get('min') ?? '';
	const max = searchParams.get('max') ?? '';

	function update(param: string, value: string) {
		const next = new URLSearchParams(searchParams.toString());
		if (value) next.set(param, value); else next.delete(param);
		router.replace(`${pathname}?${next.toString()}`);
	}

	return (
		<aside className="border border-black/10 dark:border-white/10 rounded-lg p-4 h-max">
			<div className="space-y-4">
				<div>
					<label className="block text-sm mb-1">Recherche</label>
					<input className="w-full border rounded px-2 py-1 bg-transparent" placeholder="modèle, marque..." defaultValue={q} onChange={(e) => update('q', e.target.value)} />
				</div>
				<div>
					<label className="block text-sm mb-1">Marque</label>
					<select className="w-full border rounded px-2 py-1 bg-transparent" value={brand} onChange={(e) => update('brand', e.target.value)}>
						<option value="">Toutes</option>
						{brands.map((b) => (
							<option key={b} value={b}>{b}</option>
						))}
					</select>
				</div>
				<div className="grid grid-cols-2 gap-2">
					<div>
						<label className="block text-sm mb-1">Pointure</label>
						<input className="w-full border rounded px-2 py-1 bg-transparent" inputMode="numeric" pattern="[0-9]*" value={size} onChange={(e) => update('size', e.target.value)} />
					</div>
					<div>
						<label className="block text-sm mb-1">Min €</label>
						<input className="w-full border rounded px-2 py-1 bg-transparent" inputMode="numeric" pattern="[0-9]*" value={min} onChange={(e) => update('min', e.target.value)} />
					</div>
					<div>
						<label className="block text-sm mb-1">Max €</label>
						<input className="w-full border rounded px-2 py-1 bg-transparent" inputMode="numeric" pattern="[0-9]*" value={max} onChange={(e) => update('max', e.target.value)} />
					</div>
				</div>
				<button className="text-sm underline" onClick={() => router.replace(pathname)}>Réinitialiser</button>
			</div>
		</aside>
	);
} 