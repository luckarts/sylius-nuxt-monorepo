# 🏠 Homepage Personnalisée - Configuration Complète

## ✅ Ce qui a été créé pour vous

### 📁 Structure des fichiers

```
AcmeStore/
├── assets/shop/
│   ├── entrypoint.js (✏️ modifié - import des styles)
│   └── scss/
│       ├── _variables.scss (✨ nouveau - variables de styles)
│       ├── _homepage.scss (✨ nouveau - styles homepage)
│       └── main.scss (✨ nouveau - point d'entrée SCSS)
│
├── config/packages/
│   └── sylius_twig_hooks.yaml (✨ nouveau - configuration des hooks)
│
├── templates/
│   ├── bundles/SyliusShopBundle/homepage/
│   │   ├── index.html.twig (✨ nouveau - template principal)
│   │   └── custom_promo.html.twig (✨ nouveau - section promo)
│   │
│   └── shop/homepage/
│       ├── hero.html.twig (✨ nouveau - référence hero)
│       ├── about.html.twig (✨ nouveau - référence about)
│       └── newsletter.html.twig (✨ nouveau - newsletter)
│
├── translations/
│   ├── messages.fr.yaml (✨ nouveau - traductions FR)
│   └── messages.en.yaml (✨ nouveau - traductions EN)
│
└── doc/
    ├── homepage-setup-guide.md (✨ nouveau - guide complet)
    └── HOMEPAGE_README.md (ce fichier)
```

---

## 🚀 Démarrage rapide (3 étapes)

### Étape 1 : Compiler les assets

```bash
cd /home/luc/Documents/sylius/AcmeStore
npm run dev
```

**Résultat attendu :**
```
✔ Compiled successfully in 2345ms
```

### Étape 2 : Vider le cache

```bash
php bin/console cache:clear
```

### Étape 3 : Créer les blocs CMS

Allez dans l'admin et créez 2 blocs :

#### Bloc 1 : `homepage_hero`
- **Code** : `homepage_hero`
- **Name** : Homepage Hero Banner
- **Enabled** : ✅
- **Content** : Voir section détaillée ci-dessous

#### Bloc 2 : `homepage_about`
- **Code** : `homepage_about`
- **Name** : Homepage About Section
- **Enabled** : ✅
- **Content** : Voir section détaillée ci-dessous

---

## 📝 Guide détaillé : Créer les blocs CMS

### Bloc Hero (homepage_hero)

**Navigation :** Admin → CMS → Blocks → Create

**Formulaire :**
```
Code: homepage_hero
Name: Homepage Hero Banner
Enabled: ✅ Yes
Channels: [Sélectionnez vos canaux]
```

**Content Elements à ajouter :**

**Option A : HTML personnalisé (Recommandé)**

Cliquez sur "Add Textarea" et collez ce HTML :

```html
<section class="cms-hero-section">
    <div class="container">
        <h1>Bienvenue dans notre boutique</h1>
        <p class="lead">Découvrez nos produits de qualité exceptionnelle</p>
        <a href="/fr/products" class="btn btn-hero btn-lg">Voir nos produits</a>
    </div>
</section>
```

**Option B : Éléments séparés**

1. **Add Heading**
   - Content : `Bienvenue dans notre boutique`
   - Level : H1

2. **Add Textarea**
   - Content : `Découvrez nos produits de qualité exceptionnelle`

3. **Add Single Media**
   - Uploadez une image de bannière (1920x600px recommandé)
   - Alt text : `Bannière principale`

**Sauvegardez le bloc**

---

### Bloc About (homepage_about)

**Navigation :** Admin → CMS → Blocks → Create

**Formulaire :**
```
Code: homepage_about
Name: Homepage About Section
Enabled: ✅ Yes
Channels: [Sélectionnez vos canaux]
```

**Content Elements à ajouter :**

**Cliquez sur "Add Textarea" et collez ce HTML :**

```html
<section class="about-section">
    <div class="container">
        <h2>Pourquoi nous choisir ?</h2>

        <div class="features-grid">
            <div class="feature-card">
                <div class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                </div>
                <h3>Qualité Premium</h3>
                <p>Des produits soigneusement sélectionnés pour leur excellence</p>
            </div>

            <div class="feature-card">
                <div class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="1" y="3" width="15" height="13"/>
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                        <circle cx="5.5" cy="18.5" r="2.5"/>
                        <circle cx="18.5" cy="18.5" r="2.5"/>
                    </svg>
                </div>
                <h3>Livraison rapide</h3>
                <p>Expédition sous 24h partout en France</p>
            </div>

            <div class="feature-card">
                <div class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                </div>
                <h3>Service client</h3>
                <p>Une équipe dédiée à votre écoute 7j/7</p>
            </div>
        </div>
    </div>
</section>
```

**Sauvegardez le bloc**

---

## 🎨 Aperçu de la homepage

Votre homepage contiendra (de haut en bas) :

1. **🎯 Hero Section** (Bloc CMS)
   - Grande bannière avec titre et CTA
   - Background violet en dégradé
   - Bouton "Voir nos produits"

2. **🔥 Dernières Offres** (Sylius Hook)
   - 8 produits en promotion
   - Grille responsive
   - Background gris clair

