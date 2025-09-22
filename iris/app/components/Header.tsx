'use client'

import Link from "next/link";
import Image from "next/image";

import Logo from '@/public/Logo-vert.svg' 

import { useCart } from '../lib/cart';
import { useAuth } from '../lib/auth';

import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, UserCircleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'

export default function HeaderCopy() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { user, logout } = useAuth();
    const { totalItems } = useCart();

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
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-12">

					<a href='/products' className="text-sm/6 font-semibold text-gray-900">
						Catalogue
					</a>


                    {user ? (
                        <div className="flex items-center space-x-4">
                         {user.role === 'client' && (
                                <Link href="/account" className="flex items-center space-x-2">
                                    <UserCircleIcon className="h-5 w-5 text-purple-600" />
                                    <span className="text-sm/6 font-semibold text-gray-900">
                                        {user.firstName}
                                    </span>
                                </Link>
                            )}
                                {user.role === 'admin' && (
                                    <Link href="/admin" className="flex items-center space-x-2 text-sm/6 font-semibold text-[#576F66] hover:text-[#34433D]">
                                        <Cog6ToothIcon className="h-5 w-5" />
                                        Dashboard
                                    </Link>
                                )}
                            </div>
                    ) : (
                        <Link href="/login" className="text-sm/6 font-semibold text-gray-900">
                            Se connecter
                        </Link>
                    )}
					<Link href='/cart' className="text-sm/6 font-semibold text-gray-900">
						Panier ({totalItems})
					</Link>
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
								Catalogue
							</a>
							<a href='/cart' className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">

								Panier ({totalItems})
							</a>
							</div>
							<div className="py-6">
								{user ? (
									<>
                                    {user.role === 'client' && (
										<Link href="/account" className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900">
											<div className="flex items-center space-x-2">
												<UserCircleIcon className="h-5 w-5 text-purple-600" />
												<span>{user.firstName}</span>
											</div>
										</Link>
                                        )}
										{user.role === 'admin' && (
											<Link href="/admin" className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-[#576F66] hover:bg-gray-50">
												<div className="flex items-center space-x-2">
													<Cog6ToothIcon className="h-5 w-5" />
													<span>Dashboard</span>
												</div>
											</Link>
										)}
										<button
											onClick={logout}
											className="mt-2 w-full px-3 py-2 rounded bg-gray-200 text-gray-800 text-base font-medium hover:bg-gray-300 transition"
										>
											Se déconnecter
										</button>
									</>
								) : (
									<Link
										href="/login"
										className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
									>
										Se connecter
									</Link>
								)}
							</div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    )
}
