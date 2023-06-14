# @marctysonclebert/node-starter

NodeStarter est un générateur de projets Node.js polyvalent et personnalisable. Créez rapidement des projets Node.js avec des configurations TypeScript prêtes à l'emploi, des tests Jest intégrés et une structure de fichiers préconfigurée. Accélérez votre processus de démarrage de projet avec NodeStarter !

## Table des matières

- [@marctysonclebert/node-starter](#marctysonclebertnode-starter)
  - [Table des matières](#table-des-matières)
  - [Description](#description)
  - [Installation](#installation)
  - [Utilisation](#utilisation)
  - [Commandes](#commandes)
    - [`create`](#create)
  - [Contributions](#contributions)
  - [Licence](#licence)

## Description

NodeStarter est un outil de génération de projets Node.js qui vous permet de créer rapidement des projets personnalisés avec les fonctionnalités suivantes :

- Configurations TypeScript prêtes à l'emploi.
- Tests Jest intégrés pour une validation automatisée.
- Structure de fichiers préconfigurée pour une organisation efficace du projet.

Ce générateur de projets vous permet d'accélérer votre processus de démarrage de projet en vous fournissant une base solide et personnalisable pour vos projets Node.js.

## Installation

Pour installer NodeStarter dans votre projet, vous pouvez utiliser votre gestionnaire de paquets préféré. Voici les étapes d'installation en utilisant npm :

```bash
$ npm i -g @marctysonclebert/node-starter
```

Assurez-vous d'avoir [Node.js](https://nodejs.org) installé sur votre machine.

## Utilisation

Après avoir installé NodeStarter, vous pouvez l'exécuter en utilisant la commande suivante :

```bash
$ npx node-starter
```

Cela lancera l'outil en ligne de commande de NodeStarter, qui vous guidera à travers le processus de création d'un nouveau projet Node.js.

## Commandes

### `create`

Pour créer un nouveau projet en utilisant NodeStarter, exécutez la commande suivante après l'avoir installé :

```bash
$ node-starter create
```

Cette commande démarrera une invite interactive qui vous demandera des détails sur le projet, tels que :

- Nom du projet
- Type de projet (JavaScript ou TypeScript)
- Gestionnaire de paquets (npm, yarn ou pnpm)
- Dépendances
- DevDependencies
- Dossiers supplémentaires
- Fichiers supplémentaires

Une fois que vous aurez fourni les informations requises, NodeStarter créera le projet avec la configuration spécifiée.

## Contributions

Nous encourageons vivement les contributions à NodeStarter. Si vous souhaitez contribuer, veuillez suivre les étapes suivantes :

1. Fork du dépôt GitHub.
2. Créez une branche pour vos modifications : git checkout -b feature/your-feature.
3. Effectuez les modifications et commit : git commit -m 'Add some feature'.
4. Poussez les modifications vers votre fork : git push origin feature/your-feature.
5. Ouvrez une demande d'extraction (pull request) vers la branche master du dépôt d'origine.

Nous apprécions toutes les contributions, qu'il s'agisse de rapports de bugs, de demandes de fonctionnalités ou de corrections de code.

## Licence

Ce projet est sous licence MIT. Consultez le fichier [LICENSE](LICENSE) pour plus de détails.
