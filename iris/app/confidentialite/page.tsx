import { Footer } from "../components/Footer"

export default function Privacy() {
    return (
        <div className="min-h-screen bg-gray-50 py-10 text-gray-950">
      
            <main className="container mx-auto px-4 py-16 max-w-4xl">
                <h1 className="text-4x font-bold mb-8">Politique de Confidentialité</h1>
                
                <div className="space-y-8 text-muted-foreground leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">1. Collecte des Données</h2>
                        <p>
                        Iris collecte différents types de données personnelles lors de votre navigation et utilisation de notre plateforme :
                        </p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                        <li>Données d'identification : nom, prénom, adresse email</li>
                        <li>Données de contact : adresse postale, numéro de téléphone</li>
                        <li>Données de navigation : cookies, adresse IP, pages visitées</li>
                        <li>Données de commande : historique d'achats, préférences</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">2. Finalités du Traitement</h2>
                        <p>Vos données personnelles sont utilisées pour :</p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                        <li>Gérer votre compte utilisateur et vos commandes</li>
                        <li>Assurer le service client et le support technique</li>
                        <li>Personnaliser votre expérience sur la plateforme</li>
                        <li>Vous informer de nos nouveautés et promotions (avec votre consentement)</li>
                        <li>Améliorer nos services et analyser l'utilisation de la plateforme</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">3. Base Légale</h2>
                        <p>
                        Le traitement de vos données repose sur plusieurs bases légales selon le RGPD :
                        </p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                        <li>Exécution du contrat pour la gestion des commandes</li>
                        <li>Intérêt légitime pour l'amélioration de nos services</li>
                        <li>Consentement pour les communications marketing</li>
                        <li>Obligation légale pour la facturation et la comptabilité</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">4. Durée de Conservation</h2>
                        <p>
                        Nous conservons vos données personnelles pendant la durée nécessaire aux finalités pour lesquelles 
                        elles ont été collectées :
                        </p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                        <li>Données de compte : jusqu'à suppression de votre compte + 3 ans</li>
                        <li>Données de commande : 10 ans (obligations comptables)</li>
                        <li>Données de navigation : 13 mois maximum</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">5. Partage des Données</h2>
                        <p>
                        Vos données peuvent être partagées avec :
                        </p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                        <li>Nos partenaires logistiques pour la livraison</li>
                        <li>Nos prestataires de paiement sécurisé</li>
                        <li>Nos sous-traitants techniques (hébergement, maintenance)</li>
                        <li>Les autorités compétentes en cas d'obligation légale</li>
                        </ul>
                        <p className="mt-2">
                        Nous ne vendons jamais vos données à des tiers à des fins commerciales.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">6. Vos Droits</h2>
                        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                        <li>Droit d'accès à vos données personnelles</li>
                        <li>Droit de rectification des données inexactes</li>
                        <li>Droit à l'effacement (droit à l'oubli)</li>
                        <li>Droit à la limitation du traitement</li>
                        <li>Droit à la portabilité de vos données</li>
                        <li>Droit d'opposition au traitement</li>
                        <li>Droit de retirer votre consentement à tout moment</li>
                        </ul>
                        <p className="mt-2">
                        Pour exercer ces droits, contactez-nous à : privacy@iris-sneakers.com
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
                        <p>
                        Notre site utilise des cookies pour améliorer votre expérience de navigation. 
                        Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur. 
                        Certains cookies sont nécessaires au bon fonctionnement du site et ne peuvent être désactivés.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">8. Sécurité</h2>
                        <p>
                        Nous mettons en place des mesures techniques et organisationnelles appropriées pour protéger 
                        vos données personnelles contre tout accès non autorisé, perte, destruction ou divulgation accidentelle.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">9. Contact et Réclamations</h2>
                        <p>
                        Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, 
                        vous pouvez nous contacter à : privacy@iris-sneakers.com
                        </p>
                        <p className="mt-2">
                        Vous avez également le droit de déposer une réclamation auprès de la CNIL 
                        (Commission Nationale de l'Informatique et des Libertés).
                        </p>
                    </section>

                    <div className="mt-12 p-6 bg-gray-100 rounded-lg">
                        <p className="text-sm">
                        Dernière mise à jour : Août 2025<br />
                        Cette politique peut être mise à jour périodiquement pour refléter les changements 
                        dans nos pratiques ou la réglementation applicable.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}