import Logo from '@/public/Logo-vert.svg'
import Image from 'next/image';
import { Footer } from '../components/Footer';

import { GlobeAmericasIcon, SunIcon, TrophyIcon, UserGroupIcon, HeartIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

export default function RSE() {
    return(
        <div className="pt-16 bg-gray-100">
            <div className="bg-gradient-hero text-primary-foreground">
                <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center text-gray-950">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Nos Démarches RSE & ESS
                    </h1>
                    <p className="text-xl text-primary-foreground/90 leading-relaxed">
                    Chez Iris, nous croyons qu'un commerce éthique et responsable peut transformer 
                    l'industrie de la sneaker. Découvrez nos engagements pour un avenir plus durable.
                    </p>
                </div>
                </div>
            </div>

            <section className="bg-gray-50 pb-10">
                <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                    <div className="max-w-screen-md mb-8 lg:mb-16">
                        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900">Responsabilité Sociétale des Entreprises</h2>
                        <p className="text-gray-500 sm:text-xl">Notre engagement environnemental et social est au cœur de notre modèle économique. Des valeurs humaines et solidaires guident chacune de nos actions.</p>
                    </div>
                    <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
                        <div>
                            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-lg bg-[#D6DDDA] lg:h-12 lg:w-12">
                                <GlobeAmericasIcon className='stroke-[#576F66] w-8'></GlobeAmericasIcon>
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-gray-950">Économie Circulaire</h3>
                            <p className="text-gray-500">Nous prolongeons la durée de vie des sneakers en favorisant leur revente plutôt que leur mise au rebut, réduisant ainsi l'impact environnemental de la fast fashion.</p>
                        </div>
                        <div>
                            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-lg bg-[#D6DDDA] lg:h-12 lg:w-12">
                                <SunIcon className='stroke-[#576F66] w-8'/>                            
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-gray-950">Empreinte Carbone Réduite</h3>
                            <p className="text-gray-500">Chaque paire vendue évite la production d'une nouvelle sneaker, économisant en moyenne 14kg de CO2 et 7000L d'eau par paire.</p>
                        </div>
                        <div>
                            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-lg bg-[#D6DDDA] lg:h-12 lg:w-12">
                                <TrophyIcon className='stroke-[#576F66] w-8'/>
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-gray-950">Authentification Rigoureuse</h3>
                            <p className="text-gray-500">Notre processus d'authentification en 12 points garantit l'authenticité et la qualité, luttant contre la contrefaçon et protégeant les consommateurs.</p>
                        </div>
                        <div>
                            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-lg bg-[#F5EDE3] lg:h-12 lg:w-12">
                                <UserGroupIcon className='stroke-[#CCA372] w-8'></UserGroupIcon>
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-gray-950">Inclusion & Accessibilité</h3>
                            <p className="text-gray-500">Nous démocratisons l'accès aux sneakers premium en proposant des prix justes et en créant des opportunités pour tous.</p>
                        </div>
                        <div>
                            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-lg bg-[#F5EDE3] lg:h-12 lg:w-12">
                                <HeartIcon className='stroke-[#CCA372] w-8'></HeartIcon>
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-gray-950">Impact Social</h3>
                            <p className="text-gray-500">5% de nos bénéfices sont reversés à des associations œuvrant pour l'insertion professionnelle des jeunes en difficulté.</p>
                        </div>
                        <div>
                            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-lg bg-[#F5EDE3] lg:h-12 lg:w-12">
                                <GlobeAltIcon className='stroke-[#CCA372] w-8'></GlobeAltIcon>
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-gray-950">Commerce Équitable</h3>
                            <p className="text-gray-500">Nous garantissons une rémunération juste pour nos vendeurs avec des frais transparents et des paiements rapides.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-gray-100">
                <div className="max-w-screen-xl px-4 py-8 mx-auto text-center lg:py-16 lg:px-6">
                    <h1 className='text-4xl md:text-5xl font-bold mb-6 pb-10 text-gray-950'>Notre impact en chiffres</h1>
                    <dl className="grid max-w-screen-md gap-8 mx-auto text-gray-900 sm:grid-cols-4">
                        <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-3xl md:text-4xl font-extrabold">15 000+</dt>
                            <dd className="font-light text-gray-500">Paires sauvées du gaspillage</dd>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-3xl md:text-4xl font-extrabold">210T</dt>
                            <dd className="font-light text-gray-500 ">CO2 évité (tonnes)</dd>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-3xl md:text-4xl font-extrabold">8 500</dt>
                            <dd className="font-light text-gray-500">Vendeurs accompagnés</dd>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-3xl md:text-4xl font-extrabold">25 000€</dt>
                            <dd className="font-light text-gray-500">Reversés aux associations</dd>
                        </div>
                    </dl>
                </div>
            </section>
            <Footer/>
        </div>
    )
}