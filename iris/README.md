# 🌸 Iris - Boutique E-commerce de Chaussures

Iris est une boutique e-commerce moderne spécialisée dans la vente de chaussures éco-responsables. L'application est construite avec Next.js 15, React 19 et TypeScript, offrant une expérience utilisateur fluide et moderne.

## ✨ Fonctionnalités Principales

### 🛍️ E-commerce
- **Catalogue de produits** : Affichage des chaussures avec filtres avancés (marque, catégorie, taille, prix)
- **Recherche intelligente** : Barre de recherche avec suggestions et filtres dynamiques
- **Pages produits détaillées** : Informations complètes, galerie d'images, sélection de tailles
- **Panier intelligent** : Gestion des articles avec quantités et tailles multiples
- **Processus de commande** : Checkout en 4 étapes avec validation complète
- **Codes promotionnels** : Système de codes promo avec réduction et livraison gratuite

### 🧑‍💻 Gestion des Utilisateurs
- **Authentification** : Inscription et connexion sécurisées
- **Comptes clients** : Profils utilisateurs avec historique des commandes
- **Gestion des adresses** : Sauvegarde des adresses de livraison
- **Suivi des commandes** : Interface de suivi en temps réel

### 🔧 Administration
- **Dashboard admin** : Vue d'ensemble des commandes et statistiques
- **Gestion des commandes** : Mise à jour des statuts et suivi
- **Gestion des marques** : Filtrage par marque pour les commandes
- **Gestion du stock** : Mise à jour des quantités disponibles

### 🎨 Interface Utilisateur
- **Design responsive** : Optimisé pour mobile, tablette et desktop
- **Mode sombre** : Support du thème sombre/clair
- **Animations fluides** : Transitions et micro-interactions avec Framer Motion
- **Accessibilité** : Interface accessible et intuitive

## 🛠️ Technologies Utilisées

### Frontend
- **Next.js 15** : Framework React avec App Router
- **React 19** : Bibliothèque UI avec hooks et contextes
- **TypeScript** : Typage statique pour une meilleure robustesse
- **Tailwind CSS 4** : Framework CSS utilitaire
- **HeroUI** : Composants UI modernes et accessibles
- **Framer Motion** : Animations et transitions fluides
- **Headless UI** : Composants accessibles sans styles

### Backend & APIs
- **Next.js API Routes** : API REST intégrée
- **Airtable** : Base de données cloud pour les produits et commandes
- **Local Storage** : Persistance du panier côté client

### Outils de Développement
- **ESLint** : Linting du code
- **PostCSS** : Traitement CSS
- **Git** : Contrôle de version

## 📁 Structure du Projet

```
iris/
├── app/                          # Application Next.js (App Router)
│   ├── api/                      # Routes API
│   │   ├── admin/               # APIs d'administration
│   │   │   ├── brands/          # Gestion des marques
│   │   │   └── orders/          # Gestion des commandes
│   │   ├── auth/                # Authentification
│   │   │   ├── login/           # Connexion
│   │   │   ├── register/        # Inscription
│   │   │   └── me/              # Profil utilisateur
│   │   ├── clients/             # Gestion des clients
│   │   ├── orders/              # Commandes
│   │   └── promo-codes/         # Codes promotionnels
│   ├── components/              # Composants réutilisables
│   │   ├── Header.tsx           # En-tête de navigation
│   │   ├── Footer.tsx           # Pied de page
│   │   ├── ProductList.tsx      # Liste des produits
│   │   └── Collections.tsx      # Collections de produits
│   ├── lib/                     # Utilitaires et logique métier
│   │   ├── api/                 # Services API
│   │   │   ├── airtable.ts      # Intégration Airtable
│   │   │   └── client-orders.ts # Gestion des commandes
│   │   ├── auth.tsx             # Contexte d'authentification
│   │   ├── cart.tsx             # Gestion du panier
│   │   └── products.ts          # Logique des produits
│   ├── products/                # Pages produits
│   │   ├── [slug]/              # Page produit individuel
│   │   ├── products-filters.tsx # Filtres de recherche
│   │   ├── products-grid.tsx    # Grille des produits
│   │   └── search-bar.tsx       # Barre de recherche
│   ├── cart/                    # Page panier
│   ├── checkout/                # Processus de commande
│   ├── admin/                   # Interface d'administration
│   ├── login/                   # Page de connexion
│   ├── register/                # Page d'inscription
│   └── order-tracking/          # Suivi des commandes
├── public/                      # Assets statiques
├── package.json                 # Dépendances et scripts
├── next.config.ts              # Configuration Next.js
├── tailwind.config.js          # Configuration Tailwind
└── tsconfig.json               # Configuration TypeScript
```

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Compte Airtable (optionnel pour le développement)

