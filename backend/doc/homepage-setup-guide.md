# Guide de configuration de la Homepage Personnalisée

## Fichiers créés

### 1. Templates
- `templates/bundles/SyliusShopBundle/homepage/index.html.twig` - Template principal de la homepage
- `templates/bundles/SyliusShopBundle/homepage/custom_promo.html.twig` - Section promotions
- `templates/shop/homepage/hero.html.twig` - Template de référence pour le hero
- `templates/shop/homepage/about.html.twig` - Template de référence pour la section À propos
- `templates/shop/homepage/newsletter.html.twig` - Section newsletter

### 2. Styles
- `assets/shop/scss/_variables.scss` - Variables SCSS personnalisées
- `assets/shop/scss/_homepage.scss` - Styles de la homepage
- `assets/shop/scss/main.scss` - Point d'entrée SCSS

### 3. Traductions
- `translations/messages.fr.yaml` - Traductions françaises
- `translations/messages.en.yaml` - Traductions anglaises

### 4. Configuration
- `config/packages/sylius_twig_hooks.yaml` - Configuration des hooks Twig

---

## Étapes pour finaliser la configuration

### Étape 1 : Compiler les assets

```bash
# Installer les dépendances (si nécessaire)
npm install

# Compiler les assets en mode développement
npm run dev

# OU en mode production
npm run build
```

### Étape 2 : Créer les blocs CMS dans l'admin

#### 2.1 Créer le bloc "homepage_hero"

1. Connectez-vous à l'admin : `http://votre-site/admin`
2. Allez dans **CMS** → **Blocks**
3. Cliquez sur **Create**
4. Remplissez le formulaire :

**Informations générales :**
- **Code** : `homepage_hero`
- **Name** : `Homepage Hero Banner`
- **Enabled** : ✅ Oui
- **Channels** : Sélectionnez vos canaux

**Content Elements :**

Ajoutez les éléments suivants :

1. **Textarea** (HTML personnalisé) :
```html
<section class="cms-hero-section">
    <div class="container">
        <h1>Bienvenue dans notre boutique</h1>
        <p class="lead">Découvrez nos produits de qualité exceptionnelle</p>
        <a href="/products" class="btn btn-hero btn-lg">Voir nos produits</a>
    </div>
</section>
```

OU

2. **Heading** :
   - Content : "Bienvenue dans notre boutique"
   - Level : H1

3. **Textarea** :
   - Content : "Découvrez nos produits de qualité exceptionnelle"

4. **Single Media** :
   - Uploadez une image de bannière (recommandé : 1920x600px)

#### 2.2 Créer le bloc "homepage_about"

1. Allez dans **CMS** → **Blocks**
2. Cliquez sur **Create**
3. Remplissez le formulaire :

**Informations générales :**
- **Code** : `homepage_about`
- **Name** : `Homepage About Section`
- **Enabled** : ✅ Oui
- **Channels** : Sélectionnez vos canaux

**Content Elements :**

1. **Heading** :
   - Content : "Pourquoi nous choisir ?"
   - Level : H2

2. **Textarea** (HTML pour les 3 cartes de fonctionnalités) :
```html
<div class="features-grid">
    <div class="feature-card">
        <div class="icon">🌟</div>
        <h3>Qualité Premium</h3>
        <p>Des produits soigneusement sélectionnés pour leur excellence</p>
    </div>

    <div class="feature-card">
        <div class="icon">🚚</div>
        <h3>Livraison rapide</h3>
        <p>Expédition sous 24h partout en France</p>
    </div>

    <div class="feature-card">
        <div class="icon">💬</div>
        <h3>Service client</h3>
        <p>Une équipe dédiée à votre écoute 7j/7</p>
    </div>
</div>
```

### Étape 3 : Vider le cache Symfony

```bash
php bin/console cache:clear
```

### Étape 4 : Tester la homepage

Visitez : `http://votre-site/` (ou `http://votre-site/fr/` selon votre configuration)

---

## Structure de la homepage

Voici l'ordre d'affichage des sections (de haut en bas) :

1. **Hero Banner** (Bloc CMS `homepage_hero`)
   - Bannière principale avec titre, sous-titre et bouton CTA
   - Background avec gradient violet

2. **Latest Deals** (Hook Sylius)
   - 8 produits en promotion
   - Background gris clair

3. **Custom Promo** (Template custom)
   - Section avec statistiques
   - Background avec gradient rose-rouge

