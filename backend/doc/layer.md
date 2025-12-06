 Voici la structure typique d'un plugin Sylius :

  MonPlugin/
  ├── src/
  │   ├── DependencyInjection/
  │   │   ├── Configuration.php
  │   │   └── MonPluginExtension.php
  │   ├── Entity/
  │   ├── Repository/
  │   ├── Controller/
  │   ├── Form/
  │   ├── Menu/
  │   └── MonPluginBundle.php
  ├── config/
  │   ├── routes.yaml
  │   ├── services.yaml
  │   └── resources.yaml
  ├── templates/
  ├── translations/
  ├── tests/
  ├── composer.json
  └── README.md

  2. Créer le fichier composer.json du plugin

  Votre plugin doit avoir un composer.json similaire à :

  {
      "name": "acme/mon-plugin",
      "type": "sylius-plugin",
      "description": "Description de mon plugin",
      "license": "MIT",
      "require": {
          "php": "^8.3",
          "sylius/sylius": "^2.0"
      },
      "autoload": {
          "psr-4": {
              "Acme\\MonPlugin\\": "src/"
          }
      },
      "autoload-dev": {
          "psr-4": {
              "Acme\\MonPlugin\\Tests\\": "tests/"
          }
      }
  }

  3. Créer la classe Bundle principale

  src/MonPluginBundle.php :

  <?php

  declare(strict_types=1);

  namespace Acme\MonPlugin;

  use Sylius\Bundle\CoreBundle\Application\SyliusPluginTrait;
  use Symfony\Component\HttpKernel\Bundle\Bundle;

  final class MonPluginBundle extends Bundle
  {
      use SyliusPluginTrait;

      public function getPath(): string
      {
          return \dirname(__DIR__);
      }
  }

  4. Créer l'Extension et la Configuration

  src/DependencyInjection/MonPluginExtension.php :

  <?php

  declare(strict_types=1);

  namespace Acme\MonPlugin\DependencyInjection;

  use Symfony\Component\Config\FileLocator;
  use Symfony\Component\DependencyInjection\ContainerBuilder;
  use Symfony\Component\DependencyInjection\Extension\Extension;
  use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;

  final class MonPluginExtension extends Extension
  {
      public function load(array $configs, ContainerBuilder $container): void
      {
          $loader = new YamlFileLoader($container, new FileLocator(__DIR__ . '/../../config'));
          $loader->load('services.yaml');
      }
  }

  5. Intégrer le plugin dans votre application Sylius

  Il existe deux méthodes principales :

  Méthode A : Plugin externe (recommandé pour la réutilisation)

  1. Créez le plugin dans un repository séparé
  2. Publiez-le sur Packagist ou utilisez un repository privé
  3. Installez-le via Composer :

  composer require acme/mon-plugin

  4. Enregistrez le bundle dans config/bundles.php :

  return [
      // ...
      Acme\MonPlugin\MonPluginBundle::class => ['all' => true],
  ];

  Méthode B : Plugin local (développement rapide)

  1. Créez le dossier plugins/MonPlugin/ dans votre projet
  2. Ajoutez dans votre composer.json principal :

  {
      "autoload": {
          "psr-4": {
              "App\\": "src/",
              "Acme\\MonPlugin\\": "plugins/MonPlugin/src/"
          }
      },
      "repositories": [
          {
              "type": "path",
              "url": "plugins/MonPlugin"
          }
      ]
  }

  3. Installez le plugin localement :

  composer require acme/mon-plugin:@dev

  6. Configuration des ressources Sylius

  Si votre plugin gère des entités, créez config/resources.yaml :

  sylius_resource:
      resources:
          acme.mon_entite:
              driver: doctrine/orm
              classes:
                  model: Acme\MonPlugin\Entity\MonEntite
                  repository: Acme\MonPlugin\Repository\MonEntiteRepository
                  form: Acme\MonPlugin\Form\Type\MonEntiteType

  7. Tester votre plugin

  Basé sur le CmsPlugin, utilisez :
  - PHPUnit pour les tests unitaires
  - Behat pour les tests fonctionnels
  - PHPStan pour l'analyse statique

  8. Commandes utiles

  # Effacer le cache après installation
  php bin/console cache:clear

  # Installer les assets
  php bin/console assets:install

  # Mettre à jour le schéma de base de données
  php bin/console doctrine:schema:update --force

  ---
  Voulez-vous que je vous aide à créer un plugin spécifique ? Si oui, dites-moi quel type de fonctionnalité 
  vous souhaitez ajouter à Sylius, et je pourrai générer la structure complète pour vous.