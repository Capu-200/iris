'use client';

import Link from 'next/link';
import { useCart } from '../lib/cart';
import Logo from '@/public/Logo-vert.svg'
import Image from 'next/image';

export default function Header() {
	const { totalItems } = useCart();
	return (
		<header className="w-full border-b bg-gray-50 border-black/10 dark:border-white/10">
			<div className="mx-auto px-4 py-4 flex items-center justify-between">
				<Link href="/" className="text-xl font-semibold flex items-center gap-2 text-[#576F66]">
				<Image className='w-5' src={Logo} alt="Logo en forme de fleur"/>
				Iris
				</Link>
				<nav className="flex items-center gap-6">
					<Link href="/products" className="hover:text-black hover:font-semibold text-gray-800">Produits</Link>
					<Link href="/login" className="hover:text-black hover:font-semibold text-gray-800">Compte</Link>
					<Link href="/cart" className="hover:text-black hover:font-semibold text-gray-800 ">Panier ({totalItems})</Link>
				</nav>
			</div>
		</header>
	);
} 