4. **New Collection** (Hook Sylius)
   - Nouvelle collection de produits
   - Background blanc

5. **Latest Products** (Hook Sylius)
   - 12 derniers produits ajoutés
   - Background gris clair

6. **About Section** (Bloc CMS `homepage_about`)
   - 3 cartes de fonctionnalités (Qualité, Livraison, Service)
   - Background blanc

---

## Personnalisation

### Modifier les couleurs

Éditez `assets/shop/scss/_variables.scss` :

```scss
$homepage-hero-bg: linear-gradient(135deg, #VotreCouleur1 0%, #VotreCouleur2 100%);
$accent-color: #VotreCouleur;
```

### Modifier le nombre de produits affichés

Éditez `config/packages/sylius_twig_hooks.yaml` :

```yaml
latest_deals:
    props:
        limit: 12  # Changez ce nombre
```

### Ajouter une nouvelle section

1. Créez un nouveau template dans `templates/shop/homepage/`
2. Ajoutez-le dans `templates/bundles/SyliusShopBundle/homepage/index.html.twig`
3. Ajoutez les styles correspondants dans `assets/shop/scss/_homepage.scss`

### Désactiver une section

Dans `templates/bundles/SyliusShopBundle/homepage/index.html.twig`, commentez ou supprimez la section :

```twig
{# Section désactivée
<div class="custom-promo">
    ...
</div>
#}
```

---

## Alternative : Utiliser uniquement le CMS

Si vous préférez gérer TOUT le contenu via l'admin CMS sans coder :

1. Créez une page CMS avec le code `homepage_content`
2. Modifiez `templates/bundles/SyliusShopBundle/homepage/index.html.twig` :

```twig
{% extends '@SyliusShop/shared/layout/base.html.twig' %}

{% block content %}
    {% set homepage_page = sylius_cms_page('homepage_content') %}

    {% if homepage_page %}
        {{ sylius_cms_render_content(homepage_page) }}
    {% else %}
        {# Fallback sur les hooks par défaut #}
        {% hook 'sylius_shop.homepage.index' %}
    {% endif %}
{% endblock %}
```

3. Dans l'admin, créez la page "homepage_content" et ajoutez tous vos éléments de contenu

---

## Commandes utiles

```bash
# Compiler les assets en mode watch (recompile automatiquement)
npm run watch

# Vider le cache
php bin/console cache:clear

# Installer les assets publics
php bin/console assets:install --symlink

# Voir les routes disponibles
php bin/console debug:router | grep homepage

# Voir les hooks Twig configurés
php bin/console debug:twig-hooks
```

---

## Dépannage

### Les styles ne s'appliquent pas
1. Vérifiez que vous avez bien compilé les assets : `npm run dev`
2. Videz le cache : `php bin/console cache:clear`
3. Vérifiez que le fichier `main.scss` est bien importé dans `entrypoint.js`

### Les blocs CMS ne s'affichent pas
1. Vérifiez que les blocs sont **activés** (Enabled: true)
2. Vérifiez que les blocs sont assignés aux bons **canaux**
3. Vérifiez les codes des blocs : `homepage_hero` et `homepage_about`
4. Videz le cache : `php bin/console cache:clear`

### Les traductions ne fonctionnent pas
1. Vérifiez que les fichiers sont dans `translations/messages.{locale}.yaml`
2. Videz le cache : `php bin/console cache:clear`
3. Vérifiez la locale actuelle de votre site

### Erreur 500
1. Consultez les logs : `var/log/dev.log` ou `var/log/prod.log`
2. Activez le mode debug dans `.env` : `APP_ENV=dev`
3. Vérifiez les permissions des fichiers

---

## Prochaines étapes recommandées

1. ✅ Compiler les assets avec `npm run dev`
2. ✅ Créer les blocs CMS dans l'admin
3. ✅ Personnaliser les couleurs selon votre charte graphique
4. ✅ Ajouter vos propres images dans les blocs CMS
5. ✅ Tester sur différents appareils (mobile, tablette, desktop)
6. ✅ Optimiser les images pour la performance
7. ✅ Configurer le SEO (meta tags, Open Graph)

---

Besoin d'aide ? Consultez la documentation officielle :
- Sylius CMS Plugin : https://github.com/Sylius/CmsPlugin
- Sylius Twig Hooks : https://docs.sylius.com/en/latest/
- Webpack Encore : https://symfony.com/doc/current/frontend.html