3. **📊 Section Promo** (Template custom)
   - Statistiques de la boutique
   - Background rose-rouge en dégradé
   - 4 stats : Clients, Produits, Livraison, Service

4. **✨ Nouvelle Collection** (Sylius Hook)
   - Produits de la nouvelle collection
   - Background blanc

5. **🆕 Derniers Produits** (Sylius Hook)
   - 12 derniers produits ajoutés
   - Background gris clair

6. **💡 Pourquoi nous choisir** (Bloc CMS)
   - 3 cartes avec icônes
   - Qualité, Livraison, Service client
   - Background blanc

---

## 🎨 Personnalisation des couleurs

Éditez : `assets/shop/scss/_variables.scss`

```scss
// Changez ces couleurs selon votre charte graphique
$homepage-hero-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
$accent-color: #667eea;
$secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
```

**Exemples de gradients :**

```scss
// Bleu océan
$homepage-hero-bg: linear-gradient(135deg, #0052D4 0%, #65C7F7 100%);

// Vert nature
$homepage-hero-bg: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);

// Orange coucher de soleil
$homepage-hero-bg: linear-gradient(135deg, #f12711 0%, #f5af19 100%);

// Rose romantique
$homepage-hero-bg: linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%);
```

Après modification, recompilez :
```bash
npm run dev
```

---

## ⚙️ Personnalisation avancée

### Modifier le nombre de produits affichés

Éditez : `config/packages/sylius_twig_hooks.yaml`

```yaml
latest_deals:
    props:
        limit: 12  # Changez de 8 à 12
```

### Ajouter votre logo dans le hero

Dans le bloc CMS `homepage_hero`, modifiez le HTML :

```html
<section class="cms-hero-section">
    <div class="container">
        <img src="/images/logo.png" alt="Logo" style="max-width: 200px; margin-bottom: 2rem;">
        <h1>Bienvenue dans notre boutique</h1>
        <!-- ... -->
    </div>
</section>
```

### Désactiver une section

Éditez : `templates/bundles/SyliusShopBundle/homepage/index.html.twig`

Commentez la section que vous ne voulez pas :

```twig
{# Section désactivée
<div class="custom-promo">
    {% hook 'sylius_shop.homepage.index', ['latest_products'] %}
</div>
#}
```

---

## 🐛 Dépannage

### Problème : Les styles ne s'appliquent pas

**Solution :**
```bash
# 1. Vérifier que l'import est bien présent dans entrypoint.js
cat assets/shop/entrypoint.js | grep "main.scss"

# 2. Recompiler les assets
npm run dev

# 3. Vider le cache
php bin/console cache:clear

# 4. Vider le cache du navigateur (Ctrl + F5)
```

### Problème : Les blocs CMS ne s'affichent pas

**Checklist :**
- [ ] Les blocs sont **activés** (Enabled: true)
- [ ] Les blocs ont les bons **codes** : `homepage_hero` et `homepage_about`
- [ ] Les blocs sont assignés aux bons **canaux**
- [ ] Le cache est vidé : `php bin/console cache:clear`

**Vérifier les blocs :**
```bash
# Lister tous les blocs CMS
php bin/console debug:container | grep cms.block
```

### Problème : Erreur 500

**Voir les logs :**
```bash
tail -f var/log/dev.log
```

**Vérifier les permissions :**
```bash
chmod -R 755 var/cache var/log
```

---

## 📱 Responsive Design

Tous les styles sont responsives et s'adaptent automatiquement :

- **Mobile** (< 768px) : 1 colonne, tailles réduites
- **Tablette** (768px - 1024px) : 2 colonnes
- **Desktop** (> 1024px) : 3-4 colonnes

Testez sur différents appareils !

---

## 🔍 SEO - Prochaines étapes

Pour optimiser le SEO de votre homepage :

1. **Meta tags** : Ajoutez dans le template
```twig
{% block title %}Votre Boutique - Produits de qualité{% endblock %}
{% block metatags %}
    <meta name="description" content="Description de votre boutique">
    <meta property="og:title" content="Votre Boutique">
    <meta property="og:image" content="/images/og-image.jpg">
{% endblock %}
```

2. **Structured data** : Ajoutez du JSON-LD
3. **Sitemap** : Installez `stefandoorn/sitemap-plugin`

---

## 📚 Ressources

- [Guide complet](./homepage-setup-guide.md) - Documentation détaillée
- [Sylius CMS Plugin](https://github.com/Sylius/CmsPlugin)
- [Sylius Documentation](https://docs.sylius.com)
- [Bootstrap 5](https://getbootstrap.com/docs/5.0/)

---

## ✅ Checklist finale

Avant de mettre en production :

- [ ] Assets compilés : `npm run build`
- [ ] Cache vidé : `php bin/console cache:clear --env=prod`
- [ ] Blocs CMS créés et activés
- [ ] Testé sur mobile, tablette, desktop
- [ ] Images optimisées (WebP recommandé)
- [ ] Couleurs personnalisées selon la charte
- [ ] Traductions vérifiées
- [ ] SEO configuré (meta tags, Open Graph)
- [ ] Performance testée (Google PageSpeed)

---

**Besoin d'aide ?** Consultez le guide complet dans `doc/homepage-setup-guide.md`

**Bon courage ! 🚀**
