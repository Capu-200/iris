'use client';

import { useState } from 'react';

export default function Account() {
    const [tab, setTab] = useState<'profil' | 'commandes' | 'adresses'>('profil');

    const baseTab = "flex items-center px-4 py-3 rounded-md text-sm font-medium";
    const active = "bg-[#D6DDDA] text-[#576F66] font-semibold";
    const inactive = "text-gray-950 hover:bg-gray-50 border border-transparent";

    return(
        <div className="min-h-screen bg-gray-50 py-20 text-gray-950">
            <div className="max-w-5xl mx-auto px-4">
                <div className="mb-6">
                    <h1 className="text-3xl font-semibold">Mon compte</h1>
                    <p className="text-gray-600 mt-1">Gérez vos informations personnelles et vos commandes</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl">
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex gap-2">
                            <button
                                className={`${baseTab} ${tab === 'profil' ? active : inactive}`}
                                onClick={() => setTab('profil')}
                                aria-selected={tab === 'profil'}
                                role="tab"
                            >
                                <span className="i-hero-user text-[14px]" aria-hidden />
                                Profil
                            </button>
                            <button
                                className={`${baseTab} ${tab === 'commandes' ? active : inactive}`}
                                onClick={() => setTab('commandes')}
                                aria-selected={tab === 'commandes'}
                                role="tab"
                            >
                                <span className="i-hero-cube text-[14px]" aria-hidden />
                                Commandes
                            </button>
                            <button
                                className={`${baseTab} ${tab === 'adresses' ? active : inactive}`}
                                onClick={() => setTab('adresses')}
                                aria-selected={tab === 'adresses'}
                                role="tab"
                            >
                                <span className="i-hero-map-pin text-[14px]" aria-hidden />
                                Adresses
                            </button>
                        </div>
                    </div>

                    <div className="p-6" role="tabpanel">
                        {tab === 'profil' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-semibold">Informations personnelles</h2>
                                    <p className="text-gray-600 text-sm">Modifiez vos informations personnelles et de contact</p>
                                </div>
                                <form className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm mb-1">Prénom</label>
                                            <input className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#576F66]" defaultValue="Marie" />
                                        </div>
                                        <div>
                                            <label className="block text-sm mb-1">Nom</label>
                                            <input className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#576F66]" defaultValue="Dupont" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-1">Email</label>
                                        <input className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#576F66]" defaultValue="marie.dupont@email.com" />
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-1">Téléphone</label>
                                        <input className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#576F66]" defaultValue="06 12 34 56 78" />
                                    </div>
                                    <div>
                                        <button type="button" className="inline-flex items-center rounded-md bg-[#576F66] text-white px-4 py-2 font-medium hover:bg-[#34433D] transition-colors">
                                            Sauvegarder les modifications
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {tab === 'commandes' && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Commandes</h2>
                                <p className="text-gray-600">Aucune commande récente.</p>
                            </div>
                        )}

                        {tab === 'adresses' && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Adresses</h2>
                                <p className="text-gray-600">Ajoutez ou modifiez vos adresses de livraison et de facturation.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}