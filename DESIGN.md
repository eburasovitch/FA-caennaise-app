# DESIGN.md · Force Athlétique Caennaise

> Format awesome-design-md (Google Stitch). Validée le 8 octobre 2026. Inspiré de One Rep (DA principale), Strength Lab (structure des sections) et Strength Power Club (contenu d'association). Couleurs tirées du logo du club.

## 1. Atmosphère

Une salle de force la nuit : fond presque noir, photos d'athlètes sous charge, typographie énorme et condensée, un seul rouge, celui des disques de compétition et du logo. Brut, direct, fier, mais accueillant : c'est une association, pas une salle commerciale.

Mots-clés : **fonte, craie, plateau, rouge compétition**.

## 2. Couleurs

Thème sombre unique, pas de mode clair.

| Rôle | Nom | Hex | Usage |
|---|---|---|---|
| Fond de page | Fonte | `#0b0b0b` | Toutes les sections |
| Panneau | Plateau | `#171717` | Bandeau chiffres, encarts, cartes tarifs |
| Filet | Rack | `#2a2a2a` | Séparateurs 1 px, bordures d'encarts |
| Texte principal | Craie | `#f4f1ea` | Titres et texte important |
| Texte secondaire | Poussière | `#a8a29a` | Paragraphes, légendes |
| Accent unique | Disque rouge | `#d42a24` | Bouton principal, unités des chiffres, numéros, liens actifs |
| Marque | Logo bronze | `#c9a46a` | Réservé au logo, jamais dans l'interface |

Règles :
- Le rouge ne sert **jamais** pour du texte de moins de 24 px sur fond noir (contraste 4:1). Bouton rouge = texte craie (contraste 4,9:1).
- Pas de dégradé, pas de lueur, pas de deuxième accent.

## 3. Typographie

| Rôle | Police | Graisse | Taille | Style |
|---|---|---|---|---|
| Titre géant (hero) | **Anton** | 400 | `clamp(3.5rem, 10vw, 9rem)` | Majuscules, interligne 0,88 |
| Titre de section | Anton | 400 | `clamp(2.5rem, 6vw, 5.5rem)` | Majuscules, interligne 0,9 |
| Titre d'élément | Anton | 400 | 2rem | Majuscules |
| Chiffre clé | Anton | 400 | `clamp(4rem, 7vw, 6rem)` | Unité en rouge, moitié de la taille, en exposant |
| Étiquette | **JetBrains Mono** | 500 | 0,875rem | Majuscules, interlettrage 0,04em |
| Texte | **Hanken Grotesk** | 400 | 1,0625rem | Interligne 1,6, 60 caractères max |

Effet signature : **un mot en contour** (craie, trait 2 px, intérieur transparent) dans le titre du hero. Une seule fois par page.

Toutes les polices sont libres (OFL) et auto-hébergées.

## 4. Composants

**Bouton principal** : fond rouge, texte craie, Anton ou mono majuscules, angles vifs, 48 px de haut. Survol : fond `#e8352e`. Appui : `translateY(1px)`.

**Bouton secondaire** : contour 1 px craie, texte craie. Survol : fond craie, texte noir.

**Lien texte** : mono majuscules, souligné 1 px décalé, devient rouge au survol.

**Encart d'infos** (hero) : fond noir 70 %, bordure 1 px Rack, titres Anton, valeurs en mono. Pour horaires et adresse.

**Bandeau chiffres** : 4 cellules sur fond Plateau, séparées par des filets verticaux. Étiquette mono en haut, chiffre Anton craie, unité rouge.

**Liste d'atouts** : lignes séparées par un filet, numéro Anton rouge en contour (01, 02…), titre Anton, texte à droite. Une seule liste numérotée par page.

**Carte tarif** : fond Plateau, bordure Rack, prix en Anton, liste en texte simple, bouton secondaire. La formule mise en avant a une bordure rouge.

**Carte membre du bureau** : photo carrée N&B, nom en Anton, rôle en mono.

## 5. Mise en page

- Conteneur 1320 px, gouttière 1,5 rem (mobile) à 3 rem (desktop).
- Sections : 6 à 9 rem de marge verticale.
- Alternance photo plein cadre / texte en demi-écran (pas plus de 2 à la suite).
- Titres alignés à gauche, jamais centrés sauf la conclusion.
- Grille CSS ; tout passe sur une colonne sous 768 px.

## 6. Profondeur

Aucune ombre portée. La profondeur vient des photos sombres et du contraste noir / Plateau. Photos du hero en noir et blanc avec voile noir à 55 %.

## 7. Images

- Photos réelles du club uniquement : athlètes sous charge, plateau, disques, ambiance de compétition.
- Hero : N&B. Ailleurs : couleurs naturelles, légèrement désaturées et chaudes.
- Pas de photos de banque d'images, pas d'illustrations.

## 8. À faire / À éviter

**À faire** : titres énormes et courts, un seul rouge, chiffres réels du matériel, photos des adhérents, ton direct.

**À éviter** : coins arrondis, ombres, dégradés, icônes dans des ronds colorés (style SPC), témoignages avec avatars à initiales, plus d'une liste numérotée, copier les slogans de One Rep.

## 9. Responsive

- Mobile d'abord. Points de rupture 768 px et 1024 px.
- Le titre du hero passe sur 3 à 4 lignes sur mobile, l'encart d'infos passe sous le texte.
- Le bandeau chiffres passe en 2 × 2.
- Navigation : menu plein écran sur mobile, une ligne sur desktop.

## 10. Guide pour l'agent

> Construis la section en suivant DESIGN.md : fond `#0b0b0b`, titres Anton majuscules, étiquettes JetBrains Mono, texte Hanken Grotesk `#a8a29a`, un seul accent `#d42a24`, angles vifs, aucune ombre. Vérifie les contrastes et la version mobile avec playwright-cli.
