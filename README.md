# Mémoire IA 🎓🤖

**Mémoire IA** est une plateforme SaaS moderne conçue pour accompagner les étudiants et chercheurs dans la rédaction et l'analyse de leurs mémoires académiques grâce à l'intelligence artificielle.

## 🚀 Fonctionnalités (En développement)

- **Analyse par IA** : Analyse critique de documents et suggestions d'amélioration.
- **Tableau de Bord** : Suivi de l'avancement des projets de recherche.
- **Gestion documentaire** : Stockage et organisation des ressources et versions du mémoire.
- **Interface intuitive** : Design moderne avec mode clair/sombre.
- **Authentification sécurisée** : Connexion via NextAuth.
- **Système d'abonnement** : Modèle SaaS prêt pour la monétisation.

## 🛠️ Stack Technique

- **Framework** : [Next.js 15](https://nextjs.org/) (App Router)
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **Base de données** : MySQL via [Prisma ORM](https://www.prisma.io/)
- **Styling** : [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/UI](https://ui.shadcn.com/)
- **Authentification** : [NextAuth.js](https://next-auth.js.org/)
- **Visualisation** : [Recharts](https://recharts.org/) pour les statistiques du dashboard.

## 📊 État Actuel du Projet

Le projet est en phase active de développement (MVP). Voici l'état d'avancement :

- [x] Structure de base du projet (Next.js 15).
- [x] Configuration de la base de données avec Prisma.
- [x] Interface utilisateur (Dashboard, Login, Register, Profile).
- [x] Système d'authentification de base.
- [ ] Intégration complète de l'API d'IA pour l'analyse.
- [ ] Finalisation du système de gestion des documents.
- [ ] Optimisation du système d'abonnement.

## ⚙️ Installation

1.  **Cloner le dépôt** :
    ```bash
    git clone https://github.com/Dxne-Dev/Memoire-IA.git
    cd saas-memoire-ai
    ```

2.  **Installer les dépendances** :
    ```bash
    npm install
    ```

3.  **Configurer les variables d'environnement** :
    Créez un fichier `.env` à la racine et ajoutez vos configurations (DATABASE_URL, NEXTAUTH_SECRET, etc.).

4.  **Initialiser la base de données** :
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Lancer le serveur de développement** :
    ```bash
    npm run dev
    ```

---
Dépendance de : **Projet Licence IA** 🚀
