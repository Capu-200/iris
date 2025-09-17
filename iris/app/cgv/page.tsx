import { Footer } from "@/app/components/Footer";

export default function CGV(){
    return (
        <div className="min-h-screen bg-gray-50 py-10 text-gray-950">
          <main className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-4xl font-bold  mb-8">Conditions Générales de Vente</h1>
            
            <div className="space-y-8 leading-relaxed">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Objet</h2>
                <p>
                  Les présentes conditions générales de vente régissent les relations contractuelles entre Iris, 
                  plateforme de vente de sneakers éthiques, et ses utilisateurs acheteurs.
                </p>
              </section>
    
              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Produits</h2>
                <p>
                  Iris propose exclusivement des sneakers de seconde main authentifiées par nos experts. 
                  Chaque paire est minutieusement inspectée pour garantir son authenticité et sa qualité. 
                  L'état de chaque produit est clairement indiqué sur la fiche produit.
                </p>
              </section>
    
              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Prix et Paiement</h2>
                <p>
                  Les prix sont indiqués en euros, toutes taxes comprises. Le paiement s'effectue au moment de la commande 
                  par carte bancaire ou tout autre moyen de paiement accepté sur la plateforme. 
                  La commande ne sera validée qu'après confirmation du paiement.
                </p>
              </section>
    
              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Livraison</h2>
                <p>
                  Les livraisons sont effectuées dans un délai de 3 à 7 jours ouvrés en France métropolitaine. 
                  Nous utilisons des emballages éco-responsables en accord avec nos valeurs environnementales. 
                  Les frais de port sont calculés en fonction du poids et de la destination.
                </p>
              </section>
    
              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Droit de Rétractation</h2>
                <p>
                  Conformément à la législation en vigueur, vous disposez d'un délai de 14 jours à compter de la réception 
                  de votre commande pour exercer votre droit de rétractation. Les produits doivent être retournés dans leur 
                  état d'origine avec tous les accessoires fournis.
                </p>
              </section>
    
              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Authentification</h2>
                <p>
                  Tous les produits vendus sur Iris sont authentifiés par notre équipe d'experts. 
                  En cas de doute sur l'authenticité d'un produit après achat, nous nous engageons à reprendre 
                  le produit et à vous rembourser intégralement.
                </p>
              </section>
    
              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Responsabilité</h2>
                <p>
                  Iris s'engage à mettre tout en œuvre pour assurer la bonne exécution des commandes. 
                  Notre responsabilité est limitée au montant de la commande en cas de dommage.
                </p>
              </section>
    
              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Données Personnelles</h2>
                <p>
                  Les données personnelles collectées sont traitées conformément à notre politique de confidentialité 
                  et à la réglementation RGPD en vigueur.
                </p>
              </section>
    
              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Droit Applicable</h2>
                <p>
                  Les présentes conditions générales sont soumises au droit français. 
                  Tout litige sera de la compétence exclusive des tribunaux français.
                </p>
              </section>
    
              <div className="mt-12 p-6 bg-gray-100 rounded-lg">
                <p className="text-sm">
                  Dernière mise à jour : Juin 2025<br />
                  Pour toute question concernant ces conditions, contactez-nous à : contact@iris-sneakers.com
                </p>
              </div>
            </div>
          </main>
    
          <Footer />
        </div>
    );
}
