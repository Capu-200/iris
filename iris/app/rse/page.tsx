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

            <section className="bg-gray-50">
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
                            <h3 className="mb-2 text-xl font-bold dark:text-white">Économie Circulaire</h3>
                            <p className="text-gray-500 dark:text-gray-400">Plan it, create it, launch it. Collaborate seamlessly with all  the organization and hit your marketing goals every month with our marketing plan.</p>
                        </div>
                        <div>
                            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-lg bg-[#D6DDDA] lg:h-12 lg:w-12">
                                <SunIcon className='stroke-[#576F66] w-8'/>                            
                            </div>
                            <h3 className="mb-2 text-xl font-bold dark:text-white">Legal</h3>
                            <p className="text-gray-500 dark:text-gray-400">Protect your organization, devices and stay compliant with our structured workflows and custom permissions made for you.</p>
                        </div>
                        <div>
                            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-lg bg-[#D6DDDA] lg:h-12 lg:w-12">
                                <TrophyIcon className='stroke-[#576F66] w-8'/>
                            </div>
                            <h3 className="mb-2 text-xl font-bold dark:text-white">Business Automation</h3>
                            <p className="text-gray-500 dark:text-gray-400">Auto-assign tasks, send Slack messages, and much more. Now power up with hundreds of new templates to help you get started.</p>
                        </div>
                        <div>
                            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-lg bg-[#D6DDDA] lg:h-12 lg:w-12">
                                <UserGroupIcon className='stroke-[#576F66] w-8'></UserGroupIcon>
                            </div>
                            <h3 className="mb-2 text-xl font-bold dark:text-white">Finance</h3>
                            <p className="text-gray-500 dark:text-gray-400">Audit-proof software built for critical financial operations like month-end close and quarterly budgeting.</p>
                        </div>
                        <div>
                            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-lg bg-[#D6DDDA] lg:h-12 lg:w-12">
                                <HeartIcon className='stroke-[#576F66] w-8'></HeartIcon>
                            </div>
                            <h3 className="mb-2 text-xl font-bold dark:text-white">Enterprise Design</h3>
                            <p className="text-gray-500 dark:text-gray-400">Craft beautiful, delightful experiences for both marketing and product with real cross-company collaboration.</p>
                        </div>
                        <div>
                            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-lg bg-[#D6DDDA] lg:h-12 lg:w-12">
                                <GlobeAltIcon className='stroke-[#576F66] w-8'></GlobeAltIcon>
                            </div>
                            <h3 className="mb-2 text-xl font-bold dark:text-white">Operations</h3>
                            <p className="text-gray-500 dark:text-gray-400">Keep your company’s lights on with customizable, iterative, and structured workflows built for all efficient teams and individual.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-gray-50">
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