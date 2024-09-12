Ce repository a été créé pour le test technique de la société évolutives software 

# Inventory Management

**Inventory Management** est une application React qui permet de gérer les stocks de plusieurs magasins, d'ajouter des inventaires pour chaque produit, et d'exporter les données en format CSV. L'application est internationalisée avec `react-i18next` pour permettre un support multilingue.

## Table des matières
1. [Technologies utilisées](#technologies-utilisées)
2. [Fonctionnalités](#fonctionnalités)
3. [Prérequis](#prérequis)
4. [Installation](#installation)
5. [Démarrage](#démarrage)
6. [Internationalisation](#internationalisation)

## Technologies utilisées

- **React.js** - Librairie JavaScript pour créer des interfaces utilisateurs.
- **TypeScript** - Superset de JavaScript offrant une typage statique.
- **react-i18next** - Pour la gestion de l'internationalisation.
- **papaparse** - Pour l'exportation des données en format CSV.

## Fonctionnalités

- **Ajouter, éditer et supprimer des inventaires** pour plusieurs magasins.
- **Exportation des inventaires en CSV**.
- **Internationalisation (i18n)** avec support de plusieurs langues (français et anglais).
- **Interface utilisateur moderne** avec une navigation simple pour changer de langue.

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

- **Node.js** (v14 ou plus récent)
- **npm** (v6 ou plus récent) ou **yarn**
- Un navigateur moderne (Chrome, Firefox, Edge, etc.)

## Installation

1. **Cloner le repository** sur votre machine locale :

   ```bash
   git clone https://github.com/link-cat/evoSoftInventory.git
2. **Naviguer dans le répertoire du projet**:
   ```bash
      cd inventory-management
3. **Installer les dépendances :**

   Si vous utilisez `npm` :

        npm install
   
   Si vous utilisez `yarn` :

    ```bash
    yarn install

## Démarrage 
Après l'installation, vous pouvez démarrer le projet en mode développement :

  Si vous utilisez `npm` :

    npm start

 Si vous utilisez `yarn` :
 
    yarn start

cela ouvrira l'application dans votre navigateur par défaut à l'adresse suivante : http://localhost:3000

## Internationalisation

l'application supporte deux langues : **Français** et **Anglais**. Vous pouvez changez la langue via la barre de navigation en cliquant sur les boutons correspondant aux drapeaux.
 - par défaut, l'application sélectionne la langue du navigateur.
 - vous pouvez ajouter d'autres langues en modifiant les fichiers de traduction dans le dossier src/locales