### Installation

1. **Cloner le projet**
```bash
git clone <url-du-repo>
cd iris/iris
```

2. **Installer les dépendances**
```bash
npm install
# ou
yarn install
```

3. **Configuration des variables d'environnement**
Créer un fichier `.env.local` à la racine du projet :
```env
# Airtable (optionnel - des données de fallback sont disponibles)
NEXT_PUBLIC_AIRTABLE_BASE_ID=your_base_id
NEXT_PUBLIC_AIRTABLE_TABLE_NAME=Produits
AIRTABLE_API_KEY=your_api_key

# Configuration de l'application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Démarrer le serveur de développement**
```bash
npm run dev
# ou
yarn dev
```

5. **Ouvrir l'application**
Rendez-vous sur [http://localhost:3000](http://localhost:3000)

## 📱 Pages et Fonctionnalités

### 🏠 Page d'Accueil (`/`)
- Hero section avec collection mise en avant
- Collections de produits
- Produits en vedette
- Section des fonctionnalités

### 🛍️ Catalogue Produits (`/products`)
- Grille de produits avec pagination
- Filtres avancés (marque, catégorie, taille, prix)
- Barre de recherche
- Tri par prix, nom, marque
- Mode grille/liste

### 👟 Page Produit (`/products/[slug]`)
- Galerie d'images
- Informations détaillées (matériaux, origine, description)
- Sélection de taille
- Ajout au panier
- Produits similaires

### 🛒 Panier (`/cart`)
- Liste des articles sélectionnés
- Modification des quantités
- Calcul automatique des totaux
- Codes promotionnels
- Redirection vers le checkout

### 💳 Checkout (`/checkout`)
- Processus en 4 étapes :
  1. **Informations personnelles** : Nom, email, téléphone
  2. **Adresse de livraison** : Adresse complète avec validation
  3. **Paiement** : Informations de carte bancaire
  4. **Confirmation** : Récapitulatif final
- Validation en temps réel
- Codes promo avec différents types
- Calcul des frais de livraison

### 👤 Authentification
- **Inscription** (`/register`) : Création de compte
- **Connexion** (`/login`) : Authentification
- **Profil** (`/account`) : Gestion du compte utilisateur

### 🔧 Administration (`/admin`)
- Dashboard avec statistiques
- Gestion des commandes par marque
- Mise à jour des statuts
- Filtres et recherche

## 🎨 Design et UX

### Palette de Couleurs
- **Primaire** : `#576F66` (Vert éco-responsable)
- **Secondaire** : `#34433D` (Vert foncé)
- **Accent** : `#F5F5F5` (Gris clair)
- **Texte** : `#1F2937` (Gris foncé)

### Composants UI
- **HeroUI** : Composants modernes et accessibles
- **Tailwind CSS** : Design system cohérent
- **Responsive Design** : Mobile-first approach

## 🔌 Intégrations

### Airtable
- **Produits** : Catalogue complet avec images, prix, stock
- **Commandes** : Gestion des commandes clients
- **Clients** : Base de données des utilisateurs
- **Codes promo** : Gestion des promotions

### APIs Externes
- **Images** : Support de multiples CDNs (Unsplash, Cloudinary, etc.)
- **Paiements** : Structure prête pour intégration Stripe/PayPal

## 🧪 Tests et Qualité

### Linting
```bash
npm run lint
```

### Build de Production
```bash
npm run build
npm start
```

## 🔒 Sécurité

- **Validation** : Validation côté client et serveur
- **Sanitisation** : Nettoyage des données utilisateur
- **HTTPS** : Chiffrement des communications
- **Variables d'environnement** : Secrets protégés

## 👥 Équipe

- **Développement** : Capucine K. - Kessia T.
- **Design** : Interface moderne et accessible
- **Backend** : APIs robustes et sécurisées

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement
- Consulter la documentation technique

---

**Iris** - Boutique e-commerce éco-responsable 🌸
