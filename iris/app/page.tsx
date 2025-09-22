import Link from "next/link";
import Image from "next/image";

import { getFeaturedProducts } from "./lib/products";
import {Button, ButtonGroup} from "@heroui/button";
import { ChevronRightIcon } from "@heroicons/react/16/solid";

import Collections from "@/app/components/Collections";
import ProductList from "./components/ProductList";
import Features from "./components/Features";
import { Footer } from "./components/Footer";

export default function Home() {
	const featured = getFeaturedProducts();
	return (
		<main className="mx-auto py-10 bg-gray-50 ">

      <section className="py-32">
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
            <div className="mr-auto place-self-center lg:col-span-7">
                <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl text-gray-950">Collection Rentrée 2025</h1>
                <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl">Découvrez les dernières tendances sneakers pour habiller vos pieds pour la rentrée.</p>
                <a href="/products" className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100">
                    Découvrir la collection
                </a> 
            </div>
            <div className="hidden lg:col-span-5 lg:flex">
              {/* <Image src='https://img.heroui.chat/image/fashion?w=600&h=600&u=15' width={400} height={400} alt='Logo en forme de fleur'/> */}
              <img 
                src="https://www.julesetmargot.fr/wp-content/uploads/2024/02/Veja-Sahara_4.jpg" 
                alt="Summer collection" 
                className="w-full mt-8 md:mt-0 rounded-lg shadow-xl"
              />
            </div>                
        </div>
      </section>

      <Collections/>
      <ProductList/>
      <Features/>
      <Footer/>

		</main>
	);
}
