'use client'

import Link from "next/link";
import Image from "next/image";

import Logo from '@/public/Logo-vert.svg' 

import { useCart } from '../lib/cart';

import { useState, useEffect } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, SparklesIcon, ArrowPathIcon, CloudArrowUpIcon, LockClosedIcon, UserCircleIcon } from '@heroicons/react/24/outline'

export default function HeaderCopy() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userName, setUserName] = useState('')

	const { totalItems } = useCart();

    useEffect(() => {
        // Vérifier si l'utilisateur est connecté
        const token = localStorage.getItem('authToken')
        const name = localStorage.getItem('userName')
        const email = localStorage.getItem('userEmail')
        
        if (token) {
            setIsLoggedIn(true)
            setUserName(name || email || 'Utilisateur')
        }
    }, [])

    // Fonction de déconnexion
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        window.location.href = '/';
    }

    return(
        <header className="absolute inset-x-0 top-0 z-50 bg-gray-50">
            <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
              <div className="flex lg:flex-1">
                <Link href="/" className="text-xl font-semibold flex items-center gap-2 text-[#576F66]">
					<Image className='w-5' src={Logo} alt="Logo en forme de fleur"/>
					Iris
				</Link>
              </div>
              <div className="flex lg:hidden">
                <button
                    type="button"
                    onClick={() => setMobileMenuOpen(true)}
                    className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                >
                    <span className="sr-only">Open main menu</span>
                  <Bars3Icon aria-hidden="true" className="size-6" />
                </button>
              </div>
              <div className="hidden lg:flex lg:gap-x-12">

				{/* Insérer Searchbar */}
				{/* <div className="relative">
					<input
						className="w-fit px-12 py-1.5 text-base border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm"
						placeholder="Rechercher des sneakers..."
					/>

					<svg className="absolute left-4 top-1/2 transform -translate-y-1/2 h-[18px] w-[18px] text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
				</div> */}
                
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-12">
					<a href='/products' className="text-sm/6 font-semibold text-gray-900">
						Produits
					</a>

                    {isLoggedIn ? (
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <UserCircleIcon className="h-5 w-5 text-purple-600" />
                                <span className="text-sm/6 font-semibold text-gray-900">
                                    {userName}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-sm/4 ml-4 mr-2 font-semibold text-orange-500 hover:text-orange-600 transition"
                            >
                                Se déconnecter
                            </button>
                        </div>
                    ) : (
                        <a href="/login" className="text-sm/6 font-semibold text-gray-900">
                            Se connecter
                        </a>
                    )}
					<a href='/cart' className="text-sm/6 font-semibold text-gray-900">
						Panier ({totalItems})
					</a>
                </div>
            </nav>
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-50"/>
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
						<Link href="/" className="text-xl font-semibold flex items-center gap-2 text-[#576F66]">
							<Image className='w-5' src={Logo} alt="Logo en forme de fleur"/>
							Iris
						</Link>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
							<div className="space-y-2 py-6">
							<a href='/products' className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
								Produits
							</a>
							<a href='/cart' className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
								Panier ({totalItems})
							</a>
							</div>
							<div className="py-6">
								{isLoggedIn ? (
									<>
										<div className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900">
											<div className="flex items-center space-x-2">
												<UserCircleIcon className="h-5 w-5 text-purple-600" />
												<span>{userName}</span>
											</div>
										</div>
										<button
											onClick={handleLogout}
											className="mt-2 w-full px-3 py-2 rounded bg-gray-200 text-gray-800 text-base font-medium hover:bg-gray-300 transition"
										>
											Se déconnecter
										</button>
									</>
								) : (
									<a
										href="/login"
										className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
									>
										Se connecter
									</a>
								)}
							</div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    )
}