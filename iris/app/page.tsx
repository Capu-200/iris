import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts } from "./lib/products";
import {Button, ButtonGroup} from "@heroui/button";
import { ChevronRightIcon } from "@heroicons/react/16/solid";

export default function Home() {
	const featured = getFeaturedProducts();
	return (
		<main className="mx-auto px-4 py-10 bg-[#F1ECE2] ">
			{/* <section className="rounded-2xl bg-[#fafbf858] border border-[#fafbf87b]  text-gray-950 p-8 md:p-12 mb-12">
				<h1 className="text-3xl md:text-5xl font-semibold mb-4">Trouvez votre prochaine paire</h1>
				<p className="text-gray-500 mb-6 max-w-2xl">Découvrez une sélection de sneakers lifestyle. Confort, performance et style au quotidien.</p>
				<Link href="/products" className="inline-block bg-[#576F66] text-white px-5 py-2 rounded-md font-semibold hover:opacity-90">Voir les produits</Link>
			</section> */}
      <section className="relative overflow-hidden rounded-xl my-8">
        <div className="bg-gradient-to-r from-primary-900 to-primary-700 h-[500px] w-full">
          {/* <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_40%)]"></div>
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary-900/90 to-transparent"></div>
          </div> */}
        
          <div className="relative h-full container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 pt-12 md:pt-0 text-white z-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Summer Collection 2024</h1>
              <p className="text-lg md:text-xl mb-8 text-white/80 max-w-md">
                Discover the latest trends and styles for your summer wardrobe. Quality meets comfort.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  color="default" 
                  size="lg" 
                  className="bg-white text-primary-900 font-medium"
                  endContent={<ChevronRightIcon />}
                >
                  Shop Now
                </Button>
                <Button 
                  variant="bordered" 
                  size="lg" 
                  className="border-white text-white"
                >
                  View Lookbook
                </Button>
              </div>
            </div>
          
            <div className="md:w-1/2 h-full flex items-center justify-center">
              <img 
                src="https://img.heroui.chat/image/fashion?w=600&h=600&u=15" 
                alt="Summer collection" 
                className="object-cover h-[400px] w-auto mt-8 md:mt-0 rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

		</main>
	);
}
