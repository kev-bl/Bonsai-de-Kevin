# Bonsai de Kevin 🌿

Application web progressive (PWA) de suivi d'une collection de bonsaïs, avec une esthétique inspirée des jardins japonais.

## Fonctionnalités de cette première version

- Collection : ajouter, modifier et supprimer des arbres.
- Fiches : espèce, date d'acquisition, emplacement, notes et photo.
- Journal : arrosage, taille, fertilisation, rempotage et observations.
- Tâches : créer, cocher et supprimer des rappels.
- Tableau de bord et statistiques simples.
- Export et import JSON des données.
- Stockage local sur l'appareil et mode hors-ligne via service worker.

## Publication gratuite sur GitHub Pages

1. Crée un compte sur https://github.com si nécessaire.
2. Crée un nouveau dépôt public nommé `bonsai-de-kevin`.
3. Décompresse l'archive et ajoute **tous les fichiers à la racine** du dépôt.
4. Dans GitHub, ouvre **Settings → Pages**.
5. Dans **Build and deployment**, choisis **Deploy from a branch**.
6. Sélectionne la branche `main`, le dossier `/ (root)`, puis **Save**.
7. Attends quelques minutes. Ton site sera accessible à l'adresse :
   `https://TON-PSEUDO.github.io/bonsai-de-kevin/`

## Installation sur iPhone

1. Ouvre l'adresse GitHub Pages dans Safari.
2. Appuie sur le bouton Partager.
3. Choisis **Sur l'écran d'accueil**.
4. Valide avec **Ajouter**.

## Données et sauvegardes

Les données sont conservées dans le stockage local du navigateur (`localStorage`) sur l'appareil. Elles ne sont pas automatiquement synchronisées entre appareils. Utilise **Paramètres → Exporter mes données** pour conserver une sauvegarde JSON, puis importe-la sur un autre appareil si besoin.

## À savoir / prochaines évolutions

- Les photos sont enregistrées localement dans le navigateur. Évite les très grandes images afin de ne pas saturer le stockage.
- Les rappels sont des tâches à consulter dans l'application ; cette version ne déclenche pas encore de notifications système automatiques.
- L'illustration d'accueil est dessinée en CSS. Les polices Google peuvent nécessiter une connexion, mais l'application reste utilisable sans elles.
- Pour une synchronisation multi-appareils, il faudra ajouter un service backend (par exemple Supabase) et une authentification.
