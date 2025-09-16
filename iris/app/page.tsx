import Link from "next/link";
import Image from "next/image";

import { getFeaturedProducts } from "./lib/products";
import {Button, ButtonGroup} from "@heroui/button";
import { ChevronRightIcon } from "@heroicons/react/16/solid";



import Collections from "@/app/components/Collections";
import { Footer } from "./components/Footer";

export default function Home() {
	const featured = getFeaturedProducts();
	return (
		<main className="mx-auto py-10 bg-gray-50 ">

      {/* <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary-900 to-primary-700 h-[500px] w-full">
          <div className="relative h-full container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 pt-12 md:pt-0 text-[#1A1A1A] z-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Collection Rentrée 2025</h1>
              <p className="text-lg md:text-xl mb-8 text-[#1A1A1A] opacity-70 max-w-md">
                Découvrez les dernières tendances sneakers pour habiller vos pieds pour la rentrée.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href='/products'
                  className="flex items-center justify-center rounded-md bg-[#576F66] px-8 py-3 text-base font-semibold text-white hover:opacity-90"
                >
                  Découvrir nos paires
                </Link>
              </div>
            </div>
          
            <div className="md:w-1/2 h-full flex items-center justify-center">
              <img 
                src="https://img.heroui.chat/image/fashion?w=600&h=600&u=15" 
                alt="Summer collection" 
                className="h-[400px] w-auto mt-8 md:mt-0 rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section> */}

      <section className="pb-32">
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
            <div className="mr-auto place-self-center lg:col-span-7">
                <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl text-gray-950">Collection Rentrée 2025</h1>
                <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl">Découvrez les dernières tendances sneakers pour habiller vos pieds pour la rentrée.</p>
                <a href="#" className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100">
                    Découvrir la collection
                </a> 
            </div>
            <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
              {/* <Image src='https://img.heroui.chat/image/fashion?w=600&h=600&u=15' width={400} height={400} alt='Logo en forme de fleur'/> */}
              <img 
                src="https://img.heroui.chat/image/fashion?w=600&h=600&u=15" 
                alt="Summer collection" 
                className="h-[400px] w-auto mt-8 md:mt-0 rounded-lg shadow-xl"
              />
            </div>                
        </div>
      </section>

      <Collections/>
      <Footer/>

		</main>
	);
}
