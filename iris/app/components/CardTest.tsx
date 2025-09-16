import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts } from "@/app/lib/products";


export default function CardTest() {
    const featured = getFeaturedProducts();
    return (
        <section>
		    <h2 className="text-xl font-semibold mb-4">Produits mis en avant</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {featured.map((p) => (
                    <Link key={p.id} href={`/products/${p.slug}`} className="group block border border-black/10 dark:border-white/10 rounded-lg overflow-hidden transition-shadow">
                        <div className="relative aspect-[4/3] bg-neutral-100 dark:bg-neutral-900">
                            <Image src={p.images[0] || "/placeholder.png"} alt={p.title} fill className="object-cover" />
                        </div>
                    {/* <Image src={p.images[0] || "/placeholder.png"} alt={p.title} fill className="relative object-cover aspect-square w-full rounded-lg bg-gray-200 group-hover:opacity-75 xl:aspect-7/8" /> */}
                        <div className="p-4">
                            <div className="text-sm text-neutral-500">{p.brand}</div>
                            <div className="font-medium">{p.title}</div>
                            <div className="mt-1">{p.price.toFixed(2)} €</div>
                        </div>
                    </Link>
                ))} 
            </div>
        </section>
    )
}